import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import MDBox from "components/MDBox"; // Componente del template Material Dashboard

const DealDetails = ({ selectedDeal, openModal, handleCloseModal }) => {
  console.log("selectedDeal", selectedDeal);
  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
      <DialogTitle style={{ textAlign: "center" }}>Deal Details</DialogTitle>
      <DialogContent dividers>
        <MDBox p={3}>
          <MDBox mb={2}>
            <Typography variant="h6">Title at source</Typography>
            <Typography variant="body2">{selectedDeal.deal_title}</Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">Title at Amazon</Typography>
            <Typography variant="body2">{selectedDeal.deal_title}</Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">Price at Amazon</Typography>
            <Typography variant="body2">${selectedDeal.deal_priceAmazon.toFixed(2)}</Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">Price at source</Typography>
            {/* solo dos decimales en  deal_priceSource*/}
            <Typography variant="body2">${selectedDeal.deal_priceSource.toFixed(2)}</Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">Profit</Typography>
            <Typography variant="body2">${selectedDeal.deal_profit.toFixed(2)}</Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">ROI</Typography>
            <Typography variant="body2">{selectedDeal.deal_roi.toFixed(2)}%</Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">Best sellers rank #</Typography>
            <Typography variant="body2">{selectedDeal.deal_salesrank}</Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">Category</Typography>
            <Typography variant="body2">{selectedDeal.deal_productGroup}</Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">
              <a href={selectedDeal.deal_link} target="_blank" rel="noopener noreferrer">
                Link to the source
              </a>
            </Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="h6">
              <a href={selectedDeal.deal_amazonLink} target="_blank" rel="noopener noreferrer">
                Link to Amazon&apos;s listing
              </a>
            </Typography>
          </MDBox>
          <Divider />
          <MDBox mb={2}>
            <Typography variant="body2">1 credit are deducted from your account.</Typography>
          </MDBox>
        </MDBox>
      </DialogContent>
      <DialogActions>
        <MDBox flexGrow={1} />
        <Button onClick={handleCloseModal} variant="contained">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Full Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DealDetails.propTypes = {
  selectedDeal: PropTypes.shape({
    deal_id: PropTypes.number,
    deal_title: PropTypes.string,
    deal_link: PropTypes.string,
    deal_amazonLink: PropTypes.string,
    deal_priceSource: PropTypes.number,
    deal_priceAmazon: PropTypes.number,
    deal_salesrank: PropTypes.number,
    deal_profit: PropTypes.number,
    deal_roi: PropTypes.number,
    deal_productGroup: PropTypes.string,
  }),
  handleCloseModal: PropTypes.func,
  openModal: PropTypes.bool,
};

export default DealDetails;
