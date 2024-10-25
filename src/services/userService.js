// src/api/userService.js
import client from "services/ApiClient";

export const fetchCredit = async () => {
  try {
    const response = await client.get("users/credits");
    return response;
  } catch (error) {
    console.error("Error fetching credit details:", error);
    throw new Error("Error fetching credit details");
  }
};
