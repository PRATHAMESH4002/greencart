import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // IMPORTANT for auth
});

// SELLER PRODUCTS
export const getSellerProducts = () =>
  API.get("/seller/products");

export const addSellerProduct = (data) =>
  API.post("/seller/products", data);

export const deleteSellerProduct = (id) =>
  API.delete(`/seller/products/${id}`);

export const updateSellerProduct = (id, data) =>
  API.put(`/seller/products/${id}`, data);

// SELLER STATS
export const getSellerStats = () =>
  API.get("/seller/stats");
