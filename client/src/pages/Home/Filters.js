import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Slider } from "antd";

const categories = [
  { name: "Electronics", value: "electronic" },
  { name: "Home", value: "home" },
  { name: "Fashion", value: "fashion" },
  { name: "Sports", value: "sport" },
  { name: "Books", value: "book" },
];

const usagePeriods = [
  { name: "0–2 Months/Years", value: "0-2" },
  { name: "3–5 Months/Years", value: "3-5" },
  { name: "6–8 Months/Years", value: "6-8" },
  { name: "9–12 Months/Years", value: "9-12" },
  { name: "13+ Months/Years", value: "12-20" },
];

const Filters = ({ showFilters, setshowFilters, filters, setfilters }) => {
  const handlePriceChange = (value) => {
    setfilters({ ...filters, priceRange: value });
  };

  return (
    <div style={{
      width: 260,
      minWidth: 260,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 16px rgba(79,70,229,0.08)",
      padding: "20px 16px",
      height: "fit-content",
      border: "1px solid #EEF0FF"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: "#4F46E5", fontWeight: 700, fontSize: 16, margin: 0, letterSpacing: 0.5 }}>
          🎛️ Filters
        </h2>
        <RxCross2
          size={18}
          style={{ cursor: "pointer", color: "#9CA3AF" }}
          onClick={() => setshowFilters(!showFilters)}
        />
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
          Price Range
        </p>
        <Slider
          range
          min={0}
          max={100000}
          step={500}
          value={filters.priceRange || [0, 100000]}
          onChange={handlePriceChange}
          tooltip={{ formatter: (v) => `₹${v.toLocaleString()}` }}
          trackStyle={[{ backgroundColor: "#4F46E5" }]}
          handleStyle={[{ borderColor: "#4F46E5" }, { borderColor: "#4F46E5" }]}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B7280", marginTop: 4 }}>
          <span>₹{(filters.priceRange?.[0] || 0).toLocaleString()}</span>
          <span>₹{(filters.priceRange?.[1] || 100000).toLocaleString()}</span>
        </div>
      </div>

      <hr style={{ borderColor: "#F3F4F6", margin: "16px 0" }} />

      {/* Categories */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Category
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {categories.map((category, ind) => (
            <label key={ind} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={filters.category.includes(category.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setfilters({ ...filters, category: [...filters.category, category.value] });
                  } else {
                    setfilters({ ...filters, category: filters.category.filter((item) => item !== category.value) });
                  }
                }}
                style={{
                  width: 16, height: 16,
                  accentColor: "#4F46E5",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: 14, color: "#374151" }}>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <hr style={{ borderColor: "#F3F4F6", margin: "16px 0" }} />

      {/* Usage Period (was Age) */}
      <div>
        <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Usage Period
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {usagePeriods.map((period, ind) => (
            <label key={ind} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={filters.age.includes(period.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setfilters({ ...filters, age: [...filters.age, period.value] });
                  } else {
                    setfilters({ ...filters, age: filters.age.filter((item) => item !== period.value) });
                  }
                }}
                style={{
                  width: 16, height: 16,
                  accentColor: "#4F46E5",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: 13, color: "#374151" }}>{period.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => setfilters({ status: "approved", category: [], age: [], priceRange: [0, 100000] })}
        style={{
          width: "100%",
          marginTop: 20,
          padding: "8px 0",
          background: "#F3F4F6",
          color: "#6B7280",
          border: "none",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s"
        }}
        onMouseEnter={e => e.target.style.background = "#E5E7EB"}
        onMouseLeave={e => e.target.style.background = "#F3F4F6"}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
