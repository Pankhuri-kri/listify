import React, { useState } from "react";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/LoadersSlice";
import { EditProduct, UploadProductImage } from "../../../Apicalls/products";
import { MdDeleteForever } from "react-icons/md";

const Images = ({ selectedProduct, getData, setshowProductForm }) => {
  const [images, setImages] = useState(selectedProduct?.images || []);
  const [previewFile, setPreviewFile] = useState(null);   // { file, previewUrl }
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      message.error("File too large. Max 5MB.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPreviewFile({ file, previewUrl });
  };

  const upload = async () => {
    if (!previewFile) return;
    try {
      dispatch(SetLoader(true));
      const formData = new FormData();
      formData.append("file", previewFile.file);
      formData.append("productId", selectedProduct._id);
      const response = await UploadProductImage(formData);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success("Image uploaded!");
        setImages(prev => [...prev, response.data]);
        setPreviewFile(null);
        getData();
      } else {
        message.error(response.message || "Upload failed");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const handleDelete = async (image) => {
    try {
      dispatch(SetLoader(true));
      const updatedImages = images.filter(img => img !== image);
      const response = await EditProduct(selectedProduct._id, {
        ...selectedProduct,
        images: updatedImages
      });
      dispatch(SetLoader(false));
      if (response.success) {
        message.success("Image removed");
        setImages(updatedImages);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      {/* Existing images */}
      {images.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
            Uploaded Images ({images.length})
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {images.map((image, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "2px solid #EEF0FF",
                  width: 100, height: 100,
                }}
                className="group"
              >
                <img
                  src={image}
                  alt={`product-${i}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  onClick={() => handleDelete(image)}
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(239,68,68,0.75)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, cursor: "pointer", transition: "opacity 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <MdDeleteForever size={28} color="#fff" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: "center", padding: "24px 0",
          color: "#9CA3AF", fontSize: 13, marginBottom: 16
        }}>
          No images yet — add your first photo below
        </div>
      )}

      {/* Upload area */}
      <div style={{
        border: "2px dashed #C7D2FE",
        borderRadius: 12,
        padding: 20,
        background: "#F5F3FF",
        textAlign: "center",
      }}>
        {previewFile ? (
          <div>
            <img
              src={previewFile.previewUrl}
              alt="preview"
              style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 8, marginBottom: 12, objectFit: "contain" }}
            />
            <p style={{ color: "#4F46E5", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              {previewFile.file.name}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  background: "#F3F4F6", color: "#6B7280",
                  border: "none", borderRadius: 8,
                  padding: "8px 18px", fontWeight: 600, cursor: "pointer"
                }}
              >
                Remove
              </button>
              <button
                onClick={upload}
                style={{
                  background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                  color: "#fff", border: "none", borderRadius: 8,
                  padding: "8px 18px", fontWeight: 700, cursor: "pointer"
                }}
              >
                ✓ Upload this image
              </button>
            </div>
          </div>
        ) : (
          <label style={{ cursor: "pointer", display: "block" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
            <p style={{ color: "#4F46E5", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              Click to choose an image
            </p>
            <p style={{ color: "#9CA3AF", fontSize: 12 }}>PNG, JPG up to 5MB</p>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {/* Done button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <button
          onClick={() => { getData(); setshowProductForm(false); }}
          style={{
            background: images.length > 0
              ? "linear-gradient(135deg, #4F46E5, #7C3AED)"
              : "#F3F4F6",
            color: images.length > 0 ? "#fff" : "#6B7280",
            border: "none", borderRadius: 10,
            padding: "10px 24px", fontWeight: 700,
            fontSize: 14, cursor: "pointer"
          }}
        >
          {images.length > 0 ? "Done ✓" : "Skip for now"}
        </button>
      </div>
    </div>
  );
};

export default Images;
