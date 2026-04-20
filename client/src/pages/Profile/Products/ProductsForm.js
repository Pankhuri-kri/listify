import { Col, Form, Input, Row, Tabs, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal/Modal";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/LoadersSlice";
import { AddProduct, EditProduct } from "../../../Apicalls/products";
import Images from "./Images";

const AddtionalThings = [
  { label: "Bill Available", name: "billAvailable" },
  { label: "Warranty Available", name: "warrantyAvailable" },
  { label: "Accessories Available", name: "accessoriesAvailable" },
  { label: "Box Available", name: "boxAvailable" },
  { label: "Product Damage", name: "productdamage" },
  { label: "First Owner", name: "firstowner" },
  { label: "Scratches on product", name: "scratches" },
];

const rules = [{ required: true, message: "Required field" }];

const ProductsForm = ({ showProductForm, setshowProductForm, selectedProduct, getData }) => {
  const [selectedTab, setselectedTab] = useState("1");
  // savedProduct holds the product after step-1 save, so Images tab gets a real _id
  const [savedProduct, setSavedProduct] = useState(selectedProduct || null);
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const { user } = useSelector((state) => state.users);

  const onFinish = async (value) => {
    try {
      dispatch(SetLoader(true));
      let response = null;
      if (savedProduct) {
        response = await EditProduct(savedProduct._id, value);
        dispatch(SetLoader(false));
        if (response.success) {
          message.success("Details saved! Now add images.");
          // keep modal open, switch to Images tab
          setselectedTab("2");
        } else {
          message.error(response.message);
        }
      } else {
        value.seller = user._id;
        value.status = "approved";
        response = await AddProduct(value);
        dispatch(SetLoader(false));
        if (response.success) {
          message.success("Product saved! Now add photos →");
          getData();
          setSavedProduct(response.data);
          setselectedTab("2");
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      setSavedProduct(selectedProduct);
      formRef.current?.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);

  const isImagesTabEnabled = !!savedProduct;

  return (
    <Modal
      title=""
      open={showProductForm}
      onCancel={() => { setshowProductForm(false); getData(); }}
      centered={true}
      width={900}
      okText={selectedTab === "1" ? (savedProduct ? "Save Changes →" : "Save & Add Images →") : false}
      okButtonProps={{ style: { background: "#4F46E5", borderColor: "#4F46E5", fontWeight: 700 }, hidden: selectedTab === "2" }}
      cancelText={selectedTab === "2" ? "Done" : "Cancel"}
      onOk={() => { formRef.current.submit(); }}
    >
      <div>
        <h1 style={{ textAlign: "center", color: "#4F46E5", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
          {savedProduct ? "✏️ Edit Listing" : "📦 Add New Listing"}
        </h1>
        <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: 13, marginBottom: 16 }}>
          {selectedTab === "1"
            ? "Step 1 — Fill in product details, then save to add images"
            : "Step 2 — Upload photos of your product"}
        </p>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {["1","2"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: selectedTab === step ? "#4F46E5" : (isImagesTabEnabled && step === "2" ? "#E0E7FF" : "#F3F4F6"),
                color: selectedTab === step ? "#fff" : (isImagesTabEnabled && step === "2" ? "#4F46E5" : "#9CA3AF"),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700
              }}>{step}</div>
              <span style={{ fontSize: 13, color: selectedTab === step ? "#4F46E5" : "#9CA3AF", fontWeight: selectedTab === step ? 600 : 400 }}>
                {step === "1" ? "Details" : "Images"}
              </span>
              {i === 0 && <div style={{ width: 32, height: 2, background: isImagesTabEnabled ? "#4F46E5" : "#E5E7EB", borderRadius: 2 }} />}
            </div>
          ))}
        </div>

        <Tabs
          activeKey={selectedTab}
          onChange={(key) => {
            if (key === "2" && !isImagesTabEnabled) {
              message.warning("Please save general info first.");
              return;
            }
            setselectedTab(key);
          }}
          tabBarStyle={{ display: "none" }} // hide default tabs — we use step indicator
        >
          <Tabs.TabPane key="1">
            <Form layout="vertical" ref={formRef} onFinish={onFinish}>
              <Form.Item label="Product Name" name="name" rules={rules}>
                <Input type="text" placeholder="e.g. Sony WH-1000XM4 Headphones" />
              </Form.Item>

              <Form.Item label="Description" name="description" rules={rules}>
                <TextArea rows={3} placeholder="Describe your product's condition, features, and any issues..." />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Form.Item label="Price (₹)" name="price" rules={rules}>
                    <Input type="number" prefix="₹" placeholder="0" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Category" name="category" rules={rules}>
                    <select style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #d9d9d9" }}>
                      <option value="">Select Category</option>
                      <option value="electronic">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="home">Home</option>
                      <option value="sport">Sports</option>
                      <option value="book">Books</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Usage Duration" name="age" rules={rules}>
                    <Input type="number" placeholder="e.g. 6" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Duration Unit" name="monYears" rules={rules}>
                    <select style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #d9d9d9" }}>
                      <option value="">Select Unit</option>
                      <option value="Months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </Form.Item>
                </Col>
              </Row>

              <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Product Details
              </p>
              <div className="flex flex-wrap gap-5">
                {AddtionalThings.map((item, index) => (
                  <Form.Item key={index} label={item.label} name={item.name} valuePropName="checked">
                    <Input
                      type="checkbox"
                      onChange={(e) => { formRef.current.setFieldsValue({ [item.name]: e.target.checked }); }}
                      checked={formRef.current?.getFieldValue(item.name)}
                      style={{ accentColor: "#4F46E5" }}
                    />
                  </Form.Item>
                ))}
              </div>

              <Row>
                <Col span={8}>
                  <Form.Item label="Show Bids on Product Page" name="showBidsProductPage" valuePropName="checked">
                    <Input
                      type="checkbox"
                      onChange={(e) => { formRef.current.setFieldsValue({ showBidsProductPage: e.target.checked }); }}
                      checked={formRef.current?.getFieldValue("showBidsProductPage")}
                      style={{ width: 50, marginLeft: 15, accentColor: "#4F46E5" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane key="2">
            {savedProduct && (
              <Images
                selectedProduct={savedProduct}
                getData={getData}
                setshowProductForm={setshowProductForm}
              />
            )}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default ProductsForm;
