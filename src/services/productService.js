// services/productService.js

import client from "services/ApiClient";

export const fetchProducts = async (filters) => {
  try {
    const response = await client.get("products", { params: filters });
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

export const fetchProduct = async (id) => {
  try {
    const response = await client.get(`products/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Error fetching product");
  }
};

export const createProduct = async (product) => {
  try {
    const response = await client.post("products", product);
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
};

export const updateProduct = async (product) => {
  try {
    const response = await client.put(`products/${product.id}`, product);
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  }
};
