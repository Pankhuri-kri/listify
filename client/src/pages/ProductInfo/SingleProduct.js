import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, message } from "antd";
import { SetLoader } from "../../redux/LoadersSlice";
import { GetProductById, getAllBids } from "../../Apicalls/products";
import Divider from "../../components/Divider";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import BidModel from "./BidModel";
import Spinner from "../../components/Spinner";
import { StartChat } from "../../Apicalls/chats";

const SingleProduct = () => {
  const { user } = useSelector((state) => state.users);
  const { loading } = useSelector((state) => state.loaders);
  const [selectedImagesIndex, setselectedImagesIndex] = useState(0);
  const [showAddNewBid, setshowAddNewBid] = useState(false);
  const [product, setproduct] = useState(null);
  const [filters, setfilters] = useState({
    status: "approved",
  });

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleStartChat = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await StartChat(id);
      dispatch(SetLoader(false));
      if (response.success) {
        navigate(`/chat/${response.data._id}`);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      // dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse = await getAllBids({ product: id });
        setproduct({
          ...response.data,
          bids: bidsResponse.data,
        });
      } else {
        throw new Error("Product not fiilters");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };


  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="">
        <div className="grid grid-cols-2 gap-5 mt-5">
          <div className="flex flex-col gap-5">
            <img
              src={product?.images[selectedImagesIndex]}
              alt="productImg"
              className="w-full h-96 object-cover rounded-md border border-solid"
            />
            <div className="flex gap-2">
              {product?.images?.map((image, index) => {
                return (
                  <img
                    key={index}
                    className={
                      "w-20 h-20 object-cover rounded-md cursor-pointer p-2" +
                      (selectedImagesIndex === index
                        ? "border-2 border-solid border-green-700"
                        : "")
                    }
                    src={image}
                    onClick={() => setselectedImagesIndex(index)}
                    alt="pics"
                  />
                );
              })}
            </div>
            <Divider />
            <div>
              <h1 style={{ color: "#203A43", letterSpacing: "1px" }}>
                Added On
              </h1>
              <span>
                {moment(product?.createdAt).format("MMM D , YYYY hh:mm A")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{ color: "#203A43", letterSpacing: "1px" }}
              >
                {product?.name}
              </h1>
              <span>{product?.description}</span>
            </div>

            <Divider />
            <div className="flex flex-col">
              <h1
                className="text-2xl font-semibold"
                style={{ color: "#203A43", letterSpacing: "1px" }}
              >
                Product Details
              </h1>

              <div className="flex justify-between mt-2">
                <span>Price</span>
                <span>${product?.price}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Category</span>
                <span>{product?.category}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Bill Available</span>
                <span>{product?.billAvailable ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Warranty Available</span>
                <span>{product?.warrantyAvailable ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Accessories Available</span>
                <span>{product?.accessoriesAvailable ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Box Available</span>
                <span>{product?.boxAvailable ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Product Damage</span>
                <span>{product?.productdamage ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>First Owner</span>
                <span>{product?.firstowner ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Scratches on product</span>
                <span>{product?.scratches ? "Yes" : "No"}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>product age</span>
                <span>
                  {product?.age} {product?.monYears}
                </span>
              </div>

              {product?.monYears === "Months" ? (
                <div className="flex justify-between mt-2">
                  <span>Purchased Month</span>
                  <span>
                    {moment()
                      .subtract(product?.age, "Months")
                      .format("MMM-YYYY")}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between mt-2">
                  <span>Purchased Year</span>
                  <span>
                    {moment().subtract(product?.age, "years").format("YYYY")}
                  </span>
                </div>
              )}
            </div>

            <Divider />
            <div className="flex flex-col">
              <h1
                className="text-2xl font-semibold"
                style={{ color: "#203A43", letterSpacing: "1px" }}
              >
                Seller Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Owner Name</span>
                <span>{product?.seller?.name}</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Email</span>
                <span>{product?.seller?.email}</span>
              </div>

              {user?._id !== product?.seller?._id && (
                <Button
                  type="primary"
                  className="mt-4"
                  style={{ background: "#0F9B8E", borderColor: "#0F9B8E" }}
                  onClick={handleStartChat}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  }
                >
                  Chat with Seller
                </Button>
              )}
            </div>

            {/* bids */}

            <Divider />
            <div className="flex flex-col">
              <div className="flex justify-between mb-5">
                <h1
                  className="text-2xl font-semibold"
                  style={{ color: "#203A43", letterSpacing: "1px" }}
                >
                  Bids
                </h1>
                <Button
                  onClick={() => setshowAddNewBid(!showAddNewBid)}
                  disabled={user?._id === product?.seller?._id}
                >
                  New Bid
                </Button>
              </div>

              {product?.showBidsProductPage &&
                product?.bids?.map((bid) => {
                  return (
                    <div className="border border-gray-300 border-solid p-2 rounded m-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Name</span>
                        <span>{bid?.buyer?.name}</span>
                      </div>

                      <div className="flex justify-between text-gray-600">
                        <span>Bid Amount</span>
                        <span>${bid?.bidAmount}</span>
                      </div>

                      <div className="flex justify-between text-gray-600">
                        <span>Bid Place On</span>
                        <span>
                          {moment(bid?.createdAt)?.format(
                            "MMM D ,YYYY hh:mm A",
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {showAddNewBid && (
          <BidModel
            product={product}
            reloadData={getData}
            showBidModel={showAddNewBid}
            setshowBidModel={setshowAddNewBid}
          />
        )}
      </div>
    </>
  );
};

export default SingleProduct;
