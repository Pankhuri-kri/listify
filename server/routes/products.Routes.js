const authMiddlewares = require("../middlewares/authMiddlewares");
const ProductModel = require("../models/products.model");
const router = require("express").Router();
const multer = require("multer");
const UserModel = require("../models/user.model");
const notificationModel = require("../models/notification.model");

// add a new product
router.post('/add-products', authMiddlewares, async(req, res) => {
  try {
    req.body.status = 'approved';
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    const username = await UserModel.findById(req.body.userId);
    const admins = await UserModel.find({ role: 'admin' });
    admins.forEach(async (admin) => {
      const newNotification = new notificationModel({
        user: admin._id,
        title: "New product added",
        message: `New Product Added by ${username.name}`,
        onClick: '/admin',
        read: false,
      });
      await newNotification.save();
    });
    res.send({ success: true, message: "product add successfully", data: newProduct });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// get all products
router.post('/get-products', async(req, res) => {
  try {
    const { seller, category = [], age = [], status } = req.body;
    let filters = {};
    if (seller) filters.seller = seller;
    if (status) filters.status = status;
    if (category.length > 0) filters.category = { $in: category };
    if (age.length > 0) {
      age.forEach((item) => {
        const fromAge = item.split("-")[0];
        const toAge = item.split("-")[1];
        filters.age = { $gte: Number(fromAge), $lte: Number(toAge) };
      });
    }
    const products = await ProductModel.find(filters).populate("seller").sort({ createdAt: -1 });
    res.send({ success: true, data: products });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// get products by search
router.get('/search/:key', async(req, res) => {
  try {
    const response = await ProductModel.find({
      '$or': [{ name: { $regex: req.params.key, $options: 'i' } }]
    });
    res.send({ success: true, data: response });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// get product by id
router.get('/get-product-by-id/:id', authMiddlewares, async(req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate('seller');
    res.send({ success: true, data: product });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// edit product
router.put('/edit-products/:id', authMiddlewares, async(req, res) => {
  try {
    await ProductModel.findByIdAndUpdate(req.params.id, req.body);
    res.send({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// delete product
router.delete('/delete-products/:id', authMiddlewares, async(req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.send({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.send({ success: true, message: error.message });
  }
});

// Upload image — stored as base64 in MongoDB (no Cloudinary needed)
const storage = multer.memoryStorage();

router.post('/upload-product-image', authMiddlewares, multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('file'), async(req, res) => {
  try {
    if (!req.file) {
      return res.send({ success: false, message: 'No file uploaded' });
    }

    // Convert buffer to base64 data URL
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const productId = req.body.productId;
    await ProductModel.findByIdAndUpdate(productId, {
      $push: { images: dataUrl },
    });

    res.send({
      success: true,
      message: 'Image uploaded successfully',
      data: dataUrl,
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// update product status by admin
router.put('/update-product-status/:id', authMiddlewares, async(req, res) => {
  try {
    const { status } = req.body;
    const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, { status });
    const notification = new notificationModel({
      user: updatedProduct.seller,
      title: 'product status updated',
      message: `your product ${updatedProduct.name} has been ${status}`,
      onClick: '/profile',
      read: false,
    });
    await notification.save();
    res.send({ success: true, message: "products status updated successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

module.exports = router;
