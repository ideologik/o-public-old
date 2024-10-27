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
    const response = await client.post("deals/checkdeal", deal);
    return response;
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

export const reportDeal = async (deal_id, notes) => {
  try {
    const response = await client.get("deals/report", { params: { usd_id: deal_id, notes } });
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
