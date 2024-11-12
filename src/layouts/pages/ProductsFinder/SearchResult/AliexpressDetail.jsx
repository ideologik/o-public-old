import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Checkbox,
  TextField,
} from "@mui/material";
import Slider from "@material-ui/core/Slider";

import { useAtom } from "jotai";
import { useState } from "react";
import { bsSelectedProductAtom, aliexpressSelectedProductAtom } from "stores/productAtom";
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";

// Function to display trend icon
const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

const AliexpressDetail = () => {
  const [aliexpressSelectedProduct] = useAtom(aliexpressSelectedProductAtom);
  const [selectedProduct] = useAtom(bsSelectedProductAtom);

  const [loading, setLoading] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState(selectedProduct.bes_price || 0);

  // Calculate potential profit based on suggested price
  const calculatePotentialProfit = () => {
    const profitPerUnit = suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price);
    return (profitPerUnit * selectedProduct.bes_boughtInPastMonth).toFixed(2);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="center" bgcolor="inherit" padding={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{ padding: 4, borderRadius: 2, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
            >
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
                  sx={{
                    width: "50%",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                    borderRadius: 2,
                    mb: 1,
                    mt: 2,
                  }}
                >
                  <MDBox
                    component="img"
                    src={aliexpressSelectedProduct.product_main_image_url || "/placeholder.jpg"}
                    alt={aliexpressSelectedProduct.product_title}
                    sx={{
                      width: "50%",
                      height: "50%",
                      objectFit: "contain", // Asegura que la imagen se vea completa sin recortes
                    }}
                  />
                </MDBox>
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
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price Trend:{" "}
                    {getTrendIcon(
                      selectedProduct.bes_price,
                      selectedProduct.bes_priceBuyBox90DaysAverage
                    )}
                  </Typography>

                  <MDBox sx={{ paddingY: 2 }}>
                    <Typography
                      gutterBottom
                      sx={{
                        color: suggestedPrice > selectedProduct.bes_price ? "red" : "inherit",
                      }}
                    >
                      Suggested Price: ${suggestedPrice}
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
                    {(
                      suggestedPrice - parseFloat(aliexpressSelectedProduct.target_sale_price)
                    ).toFixed(2)}{" "}
                    per unit
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          {/* Additional product information card */}
          <Grid item xs={12} md={8}>
            {/* Additional content like product information */}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default AliexpressDetail;
