import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
  Box,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useDeal } from "context/DealContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import { reportDeal, fetchUserDealByDealId, fetchStoreByStoreId } from "services";

const DealDetails = () => {
  const { state, dispatch } = useDeal();
  const { deal } = state;
  const navigate = useNavigate();

  const [store, setStore] = React.useState(null);

  if (!deal) return <Typography>No deal data available</Typography>;

  const handleReport = async () => {
    try {
      const mydeal = await fetchUserDealByDealId(deal.deal_id);
      const response = await reportDeal(mydeal.usd_id, "Reported by user");

      console.log("Deal reported successfully", response);
      navigate("/my-deals");
    } catch (error) {
      console.error("Error reporting deal:", error);
    }
  };
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const store = await fetchStoreByStoreId(deal.deal_store_id);
        console.log("store", store);
        setStore(store);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };
    fetchStore();
  }, [deal.deal_store_id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {/* Report Button Card */}
          <Grid item xs={12}>
            <Card>
              <CardContent
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h6" color="textSecondary">
                  Deal details
                </Typography>
                <MDButton variant="contained" color="primary" onClick={handleReport}>
                  Report deal
                </MDButton>
              </CardContent>
            </Card>
          </Grid>
          {/* Deal Details Card (Amazon) */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image="assets/logos/amazon-logo.png"
                alt="Amazon logo"
                sx={{ height: 100, objectFit: "contain" }}
              />
              <CardContent>
                <Typography variant="h6">{deal.deal_title}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Best sellers rank #
                </Typography>
                <Typography variant="body1">{deal.deal_salesrank}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Price
                </Typography>
                <Typography variant="body1">${deal.deal_priceAmazon.toFixed(2)}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  FBA fees and commissions
                </Typography>
                <Typography variant="body1">${(deal.deal_fbaFees / 100).toFixed(2)}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary" sx={{ color: "grey.600" }}>
                  OADeals has calculated an approximate FBA fee based on the item characteristics.
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Brand
                </Typography>
                <Typography variant="body1">{deal.deal_brand}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  ASIN
                </Typography>
                <Typography variant="body1">{deal.deal_asin}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Link
                </Typography>
                <MuiLink href={deal.deal_amazonLink} target="_blank" color="primary">
                  {deal.deal_amazonLink}
                </MuiLink>
              </CardContent>
            </Card>
          </Grid>

          {/* Deal Source Details Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={store?.store_image_url}
                alt={store?.store_name}
                sx={{ height: 100, objectFit: "contain" }}
              />
              <CardContent>
                <Typography variant="h6">{deal.deal_title}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Profit
                </Typography>
                <Typography variant="body1" sx={{ color: green[500] }}>
                  ${deal.deal_doa.toFixed(2)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  UPC
                </Typography>
                <Typography variant="body1">{deal.deal_upc}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Link
                </Typography>
                <MuiLink href={deal.deal_link} target="_blank" color="primary">
                  {deal.deal_link}
                </MuiLink>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Purchase limit
                </Typography>
                <Typography variant="body1">{deal.deal_purchaseLimit}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Price
                </Typography>
                <Typography variant="body1">${deal.deal_priceSource.toFixed(2)}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  ROI %
                </Typography>
                <Typography variant="body1">{deal.deal_roi.toFixed(2)} %</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Date
                </Typography>
                <Typography variant="body1">{new Date(deal.deal_date).toLocaleString()}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Product group
                </Typography>
                <Typography variant="body1">{deal.deal_productGroup}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Product type
                </Typography>
                <Typography variant="body1">{deal.deal_productTypeName || "N/A"}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default DealDetails;
