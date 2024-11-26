import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Tooltip } from "@mui/material";
import MDButton from "components/MDButton";
import { fetchProducts } from "services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardsMyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const productsData = response.data; // Accedemos a la lista de productos

      setProducts(productsData);
      toast.success("Productos cargados exitosamente.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      toast.error("Error al obtener los productos.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  return (
    <Grid container spacing={3} p={2}>
      <ToastContainer />
      {loading ? (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <CircularProgress size={30} />
        </Grid>
      ) : products?.length > 0 ? (
        products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.pro_id}>
            <Card>
              <Box
                component="img"
                src={
                  // Tomamos la primera URL de las imágenes
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
                  Precio: ${product.pro_price}
                </Typography>
                <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                  <MDButton
                    variant="contained"
                    fullWidth
                    color="primary"
                    href={product.pro_url}
                    target="_blank"
                  >
                    view in AliExpress
                  </MDButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <Typography variant="h6">There are no products available.</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default CardsMyProducts;
