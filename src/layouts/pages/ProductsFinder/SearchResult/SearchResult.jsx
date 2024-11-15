import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Card, CardContent, Typography, CircularProgress, Box, Paper } from "@mui/material";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { findByImage, findByText } from "services";
import { useAtom } from "jotai";
import { bsSelectedProductAtom, aliexpressSelectedProductAtom } from "stores/productAtom";
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";
const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
  const [selectedProduct] = useAtom(bsSelectedProductAtom);
  console.log("product", selectedProduct);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get("query");
  const imageUrl = params.get("imageUrl");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const [_, setAliexpressSelectedProduct] = useAtom(aliexpressSelectedProductAtom);
  const navigate = useNavigate();

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
  const handleShowProductDetails = (product) => {
    setAliexpressSelectedProduct(product);
    navigate("/product-finder/aliexpress-details");
  };

  return (
    <DashboardLayout>
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
        selectedProduct && (
          <Box height="100vh" display="flex" flexDirection="column">
            <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
              <Card>
                <Grid container>
                  <Grid item xs={2}>
                    <img
                      src={imageUrl}
                      alt={`${selectedProduct.bes_title}`}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    <CardContent style={{ paddingTop: "3vh" }}>
                      <Typography variant="h6">{selectedProduct.bes_title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Brand: {selectedProduct.bes_brand || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Current Price: $
                        {selectedProduct.bes_price ? selectedProduct.bes_price.toFixed(2) : "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Sales Rank: {selectedProduct.bes_salesrank || "N/A"}{" "}
                        {getTrendIcon(
                          selectedProduct.bes_salesrank,
                          selectedProduct.bes_salesrank90DaysAverage
                        )}
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        Bought in past month: &nbsp;
                        {selectedProduct.bes_boughtInPastMonth + "+" || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price Trend:{" "}
                        {getTrendIcon(
                          selectedProduct.bes_price,
                          selectedProduct.bes_priceBuyBox90DaysAverage
                        )}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Competition Trend:{" "}
                        {getTrendIcon(
                          selectedProduct.bes_newOfferCount,
                          selectedProduct.bes_newOfferCount90DaysAverage
                        )}
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Paper>

            {/* Scrollable Section for Product List */}
            <Box
              flex={1}
              overflow="auto"
              p={2}
              style={{ border: "1px solid #ddd", borderRadius: "4px" }}
            >
              <Grid container spacing={3}>
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
                        {/* <Typography variant="body2" color="textSecondary">
                          Original Price: ${product.original_price || "N/A"}{" "}
                          {product.original_price_currency}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Discount: {product.discount || "0%"}
                        </Typography> */}
                        <Typography variant="body2" color="textSecondary">
                          DOA: $
                          {(selectedProduct.bes_price - product.target_sale_price).toFixed(2) ||
                            "0%"}{" "}
                          USD
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          Potencial Profit: $
                          {(
                            (selectedProduct.bes_price - product.target_sale_price) *
                            selectedProduct.bes_boughtInPastMonth
                          ).toFixed(2) || "0%"}{" "}
                          USD
                        </Typography>

                        <Box mt={2}>
                          <MDButton
                            variant="contained"
                            fullWidth
                            color="primary"
                            onClick={() => {
                              handleShowProductDetails(product);
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Analyze
                          </MDButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )
      )}
    </DashboardLayout>
  );
};

export default SearchResults;
