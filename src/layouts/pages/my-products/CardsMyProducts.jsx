import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Tooltip } from "@mui/material";
import MDButton from "components/MDButton";
import { fetchProducts } from "services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardsMyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const observerRef = useRef(null);

  // Fetch products with pagination
  const fetchProductsData = async (currentPage, showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetchProducts({ page: currentPage, total_rows: 10 });
      console.log("products", response.data, page);
      const productsData = response.data || [];

      setProducts(productsData);
      if (currentPage === 0) {
        toast.success("Products loaded successfully.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    if (showLoading) setLoading(false);
  };

  // Initial fetch and reset when needed
  useEffect(() => {
    setProducts([]);
    setPage(0);
    fetchProductsData(0, true);
  }, []);

  // Fetch more products when page changes
  useEffect(() => {
    if (page > 0) fetchProductsData(page);
  }, [page]);

  // Intersection Observer for infinite scrolling
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading]
  );

  return (
    <Grid container spacing={3} p={2}>
      <ToastContainer />
      {products.length === 0 && !loading && (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <Typography variant="h6">No products available.</Typography>
        </Grid>
      )}
      {products.map((product, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={product.pro_id}
          ref={index === products.length - 1 ? lastProductRef : null}
        >
          <Card>
            <Box
              component="img"
              src={
                // Take the first URL from the image list
                product.pro_imageURLs
                  ? product.pro_imageURLs.split(",")[0]
                  : "/assets/imgs/default-product-image.png"
              }
              alt={product.pro_name}
              sx={{ width: "100%", height: "200px", objectFit: "contain" }}
            />
            <CardContent>
              <Tooltip title={product.pro_name}>
                <Typography variant="h6">
                  {product.pro_name.length > 40
                    ? `${product.pro_name.slice(0, 40)}...`
                    : product.pro_name}
                </Typography>
              </Tooltip>
              <Typography variant="body2" color="textSecondary">
                Price: ${product.pro_price}
              </Typography>
              <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                <MDButton
                  variant="contained"
                  fullWidth
                  color="primary"
                  href={product.pro_url}
                  target="_blank"
                >
                  View on AliExpress
                </MDButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {loading && (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <CircularProgress size={30} />
        </Grid>
      )}
    </Grid>
  );
};

export default CardsMyProducts;
