// services/productFinderService.js
import client from "services/ApiClient";

export const productsFinder = async ({
  searchText = null,
  AmazonCategoryId = null,
  AmazonSubCategoryId = null,
  AmazonThirdCategoryId = null,
  priceFrom = null,
  priceTo = null,
  sort_by = null,
  page = 0,
  total_rows = 10,
}) => {
  try {
    const response = await client.get("productfinder", {
      params: {
        searchText,
        AmazonCategoryId,
        AmazonSubCategoryId,
        AmazonThirdCategoryId,
        priceFrom,
        priceTo,
        page,
        total_rows,
        sort_by,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

export const productFinderCategories = async () => {
  try {
    const response = await client.get("productfinder/categories?include_child=true");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const productFinderSubCategories = async (parent_categoryId) => {
  try {
    const response = await client.get(
      `productfinder/subcategories?include_child=true&parent_categoryId=${parent_categoryId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching  subcategories:", error);
    throw error;
  }
};

export const productFinderPriceRange = async () => {
  try {
    const response = await client.get("productfinder/pricerange");
    return response;
  } catch (error) {
    console.error("Error fetching price range:", error);
    throw error;
  }
};
