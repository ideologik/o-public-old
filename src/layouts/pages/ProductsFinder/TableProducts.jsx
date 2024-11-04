import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import MDSnackbar from "components/MDSnackbar";
import { productsFinder } from "services";

const CardProducts = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertProps, setAlertProps] = useState({
    open: false,
    message: "",
    color: "info",
    dismissible: false,
  });
  const [page, setPage] = useState(0);
  const observerRef = useRef(null);

  const fetchProductsData = async (currentPage, showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await productsFinder({
        ...filters,
        page: currentPage,
        total_rows: 10, // Pidiendo 10 productos por página
      });
      setProducts((prev) => [...prev, ...response.data]); // Agregar productos a la lista
    } catch (error) {
      console.error("Error fetching products:", error);
      setAlertProps({
        open: true,
        message: "Error al cargar los productos",
        color: "error",
      });
    }
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    setProducts([]); // Limpiar productos al cambiar filtros
    setPage(0);
    fetchProductsData(0, true);
  }, [filters]);

  // Cargar más productos cuando la página cambia
  useEffect(() => {
    if (page > 0) fetchProductsData(page);
  }, [page]);

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

  const getFirstImage = (imageURLs) => {
    if (!imageURLs) return "/placeholder.jpg"; // Imagen de respaldo si no hay URLs
    const urlsArray = imageURLs.split(","); // Separar las URLs por coma
    return urlsArray[0].trim(); // Retornar la primera URL, asegurándonos de quitar espacios en blanco
  };

  const handleSearchAliExpress = (title, imageUrl) => {
    // Implementa la lógica para buscar en AliExpress usando title o imageUrl
    console.log("Buscar en AliExpress con título:", title, " o imagen:", imageUrl);
  };

  return (
    <Grid container spacing={2} p={2}>
      {products.map((product, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={index}
          ref={index === products.length - 1 ? lastProductRef : null}
        >
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={getFirstImage(product.bes_imageURLs)}
              alt={product.bes_title}
            />
            <CardContent>
              <Typography variant="h6">{product.bes_title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Marca: {product.bes_brand || "N/A"}
              </Typography>
              <Typography variant="body1" color="primary">
                Precio: ${product.bes_price ? product.bes_price.toFixed(2) : "N/A"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleSearchAliExpress(product.bes_title, getFirstImage(product.bes_imageURLs))
                }
              >
                Buscar en AliExpress
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {loading && (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <CircularProgress size={30} />
        </Grid>
      )}
      <MDSnackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        color={alertProps.color}
        icon="notifications"
        title="Notification"
        content={alertProps.message}
        open={alertProps.open}
        close={() => setAlertProps((prev) => ({ ...prev, open: false }))}
        autoHideDuration={1000}
      />
    </Grid>
  );
};

CardProducts.propTypes = {
  filters: PropTypes.shape({
    AmazonCategory: PropTypes.string,
  }),
};

export default CardProducts;
