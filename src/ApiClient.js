import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});
// Función para cambiar la baseURL cuando sea necesario
export const setBaseURL = (url) => {
  client.defaults.baseURL = url;
};

// Set the AUTH token for any request
client.interceptors.request.use((config) => {
  const newConfig = config;
  try {
    if (localStorage.getItem("AuthorizationToken") !== "undefined") {
      newConfig.headers.Authorization = JSON.parse(localStorage.getItem("AuthorizationToken"));
    }
  } catch (error) {
    // console.log(error);
  }
  return newConfig;
});

// Manage the response
/* eslint-disable */
client.interceptors.response.use(
  (response) => {
    switch (response.status) {
      case 200:
        return response.data;
      case 204:
        return JSON.parse("[{}]");
      case 401:
        localStorage.removeItem("AuthorizationToken");
        window.location.href = "/authentication/sign-in";
        return JSON.parse("[{}]");
      case 403:
        localStorage.removeItem("AuthorizationToken");
        window.location.href = "/index.html";
        return JSON.parse("[{}]");
      case 404:
        window.location.href = "/notFound";
        return JSON.parse("[{}]");
      case 500:
        console.log(response.data);
        return JSON.parse("[{}]");
      case 502:
        console.log(response.data);
        window.location.href = "/notFound";
        return JSON.parse("[{}]");
      default:
        return response.data;
    }
  },
  (error) => {
    console.log("err", error);
    if (error.code === "ERR_NETWORK") return JSON.parse("[{}]");
    if (error.response.status === 401 && localStorage.getItem("AuthorizationToken") !== null) {
      console.log("err1", error);
      localStorage.removeItem("AuthorizationToken");
      window.location.href = "/index.html";
      // return JSON.parse("[{}]");
    }
    if (error.response.status === 401) {
      console.log("err2", error);
      return "unauthorized";
    }
    if (error.response.status === 400) return JSON.parse("[{}]");
  }
);

export default client;
