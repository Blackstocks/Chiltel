import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import { toast } from "react-toastify";

const ServiceCartContext = createContext();

export const ServiceCartProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [serviceCart, setServiceCart] = useState([]);
  const [serviceCartAmount, setServiceCartAmount] = useState(0);
  const [serviceCartCount, setServiceCartCount] = useState(0);
  const [serviceCartLoading, setServiceCartLoading] = useState(false);
  const { isAuthenticated, loading, user } = useContext(AuthContext);


  useEffect(() => {
    if (isAuthenticated && user) {
      //   getServiceCartAmount(user._id);
      //   getServiceCartCount(user._id);
      console.log("user: ", user);
      fetchServiceCart();
    } else {
      setServiceCart([]);
    }
  }, [isAuthenticated, user, loading]);

  const fetchServiceCart = async () => {
    if (user) {
      try {
        setServiceCartLoading(true);
        const response = await axios.get(
          backendUrl +
            `/api/serviceRequests/user/${user._id ? user._id : user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("serviceCart: ", response.data.data);
        setServiceCart(response.data.data);
        console.log("Requested services: ", response.data.data);
      } catch (error) {
        console.error("Failed to fetch service cart:", error);
      } finally {
        setServiceCartLoading(false);
      }
    }
  };

  const addToServiceCart = async (scheduleService, serviceRequest) => {
    const token = localStorage.getItem("token");

    console.log(serviceRequest);
    if (!isAuthenticated) {
      toast.info("Please log in to add this service to your cart.");
    } else {
      try {
        console.log("Scheduled Service:", scheduleService);
        const response = await axios.post(
          `${backendUrl}/api/serviceRequests/`,
          serviceRequest
        );
        fetchServiceCart();
        console.log("service request: ", response.data);
        toast.success("Service request created");
      } catch (err) {
        toast.error("Something went wrong");
        console.error("Error while adding service to cart: ", err);
      }
    }
  };

  const removeFromServiceCart = async (userId, serviceId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendUrl}/api/service-cart/remove`,
        { userId, serviceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        getServiceCartAmount(userId);
        setServiceCart(response.data.serviceCartData);
        return {
          success: true,
          updatedServiceCart: response.data.serviceCartData,
        };
      } else {
        throw new Error("Failed to remove service from cart");
      }
    } catch (error) {
      console.error("Error removing service from cart:", error.message);
      return { success: false, error: error.message };
    }
  };

  const updateServiceQuantity = async (userId, serviceId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendUrl}/api/service-cart/update`,
        { userId, serviceId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        getServiceCartAmount(userId);
        setServiceCart(response.data.serviceCart);
        return { success: true, updatedServiceCart: response.data.serviceCart };
      } else {
        throw new Error("Failed to update service quantity in cart");
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getServiceCartAmount = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        backendUrl + "/api/service-cart/get",
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServiceCartAmount(response.data.serviceCartData.totalAmount);
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const getServiceCartCount = async (userId) => {
    let totalCount = 0;
    const token = localStorage.getItem("token");
    const response = await axios.post(
      backendUrl + "/api/service-cart/get",
      {
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const services = response.data.serviceCartData.items;
    for (let item of services) {
      totalCount += item.quantity;
    }
    setServiceCartCount(totalCount);
  };

  const value = {
    serviceCart,
    serviceCartLoading,
    addToServiceCart,
    updateServiceQuantity,
    removeFromServiceCart,
    fetchServiceCart,
    serviceCartAmount,
    serviceCartCount,
  };

  return (
    <ServiceCartContext.Provider value={value}>
      {children}
    </ServiceCartContext.Provider>
  );
};

export const useServiceCart = () => {
  const context = useContext(ServiceCartContext);
  if (!context) {
    throw new Error("useServiceCart must be used within a ServiceCartProvider");
  }
  return context;
};

export default ServiceCartContext;
