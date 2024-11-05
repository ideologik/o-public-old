import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { findByImage, findByText } from "services";
import { useDeal, setSelectedProduct } from "context/DealContext";

const SearchResults = () => {
  const { state, dispatch } = useDeal();

  console.log("state", state);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get("query");
  const imageUrl = params.get("imageUrl");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (imageUrl) {
          response = await findByImage(imageUrl);
          const productData = response.data?.products?.traffic_image_product_d_t_o || [];
          setProducts(productData);
        } else if (query) {
          response = await findByText(query);
          const productData =
            response.aliexpress_ds_text_search_response?.data?.products?.selection_search_product ||
            [];
          setProducts(productData);
        }
      } catch (err) {
        setError("Error fetching products. Please try again.");
      }

      setLoading(false);
    };

    fetchProducts();
  }, [query, imageUrl]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} p={2}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <img
                  src={product.product_main_image_url || "/placeholder.jpg"}
                  alt={product.product_title}
                  style={{ width: "100%", height: "200px", objectFit: "contain" }}
                />
                <CardContent>
                  <Typography variant="h6">{product.product_title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Category: {product.second_level_category_name || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: ${product.target_sale_price || "N/A"}{" "}
                    {product.target_sale_price_currency}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Original Price: ${product.original_price || "N/A"}{" "}
                    {product.original_price_currency}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Discount: {product.discount || "0%"}
                  </Typography>
                  <Box mt={2}>
                    <MDButton
                      variant="contained"
                      color="primary"
                      href={product.product_detail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Product
                    </MDButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default SearchResults;
