// src/api/dealService.js
import client from "services/ApiClient";

export const fetchDealCategories = async () => {
  try {
    const response = await client.get("deals/categories?include_child=false");
    return response;
  } catch (error) {
    console.error("Error fetching deal categories:", error);
    throw error;
  }
};
export const fetchDealSubCategories = async (parent_categoryId) => {
  try {
    const response = await client.get(
      `deals/subcategories?include_child=true&parent_categoryId=${parent_categoryId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching deal categories:", error);
    throw error;
  }
};

export const fetchDeals = async (filters) => {
  console.log("filters", filters, Object.keys(filters));
  if (!filters || Object.keys(filters).length === 0) return { data: [] };

  try {
    const response = await client.get("deals", { params: filters });
    console.log(response);
    if (filters.hideNoSalesRank) {
      const data = response.data;
      response.data = data.filter((deal) => deal.deal_salesrank !== 0);
    }

    // response = response.map((deal) => {
    //   const profit = deal.deal_priceAmazon + deal.deal_fbaFees - deal.deal_priceSource;
    //   const pack = deal.deal_title.toLowerCase().includes("pack");
    //   return { ...deal, deal_profit: profit, deal_pack: pack };
    // });
    return response;
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw error;
  }
};

export const checkDeal = async (deal) => {
  try {
    const response = await client.post("deals/checkdeal", deal);
    console.log(typeof response, response);
    if (typeof response === "object" && !Array.isArray(response)) {
      return response;
    }
    return null;
  } catch (error) {
    console.error("Error fetching deal details:", error);
    throw new Error("Error fetching deal details");
  }
};

export const unlockDeal = async (deal_id) => {
  try {
    const response = await client.get("deals/unlock", { params: { deal_id } });
    return response;
  } catch (error) {
    console.error("Error unlocking deal:", error);
    throw new Error("Error unlocking deal");
  }
};

export const reportDeal = async (usd_id, notes) => {
  try {
    const response = await client.get("deals/report", { params: { usd_id, notes } });
    return response;
  } catch (error) {
    console.error("Error reporting deal:", error);
    throw new Error("Error reporting deal");
  }
};

export const fetchUserDeals = async () => {
  try {
    const response = await client.get("deals/userdeals");
    return response;
  } catch (error) {
    console.error("Error fetching user deals:", error);
    throw new Error("Error fetching user deals");
  }
};

export const fetchUserDealByDealId = async (deal_id) => {
  try {
    const response = await fetchUserDeals();
    const deal = response.find((userDeal) => userDeal.deal.deal_id === deal_id);
    return deal;
  } catch (error) {
    console.error("Error fetching user deal:", error);
    throw new Error("Error fetching user deal");
  }
};

export const fetchStores = async () => {
  try {
    const response = await client.get("deals/stores");
    return response;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw new Error("Error fetching stores");
  }
};
export const fetchStoreByStoreId = async (store_id) => {
  try {
    const stores = await fetchStores();
    console.log("stores", stores);
    console.log("id", store_id);
    const store = stores.find((store) => store.sto_id === store_id);
    console.log("result", store);
    return store;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw new Error("Error fetching store");
  }
};

export const productsFinder = async ({
  AmazonCategoryId = null,
  AmazonSubCategoryId = null,
  AmazonThirdCategoryId = null,
  page = 0,
  total_rows = 10,
}) => {
  try {
    const response = await client.get("productfinder", {
      params: { AmazonCategoryId, AmazonSubCategoryId, AmazonThirdCategoryId, page, total_rows },
    });
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};
