import client, { setBaseURL } from "services/ApiClient";

// Servicio para buscar por imagen usando POST con query string
export const findByImage = async (imageUrl) => {
  try {
    // Construir la URL con query string
    const url = `ProductFinder/AliExpressFindByImage?image_url=${encodeURIComponent(imageUrl)}`;
    const tmp = await client.post(url);
    const response = tmp.aliexpress_ds_image_search_response;
    console.log("response", response);

    // Verificar el código de respuesta
    if (response.rsp_code !== "200") {
      console.log("Error fetching deals:", response.rsp_msg);
      throw new Error("Error fetching products");
    }
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

// Servicio para buscar por texto usando POST con query string
export const findByText = async (searchText) => {
  try {
    // Construir la URL con query string
    const url = `ProductFinder/AliExpressFindByText?search=${encodeURIComponent(searchText)}`;
    const response = await client.post(url);

    // Verificar el código de respuesta
    if (response.rsp_code !== "200") {
      console.log("Error fetching deals:", response.rsp_msg);
      throw new Error("Error fetching products");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

export const CreateAuth = async () => {
  try {
    setBaseURL(process.env.REACT_APP_API_BASE_URL.replace("io/", ""));
    const url = `aliexpress/Create`;
    const response = await client.post(url);

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};
