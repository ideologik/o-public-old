import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Slider from "react-slick";
import MDSnackbar from "components/MDSnackbar";
import { productsFinder } from "services";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MDButton from "components/MDButton";

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
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate(); // Inicializa useNavigate

  const fetchProductsData = async (currentPage, showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await productsFinder({
        ...filters,
        page: currentPage,
        total_rows: 10,
      });
      setProducts((prev) => [...prev, ...response.data]);
    } catch (error) {
      console.error("Error fetching products:", error);
      setAlertProps({
        open: true,
        message: "Error loading products",
        color: "error",
      });
    }
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    setProducts([]);
    setPage(0);
    fetchProductsData(0, true);
  }, [filters]);

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

  const handleSearchAliExpress = (type, title, imageUrl) => {
    // Redirige a otra ruta con los parámetros adecuados
    if (type === "text") {
      navigate(`/search?query=${encodeURIComponent(title)}`); // Navega usando el texto
    } else if (type === "image") {
      navigate(`/search?imageUrl=${encodeURIComponent(imageUrl)}`); // Navega usando la URL de la imagen
    }
  };

  const getImagesArray = (imageURLs) => {
    if (!imageURLs) return ["/placeholder.jpg"];
    return imageURLs.split(",").map((url) => url.trim());
  };

  const handleImageChange = (index, productId) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [productId]: index,
    }));
  };

  return (
    <Grid container spacing={3} p={2}>
      {products.map((product, index) => {
        const images = getImagesArray(product.bes_imageURLs);
        const currentIndex = currentImageIndex[product.bes_id] || 0;
        const isSingleImage = images.length === 1;

        // Configurar opciones de react-slick
        const sliderSettings = {
          dots: !isSingleImage,
          arrows: false,
          infinite: !isSingleImage,
          slidesToShow: 1,
          slidesToScroll: 1,
          afterChange: (current) => handleImageChange(current, product.bes_id),
        };

        return (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={index}
            ref={index === products.length - 1 ? lastProductRef : null}
          >
            <Card>
              <Slider {...sliderSettings} style={{ cursor: "grab" }}>
                {images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`${product.bes_title} - ${imgIndex}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Slider>
              <CardContent>
                <Typography variant="h6">{product.bes_title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Brand: {product.bes_brand || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: ${product.bes_price ? product.bes_price.toFixed(2) : "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Sales Rank: {product.bes_salesrank || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  90-Day Avg Sales Rank: {product.bes_salesrank90DaysAverage || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rating: {product.bes_rating ? `${product.bes_rating}/5` : "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Review Count: {product.bes_reviewCount || "N/A"}
                </Typography>

                {/* Título y Botones de acción */}
                <Box mt={2}>
                  <Typography variant="subtitle1">Find in AliExpress:</Typography>
                  <MDButton
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleSearchAliExpress("text", product.bes_title, images[currentIndex])
                    }
                    style={{ marginRight: 8 }}
                  >
                    By Text
                  </MDButton>
                  <MDButton
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleSearchAliExpress("image", product.bes_title, images[currentIndex])
                    }
                  >
                    By Image
                  </MDButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
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
