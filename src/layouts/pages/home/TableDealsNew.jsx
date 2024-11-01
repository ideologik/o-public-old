import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Visibility, Lock, Warning, LockOpen } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import MDSnackbar from "components/MDSnackbar";
import { fetchDeals, fetchCredit, checkDeal, unlockDeal } from "services";
import DealDetails from "./DealDetails";
import MUITableServerPagination from "components/MUITableServerPagination/MUITableServerPagination";

const TableDeals = ({ filters }) => {
  const [modalLoading, setModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertProps, setAlertProps] = useState({
    open: false,
    message: "",
    color: "info",
    dismissible: false,
  });

  const fetchData = async (params) => {
    try {
      const response = await fetchDeals(params);
      return { data: response.data || [], total_records: response.total_records || 0 };
    } catch (error) {
      console.error("Error fetching deals:", error);
      return { data: [], total_records: 0 };
    }
  };

  const handleAlertOpen = (message, color = "info", dismissible = false) => {
    setAlertProps({ open: true, message, color, dismissible });
  };

  const handleAlertClose = () => {
    setAlertProps((prev) => ({ ...prev, open: false }));
  };

  const handleTripleCheck = async (deal) => {
    const credit = await fetchCredit();
    console.log("credit", credit);
    console.log(deal);

    if (credit < 1) {
      handleAlertOpen("You do not have enough credits to proceed.", "warning", false);
      return;
    }

    setAlertProps({
      open: true,
      message:
        "We are triple checking that the UPC code, source price, and Amazon prime price are still the same. Please wait a moment...",
      color: "info",
      dismissible: false,
    });

    const newDeal = await checkDeal(deal);
    console.log("newDeal", newDeal);
    if (!newDeal) {
      handleAlertOpen(
        "This deal is no longer profitable and has been marked as invalid.",
        "error",
        true
      );
      return;
    }

    handleAlertClose();
    setSelectedDeal(newDeal);
    await handleUnlockDeal(newDeal);
  };

  const handleUnlockDeal = async (deal) => {
    try {
      await unlockDeal(deal.deal_id);
      handleAlertOpen("1 credit deducted from your account.", "info", false);
      setOpenModal(true);
    } catch (error) {
      console.error("Error unlocking deal:", error);
    }
  };

  const handleConfirm = async () => {
    setDeals((prev) => prev.filter((d) => d.deal_id !== selectedDeal.deal_id));
    setConfirmOpen(false);
    await handleUnlockDeal(selectedDeal);
  };
  const handleClickOpen = (deal) => {
    setModalLoading(true);
    setSelectedDeal(deal);
    handleTripleCheck(deal);
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDeal(null);
  };

  const columns = [
    {
      name: "deal_productGroup",
      label: "Category",
    },
    {
      name: "deal_date",
      label: "Date",
      options: {
        customBodyRender: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
      },
    },
    {
      name: "deal_priceSource",
      label: "Price at source",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "deal_priceAmazon",
      label: "Price at Amazon",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "deal_fbaFees",
      label: "FBA fees",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "deal_salesrank",
      label: "90-avg Sales rank",
      options: {
        customBodyRender: (value) =>
          value !== undefined && value !== 999999999 ? value : "No sales rank",
      },
    },
    {
      name: "deal_doa",
      label: "Profit",
      options: {
        customBodyRender: (value) => (
          <span style={{ color: value >= 0 ? "green" : "red" }}>
            {value !== undefined ? `$${value.toFixed(2)}` : "N/A"}
          </span>
        ),
      },
    },
    {
      name: "deal_roi",
      label: "ROI %",
      options: {
        customBodyRender: (value) => (value !== undefined ? `${value.toFixed(2)} %` : "N/A"),
      },
    },
    {
      name: "actions",
      label: "Show",
      options: {
        customBodyRender: (_, tableMeta) => {
          const deal = tableMeta.rowData;
          if (!deal) return null;
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <IconButton onClick={() => handleClickOpen(deal)}>
                <Tooltip title="Show details">
                  <Visibility fontSize="small" color="primary" />
                </Tooltip>
              </IconButton>
              {deal?.gated && <Lock color="error" />}
              {deal?.pack && <Warning color="warning" />}
            </div>
          );
        },
      },
    },
  ];

  return (
    <Grid container p={2}>
      <MUITableServerPagination
        title="Deals Table"
        columns={columns}
        fetchData={fetchDealsData}
        filters={filters}
      />

      {modalLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <CircularProgress size={40} />
        </div>
      )}

      {selectedDeal && (
        <DealDetails
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          selectedDeal={selectedDeal}
        />
      )}

      <MDSnackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        color={alertProps.color}
        icon="notifications"
        title="Notification"
        content={alertProps.message}
        open={alertProps.open}
        close={handleAlertClose}
        autoHideDuration={1000}
        style={{ zIndex: 99999 }}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogContent>
          <DialogContentText>{alertProps.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary">
            Yes, proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

TableDeals.propTypes = {
  filters: PropTypes.object,
};

export default TableDeals;
