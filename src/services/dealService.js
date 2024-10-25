// src/api/dealService.js
import client from "services/ApiClient";

export const fetchDeals = async (filters) => {
  if (!filters || Object.keys(filters).length === 0) return [];

  try {
    let response = await client.get("deals", { params: filters });
    if (filters.hideNoSalesRank) {
      response = response.filter((deal) => deal.deal_salesrank !== 999999999);
    }

    response = response.map((deal) => {
      const profit = deal.deal_priceAmazon + deal.deal_fbaFees - deal.deal_priceSource;
      const pack = deal.deal_title.toLowerCase().includes("pack");
      return { ...deal, deal_profit: profit, deal_pack: pack };
    });
    return response;
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw error;
  }
};

export const checkDeal = async (deal) => {
  try {
    const response = await client.post(`deals/checkdeal}`, deal);
    return response;
  } catch (error) {
    console.error("Error fetching deal details:", error);
    throw new Error("Error fetching deal details");
  }
};
