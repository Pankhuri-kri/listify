import moment from "moment";
import { useNavigate } from "react-router-dom";

const categoryColors = {
  electronic: { bg: "#EEF2FF", color: "#4338CA", label: "Electronics" },
  home: { bg: "#FFF7ED", color: "#C2410C", label: "Home" },
  fashion: { bg: "#FDF4FF", color: "#9333EA", label: "Fashion" },
  sport: { bg: "#F0FDF4", color: "#16A34A", label: "Sports" },
  book: { bg: "#FFFBEB", color: "#D97706", label: "Books" },
};

const ProductCard = ({ products }) => {
  const navigate = useNavigate();

  return (
    <>
      {products.map((product) => {
        const cat = categoryColors[product.category] || { bg: "#F3F4F6", color: "#6B7280", label: product.category };
        const purchaseYear = moment().subtract(product.age, product.monYears === "Months" ? "months" : "years").format(
          product.monYears === "Months" ? "MMM YYYY" : "YYYY"
        );

        return (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(79,70,229,0.08)",
              border: "1px solid #EEF0FF",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.16)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(79,70,229,0.08)";
            }}
          >
            {/* Image */}
            <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Category badge */}
              <span style={{
                position: "absolute", top: 10, left: 10,
                background: cat.bg, color: cat.color,
                fontSize: 11, fontWeight: 700,
                padding: "3px 10px", borderRadius: 20,
                letterSpacing: 0.3
              }}>
                {cat.label}
              </span>
              {/* Image count */}
              {product.images.length > 1 && (
                <span style={{
                  position: "absolute", bottom: 10, right: 10,
                  background: "rgba(0,0,0,0.5)", color: "#fff",
                  fontSize: 11, fontWeight: 600,
                  padding: "2px 8px", borderRadius: 20,
                }}>
                  +{product.images.length - 1} more
                </span>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <h3 style={{
                margin: 0, fontSize: 15, fontWeight: 700,
                color: "#1F2937",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
              </h3>

              <p style={{
                margin: 0, fontSize: 13, color: "#6B7280",
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                lineHeight: 1.5
              }}>
                {product.description}
              </p>

              <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  fontSize: 18, fontWeight: 800, color: "#4F46E5"
                }}>
                  ₹{product.price.toLocaleString()}
                </span>
                <span style={{
                  fontSize: 11, color: "#9CA3AF", background: "#F9FAFB",
                  padding: "3px 8px", borderRadius: 8, border: "1px solid #F3F4F6"
                }}>
                  Used {product.age} {product.monYears}
                </span>
              </div>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                color: "#fff", borderRadius: 10, padding: "8px 0",
                fontSize: 13, fontWeight: 600, marginTop: 4,
                letterSpacing: 0.3
              }}>
                View Details →
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductCard;
