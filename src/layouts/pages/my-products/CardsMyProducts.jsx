import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Tooltip } from "@mui/material";
import MDButton from "components/MDButton";
import { fetchProducts } from "services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardsMyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Control para detener el paginado si no hay más productos
  const observerRef = useRef();

  // Fetch products with pagination
  const fetchProductsData = async (currentPage) => {
    if (loading || !hasMore) return; // Prevenir múltiples llamadas
    setLoading(true);

    try {
      const response = await fetchProducts({ page: currentPage, total_rows: 10 });
      const newProducts = response.data || [];

      if (newProducts.length === 0) {
        setHasMore(false); // Detener el paginado si no hay más productos
      } else {
        setProducts((prevProducts) => {
          const uniqueProducts = newProducts.filter(
            (product) => !prevProducts.some((p) => p.pro_id === product.pro_id) // Evitar duplicados
          );
          return [...prevProducts, ...uniqueProducts];
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    setLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true); // Reiniciar la capacidad de paginado
    fetchProductsData(0);
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
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
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
