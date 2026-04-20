const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const BroadcastModel = require('../models/broadcast.model');
const NotificationModel = require('../models/notification.model');
const UserModel = require('../models/user.model');

// Admin: create a broadcast
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const admin = await UserModel.findById(req.body.userId);
    if (!admin || admin.role !== 'admin') {
      return res.send({ success: false, message: 'Unauthorized' });
    }
    const broadcast = new BroadcastModel({
      title: req.body.title,
      message: req.body.message,
      type: req.body.type || 'announcement',
      postedBy: req.body.userId,
      active: true,
    });
    await broadcast.save();

    // Send notification to ALL users
    const allUsers = await UserModel.find({ role: 'user' });
    const notifications = allUsers.map(user => ({
      user: user._id,
      title: `📢 ${req.body.title}`,
      message: req.body.message,
      onClick: '/',
      read: false,
    }));
    await NotificationModel.insertMany(notifications);

    res.send({ success: true, message: 'Broadcast sent to all users!', data: broadcast });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// Get all active broadcasts (for homepage banner)
router.get('/active', async (req, res) => {
  try {
    const broadcasts = await BroadcastModel.find({ active: true })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    res.send({ success: true, data: broadcasts });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// Get all broadcasts (admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const broadcasts = await BroadcastModel.find()
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.send({ success: true, data: broadcasts });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// Toggle active status
router.put('/toggle/:id', authMiddleware, async (req, res) => {
  try {
    const broadcast = await BroadcastModel.findById(req.params.id);
    broadcast.active = !broadcast.active;
    await broadcast.save();
    res.send({ success: true, message: 'Status updated', data: broadcast });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// Delete broadcast
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    await BroadcastModel.findByIdAndDelete(req.params.id);
    res.send({ success: true, message: 'Broadcast deleted' });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

module.exports = router;
