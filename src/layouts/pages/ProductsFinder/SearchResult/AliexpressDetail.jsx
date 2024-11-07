import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";

import { useAtom } from "jotai";
import { useState } from "react";
import { bsSelectedProductAtom, aliexpressSelectedProductAtom } from "stores/productAtom";
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";

import { AliExpressProductEnhancer } from "services";

// Función para el ícono de tendencia
const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

const AliexpressDetail = () => {
  const [aliexpressSelectedProduct] = useAtom(aliexpressSelectedProductAtom);
  const [selectedProduct] = useAtom(bsSelectedProductAtom);

  console.log("aliexpressSelectedProduct", aliexpressSelectedProduct.product_id);
  console.log("selectedProduct", selectedProduct);

  // Estado para almacenar los datos de la API
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para obtener datos adicionales de la API
  const fetchAdditionalInfo = async () => {
    setLoading(true);
    try {
      const data = await AliExpressProductEnhancer(aliexpressSelectedProduct.product_id);
      console.log(data);
      setAdditionalInfo(data);
    } catch (error) {
      console.error("Error al obtener la información adicional:", error);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box display="flex" justifyContent="center" bgcolor="transparent" padding={4}>
        <Grid container spacing={2}>
          {/* Primera Tarjeta */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                padding: 4,
                borderRadius: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box
                  component="img"
                  src={aliexpressSelectedProduct.product_main_image_url || "/placeholder.jpg"}
                  alt={aliexpressSelectedProduct.product_title}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderTopLeftRadius: "inherit",
                    borderTopRightRadius: "inherit",
                  }}
                />
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {aliexpressSelectedProduct.product_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Category: {aliexpressSelectedProduct.second_level_category_name || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price: ${aliexpressSelectedProduct.target_sale_price || "N/A"}{" "}
                    {aliexpressSelectedProduct.target_sale_price_currency}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    DOA: $
                    {(
                      selectedProduct.bes_price - aliexpressSelectedProduct.target_sale_price
                    ).toFixed(2) || "0%"}{" "}
                    USD
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                    Potential Profit: $
                    {(
                      (selectedProduct.bes_price - aliexpressSelectedProduct.target_sale_price) *
                      selectedProduct.bes_boughtInPastMonth
                    ).toFixed(2) || "0%"}{" "}
                    USD
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Current Price Amazon: $
                    {selectedProduct.bes_price ? selectedProduct.bes_price.toFixed(2) : "N/A"}
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
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price Trend:{" "}
                    {getTrendIcon(
                      selectedProduct.bes_price,
                      selectedProduct.bes_priceBuyBox90DaysAverage
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price Trend last 90 days:{" "}
                    {selectedProduct.bes_priceBuyBox90DaysAverage || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Competition Trend:{" "}
                    {getTrendIcon(
                      selectedProduct.bes_newOfferCount,
                      selectedProduct.bes_newOfferCount90DaysAverage
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Competition Trend last 90 days:{" "}
                    {selectedProduct.bes_newOfferCount90DaysAverage || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Bought in past month: &nbsp;
                    {selectedProduct.bes_boughtInPastMonth + "+" || "N/A"}
                  </Typography>

                  <MDButton
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={fetchAdditionalInfo}
                    sx={{
                      paddingY: 1.5,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      backgroundColor: "#3A75C4",
                      "&:hover": {
                        backgroundColor: "#315d9d",
                      },
                    }}
                  >
                    Enhance Product
                  </MDButton>
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          {/* Segunda Tarjeta */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={4}
              sx={{
                padding: 4,
                borderRadius: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                height: "100%",
              }}
            >
              <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Product Information
                  </Typography>
                  {loading ? (
                    <CircularProgress />
                  ) : additionalInfo ? (
                    <>
                      <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                        Select an Image:
                      </Typography>
                      <List>
                        {additionalInfo.imageURLs.map((url, index) => (
                          <ListItemButton key={index}>
                            <img
                              src={url}
                              alt={`Product ${index}`}
                              style={{ width: "50px", marginRight: "10px" }}
                            />
                            <ListItemText primary={`Image ${index + 1}`} />
                          </ListItemButton>
                        ))}
                      </List>

                      <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                        Select a Title:
                      </Typography>
                      <List>
                        {additionalInfo.productTitles.map((title, index) => (
                          <ListItemButton key={index}>
                            <ListItemText primary={title} />
                          </ListItemButton>
                        ))}
                      </List>

                      <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                        Select a Description:
                      </Typography>
                      <List>
                        {additionalInfo.productDescriptions.map((desc, index) => (
                          <ListItemButton key={index}>
                            <ListItemText primary={desc} />
                          </ListItemButton>
                        ))}
                      </List>
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No additional information available. Press Enhance Product to load.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default AliexpressDetail;
