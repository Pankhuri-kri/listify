import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { SetLoader } from "../../redux/LoadersSlice";
import { GetProducts } from "../../Apicalls/products";
import { useNavigate } from 'react-router-dom';
import Filters from "./Filters";
import { IoFilterSharp } from 'react-icons/io5';
import Search from "./Search";
import ProductCard from "./ProductCard";
import Pagination from "../../components/Pagination";
import BroadcastBanner from "../../components/BroadcastBanner";

const Home = () => {
  const [showFilters, setshowFilters] = useState(true);
  const [error, setError] = useState(false);
  const [products, setproducts] = useState([]);
  const [filters, setfilters] = useState({
    status: "approved",
    category: [],
    age: [],
    priceRange: [0, 100000],
  });
  const [currentPage, setcurrentPage] = useState(1);
  const [postPerPage] = useState(8);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        // Apply price filter client-side
        const [minP, maxP] = filters.priceRange || [0, 100000];
        const filtered = response.data.filter(p => p.price >= minP && p.price <= maxP);
        setproducts(filtered);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [filters]);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = products.slice(firstPostIndex, lastPostIndex);

  return (
    <div style={{ display: "flex", gap: 20 }}>
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setshowFilters={setshowFilters}
          filters={filters}
          setfilters={setfilters}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <BroadcastBanner />
        {/* Search bar row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!showFilters && (
            <button
              onClick={() => setshowFilters(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#4F46E5", color: "#fff",
                border: "none", borderRadius: 10,
                padding: "8px 14px", cursor: "pointer",
                fontWeight: 600, fontSize: 13, whiteSpace: "nowrap"
              }}
            >
              <IoFilterSharp size={16} /> Filters
            </button>
          )}
          <Search setproducts={setproducts} reloadData={getData} setError={setError} />
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: "#6B7280", fontSize: 14 }}>
            <span style={{ fontWeight: 700, color: "#4F46E5" }}>{products.length}</span> listings found
          </p>
        </div>

        {/* Product Grid */}
        {currentPosts.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "#fff", borderRadius: 16,
            border: "1px dashed #E5E7EB"
          }}>
            <p style={{ fontSize: 40 }}>📦</p>
            <p style={{ color: "#9CA3AF", fontSize: 16, fontWeight: 500 }}>No listings found</p>
            <p style={{ color: "#D1D5DB", fontSize: 13 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: showFilters
              ? "repeat(auto-fill, minmax(220px, 1fr))"
              : "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20
          }}>
            <ProductCard products={currentPosts} />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <Pagination
            totalPosts={products.length}
            postsPerPage={postPerPage}
            setcurrentPage={setcurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
