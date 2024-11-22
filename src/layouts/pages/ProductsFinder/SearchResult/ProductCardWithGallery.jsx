import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Paper, Button, Divider } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useAtom } from "jotai";
import { aliexpressSelectedProductAtom, bsSelectedProductAtom } from "stores/productAtom";
import { fetchAliExpressProductByID } from "services/aliexpressService"; // Servicio para obtener la info adicional
import { Bar, Line } from "react-chartjs-2";
import Slider from "@material-ui/core/Slider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";

const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductCardWithGallery = () => {
  const [aliexpressSelectedProduct] = useAtom(aliexpressSelectedProductAtom);
  const [selectedProduct] = useAtom(bsSelectedProductAtom);
  const [mainMedia, setMainMedia] = useState(aliexpressSelectedProduct.product_main_image_url);
  const [mainMediaType, setMainMediaType] = useState("image"); // Para controlar si es imagen o video
  const [suggestedPrice, setSuggestedPrice] = useState(selectedProduct.bes_price || 0);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [productMedia, setProductMedia] = useState([]);

  useEffect(() => {
    // Llamada para obtener la información adicional del producto
    const fetchAdditionalProductInfo = async () => {
      try {
        const response = await fetchAliExpressProductByID(aliexpressSelectedProduct.product_id);
        setAdditionalInfo(response?.aliexpress_ds_product_get_response?.result);
      } catch (error) {
        console.error("Error fetching additional product info:", error);
      }
    };

    fetchAdditionalProductInfo();
  }, [aliexpressSelectedProduct.product_id]);

  useEffect(() => {
    if (additionalInfo) {
      // Crear lista de imágenes y videos solo si additionalInfo tiene datos
      const productVideos =
        additionalInfo?.ae_multimedia_info_dto?.ae_video_dtos?.ae_video_d_t_o || [];
      const productImages = additionalInfo?.ae_multimedia_info_dto?.image_urls?.split(";") || [];

      // Combinar videos e imágenes en un solo arreglo de medios
      setProductMedia([
        ...productVideos.map((video) => ({
          type: "video",
          url: video.media_url,
          poster: video.poster_url,
        })),
        ...productImages.map((image) => ({ type: "image", url: image })),
      ]);
    }
  }, [additionalInfo]);

  const calculatePotentialProfit = () => {
    const profitPerUnit = suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price);
    return (profitPerUnit * selectedProduct.bes_boughtInPastMonth).toFixed(2);
  };

  // Data for the line chart for trends
  const trendData = {
    labels: ["90-Day Average", "Current"],
    datasets: [
      {
        label: "Amazon Price Trend",
        data: [selectedProduct.bes_priceBuyBox90DaysAverage, selectedProduct.bes_price],
        borderColor: "#FF6384",
        fill: false,
      },
      {
        label: "Number of Sellers",
        data: [selectedProduct.bes_newOfferCount90DaysAverage, selectedProduct.bes_newOfferCount],
        borderColor: "#36A2EB",
        fill: false,
      },
    ],
  };
  // Data for the bar chart for price comparison
  const priceComparisonData = {
    labels: ["Amazon", "AliExpress", "Suggested Price"],
    datasets: [
      {
        label: "Price in USD",
        data: [
          selectedProduct.bes_price,
          parseFloat(aliexpressSelectedProduct.target_sale_price),
          suggestedPrice,
        ],
        backgroundColor: ["#3A75C4", "#FF6384", "#4BC0C0"],
      },
    ],
  };

  // Data for the area/bar chart for profit margin
  const profitMarginData = {
    labels: ["Profit Margin"],
    datasets: [
      {
        label: "Absolute Profit (USD)",
        data: [suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price)],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Profit Percentage",
        data: [
          (
            ((suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price)) /
              parseFloat(aliexpressSelectedProduct.target_sale_price)) *
            100
          ).toFixed(2),
        ],
        backgroundColor: "#FFCE56",
      },
    ],
  };

  return (
    <DashboardLayout>
      <MDBox
        sx={{
          display: "flex",
          gap: 3,
          padding: 4,
        }}
      >
        {/* Columna Izquierda - Información del Producto */}
        <Paper elevation={4} sx={{ flex: 3, borderRadius: 2, display: "flex", gap: 3 }}>
          {/* Galería de Imágenes en Miniatura */}
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              width: "100px",
              height: "auto",
              overflow: "auto",
              padding: 1,
            }}
          >
            {productMedia.map((media, index) => (
              <MDBox
                key={index}
                component={media.type === "image" ? "img" : "video"}
                src={media.url}
                alt={`Thumbnail ${index}`}
                poster={media.type === "video" ? media.poster : undefined}
                onClick={() => {
                  setMainMedia(media.url);
                  setMainMediaType(media.type);
                }}
                onMouseEnter={() => {
                  setMainMedia(media.url);
                  setMainMediaType(media.type);
                }}
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  cursor: "pointer",
                  border: mainMedia === media.url ? "2px solid #FF3E3E" : "2px solid transparent",
                }}
                controls={media.type === "video"}
              />
            ))}
          </MDBox>

          {/* Card Principal del Producto */}
          <MDBox sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Media Principal (Imagen o Video) */}
              <MDBox
                sx={{
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Etiqueta de descuento o evento */}
                {aliexpressSelectedProduct.discount && (
                  <MDBox
                    sx={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "#FF6347",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    {aliexpressSelectedProduct.discount} OFF
                  </MDBox>
                )}

                {mainMediaType === "image" ? (
                  <Card
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MDBox
                      component="img"
                      src={mainMedia || "/assets/imgs/default-product-image.png"}
                      alt={aliexpressSelectedProduct.product_title}
                      sx={{
                        width: "100%",
                        height: "40vh",
                        objectFit: "contain",
                      }}
                    />
                  </Card>
                ) : (
                  <MDBox
                    component="video"
                    src={mainMedia}
                    poster={mainMedia.poster}
                    controls
                    sx={{
                      width: "100%",
                      height: "40vh",
                      objectFit: "contain",
                    }}
                  />
                )}
              </MDBox>

              {/* Contenido del Producto */}
              <CardContent sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {aliexpressSelectedProduct.product_title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Category: {aliexpressSelectedProduct.second_level_category_name || "N/A"}
                </Typography>

                {/* Precio Actual y Descuento */}
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: "bold", marginBottom: 1 }}
                >
                  ${aliexpressSelectedProduct.target_sale_price}{" "}
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                    sx={{ textDecoration: "line-through", marginLeft: 1 }}
                  >
                    ${aliexpressSelectedProduct.original_price}
                  </Typography>
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Current Price on Amazon: $
                  {selectedProduct.bes_price
                    ? selectedProduct.bes_price.toFixed(2) + " USD"
                    : "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Potential Profit (monthly): ${calculatePotentialProfit()} USD
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Sales Rank: {selectedProduct.bes_salesrank || "N/A"}{" "}
                  {getTrendIcon(
                    selectedProduct.bes_salesrank,
                    selectedProduct.bes_salesrank90DaysAverage
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Sale Rank last 90 days: {selectedProduct.bes_salesrank90DaysAverage || "N/A"}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  Bought in past month: &nbsp;
                  {selectedProduct.bes_boughtInPastMonth + "+" || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Price Trend:{" "}
                  {getTrendIcon(
                    selectedProduct.bes_price,
                    selectedProduct.bes_priceBuyBox90DaysAverage
                  )}
                </Typography>
                <Grid item xs={12} md={8}>
                  <Paper elevation={4} sx={{ padding: 4, borderRadius: 2 }}>
                    <Grid container spacing={4}>
                      {/* Price Trends */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Price & Competition Trends
                        </Typography>
                        <Line data={trendData} />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </CardContent>
            </Card>
          </MDBox>
        </Paper>

        {/* Columna Derecha - Botones y Opciones */}
        <MDBox sx={{ flex: 1 }}>
          <Paper
            elevation={4}
            sx={{
              padding: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Botones */}
            <MDButton
              variant="contained"
              color="primary"
              onClick={() => console.log("Guardar Producto")}
              disabled={false}
            >
              Add to My Products
            </MDButton>

            <Divider />
            <MDBox sx={{ paddingY: 2 }}>
              <Typography
                gutterBottom
                sx={{
                  color: suggestedPrice > selectedProduct.bes_price ? "red" : "inherit",
                }}
              >
                Suggested Price: ${parseFloat(suggestedPrice).toFixed(2)} USD
              </Typography>
              <Slider
                value={suggestedPrice}
                min={parseFloat(aliexpressSelectedProduct.target_sale_price)}
                max={selectedProduct.bes_price * 1.5}
                step={0.01}
                onChange={(e, newValue) => setSuggestedPrice(newValue)}
                valueLabelDisplay="auto"
              />
            </MDBox>

            <Typography variant="body2" color="textSecondary">
              Profit with Suggested Price: $
              {parseFloat(suggestedPrice - aliexpressSelectedProduct.target_sale_price).toFixed(2)}{" "}
              per unit
            </Typography>
            {/* Price Comparison */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Price Comparison
              </Typography>
              <Bar data={priceComparisonData} />
            </Grid>

            {/* Profit Margin */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Profit Margin
              </Typography>
              <Bar data={profitMarginData} />
            </Grid>
          </Paper>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
};

export default ProductCardWithGallery;
