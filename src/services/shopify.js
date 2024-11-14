import client from "services/ApiClient";

export const shopifyCreateProduct = async (product) => {
  try {
    const { title, descriptionHTML, price, imageURLs } = product;
    console.log(title, descriptionHTML, price, imageURLs);
    const response = await client.post("Shopify/CreateProduct", product);
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

export const shopifyGetProducts = async () => {
  try {
    const response = await client.get("Shopify/GetProducts");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};
