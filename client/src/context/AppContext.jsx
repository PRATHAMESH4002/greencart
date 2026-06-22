import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false); // ✅ seller state
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- SELLER AUTH ---------------- */
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success); // ✅ correct
    } catch {
      setIsSeller(false);
    }
  };

  /* ---------------- USER + CART AUTH ---------------- */
  const fetchUser = async () => {
    try {
      const { data } = await axios.post("/api/user/is-auth", {});
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      }
    } catch (err) {
      console.log("Auth error:", err.message);
    }
  };

  /* ---------------- FETCH CART ---------------- */
  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/cart");
      if (data && data.items) {
        const formattedCart = {};
        data.items.forEach((item) => {
          formattedCart[item.product._id] = item.quantity;
        });
        setCartItems(formattedCart);
      }
    } catch (err) {
      console.log("Cart fetch error:", err.message);
    }
  };

  /* ---------------- PRODUCTS ---------------- */
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.log(err.message);
    }
  };

  /* ---------------- CART ACTIONS ---------------- */
  const addToCart = (itemId) => {
    if (!user) {
      toast.error("Login to add to cart");
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    toast.success("Added To Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    setCartItems((prev) => ({ ...prev, [itemId]: quantity }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId]--;
      else delete updated[itemId];
      return updated;
    });
    toast.success("Removed From Cart");
  };

  /* ---------------- CART HELPERS ---------------- */
  const getCartCount = () =>
    Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += cartItems[id] * product.offerPrice;
    }
    return Math.floor(total * 100) / 100;
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  /* ---------------- UPDATE CART TO DB ---------------- */
  useEffect(() => {
    const updateCart = async () => {
      try {
        await axios.post("/api/cart/update", { cartItems });
      } catch (err) {
        console.log(err.message);
      }
    };
    if (user) updateCart();
  }, [cartItems]);

  /* ---------------- CONTEXT VALUE ---------------- */
  const value = {
    navigate,
    user,
    setUser,

    isSeller,
    setIsSeller, // ✅ ✅ FIXED (THIS WAS MISSING)

    showUserLogin,
    setShowUserLogin,

    products,
    currency,

    cartItems,
    setCartItems,

    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getCartAmount,

    searchQuery,
    setSearchQuery,

    axios,
    fetchSeller,
    fetchProducts,
    fetchCart,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
