export const findByImage = async (imageUrl) => {
  try {
    const response = await client.post("ProductFinder/AliExpressFindByImage", {
      image_url: imageUrl,
    });
    if (rsp_code !== 200) {
      console.log("Error fetching deals:", response.rsp_msg);
      throw new Error("Error fetching products");
    }
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

export const findByText = async (searchText) => {
  try {
    const response = await client.post("ProductFinder/AliExpressFindByText", {
      search: searchText,
    });
    if (rsp_code !== 200) {
      console.log("Error fetching deals:", response.rsp_msg);
      throw new Error("Error fetching products");
    }
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};
