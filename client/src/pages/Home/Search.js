import { useCallback, useRef, useState } from "react";
import { GetProductsBysearch } from "../../Apicalls/products";
import { message } from "antd";

const Search = ({ setproducts, reloadData }) => {
  const inputElem = useRef(null);
  const [focused, setFocused] = useState(false);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const getSearchData = async (value) => {
    try {
      if (value !== "") {
        const response = await GetProductsBysearch(value);
        if (response.success) {
          setproducts(response.data);
        } else {
          throw new Error("Search failed");
        }
      } else {
        reloadData();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleSearch = useCallback(
    debounce((inputVal) => getSearchData(inputVal), 400),
    []
  );

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <span style={{
        position: "absolute", left: 14, top: "50%",
        transform: "translateY(-50%)",
        fontSize: 18, pointerEvents: "none", opacity: 0.5
      }}>🔍</span>
      <input
        type="text"
        placeholder="Search listings..."
        ref={inputElem}
        onChange={() => handleSearch(inputElem.current?.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          height: 46,
          paddingLeft: 44,
          paddingRight: 16,
          borderRadius: 12,
          border: focused ? "2px solid #4F46E5" : "2px solid #E5E7EB",
          outline: "none",
          fontSize: 14,
          background: "#fff",
          color: "#1F2937",
          transition: "border-color 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(79,70,229,0.1)" : "none",
        }}
      />
    </div>
  );
};

export default Search;
