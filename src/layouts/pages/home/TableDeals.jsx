import React, { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
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
  Snackbar,
} from "@mui/material";
import MDAlert from "components/MDAlert";
import { fetchDeals, fetchCredit, checkDeal, unlockDeal } from "services";
import DealDetails from "./DealDetails";

const TableDeals = ({ filters }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const fetchDealsData = async () => {
      setLoading(true);
      try {
        const response = await fetchDeals(filters);
        setDeals(response);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
      setLoading(false);
    };
    fetchDealsData();
  }, [filters]);

  const handleTripleCheck = async (deal) => {
    console.log("deal", deal);
    const credit = await fetchCredit();

    if (credit < 1) {
      alert("You do not have enough credits to proceed.");
      return; // Detiene la ejecución si no hay crédito suficiente
    }
    setSnackbarMessage(
      "We are triple checking that the UPC code, source price and amazon prime price are still the same. Give us a couple seconds please...."
    );
    setAlertOpen(true);

    const newDeal = await checkDeal(deal);
    console.log("newDeal", newDeal);

    setAlertOpen(false);
    setSnackbarMessage("");

    let message = "";
    let title = "";
    let change = false;

    // Compara precios de Amazon y ajusta si es necesario
    if (deal.deal_priceAmazon !== newDeal.deal_priceAmazon) {
      title = deal.deal_priceAmazon > newDeal.deal_priceAmazon ? "Warning!" : "Good News!";
      message += `Amazon price has changed from ${deal.deal_priceAmazon} to ${newDeal.deal_priceAmazon}. `;
      change = true;
    }

    // Compara el ranking de ventas
    if (deal.deal_salesrank !== newDeal.deal_salesrank) {
      title = deal.deal_salesrank > newDeal.deal_salesrank ? "Good News!" : "Warning:";
      message += `Sales rank has changed from ${deal.deal_salesrank} to ${newDeal.deal_salesrank}. `;
      change = true;
    }

    // Verifica la rentabilidad actual (DOA)
    const currentDOA = newDeal.deal_priceAmazon - newDeal.deal_priceSource - newDeal.deal_fbaFees;
    if (currentDOA <= 0) {
      message = "This deal is no longer profitable and has been marked as invalid." + currentDOA;
      alert(message);
      return;
    }

    // Si hubo cambios, confirma con el usuario
    if (change) {
      message =
        title +
        message +
        "Do you still wish to proceed and unlock the full information for this deal?";
      setSnackbarMessage(message);
      setConfirmOpen(true);
    } else {
      // Si no hubo cambios, desbloquea directamente
      await handleUnlockDeal(newDeal);
    }
  };

  const handleUnlockDeal = async (deal) => {
    try {
      await unlockDeal(deal.deal_id);
      setSelectedDeal(deal);
      setOpenModal(true);
    } catch (error) {
      console.error("Error unlocking deal:", error);
    }
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    await handleUnlockDeal(selectedDeal);
  };

  const handleClickOpen = async (deal) => {
    setModalLoading(true);
    await handleTripleCheck(deal);
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDeal(null);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  // Column definitions
  const columns = [
    { headerName: "Category", field: "deal_productGroup", filter: true, flex: 1 },
    {
      headerName: "Date",
      field: "deal_date",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "N/A",
      flex: 1,
    },
    {
      headerName: "Price at source",
      field: "deal_priceSource",
      valueFormatter: (params) =>
        params.value !== undefined ? `$${params.value.toFixed(2)}` : "N/A",
      flex: 1,
    },
    {
      headerName: "Price at Amazon",
      field: "deal_priceAmazon",
      valueFormatter: (params) =>
        params.value !== undefined ? `$${params.value.toFixed(2)}` : "N/A",
      flex: 1,
    },
    {
      headerName: "FBA fees",
      field: "deal_fbaFees",
      valueFormatter: (params) =>
        params.value !== undefined ? `$${params.value.toFixed(2)}` : "N/A",
      flex: 1,
    },
    {
      headerName: "90-avg Sales rank",
      field: "deal_salesrank",
      valueFormatter: (params) =>
        params.value !== undefined && params.value !== 999999999 ? params.value : "No sales rank",
      flex: 1,
    },
    {
      headerName: "Profit",
      field: "deal_profit",
      cellRenderer: (params) =>
        params.value !== undefined ? (
          <span style={{ color: params.value >= 0 ? "green" : "red" }}>{`$${params.value.toFixed(
            2
          )}`}</span>
        ) : (
          "N/A"
        ),
      flex: 1,
    },
    {
      headerName: "ROI %",
      field: "deal_roi",
      valueFormatter: (params) =>
        params.value !== undefined ? `${params.value.toFixed(2)} %` : "N/A",
      flex: 1,
    },
    {
      headerName: "Show",
      field: "actions",
      cellRenderer: (params) => {
        const deal = params.data;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "8px" }}>
            <IconButton onClick={() => handleClickOpen(deal)} style={{ padding: "0px" }}>
              <Tooltip title="Click here to show the details of this deal">
                <Visibility fontSize="small" color="primary" />
              </Tooltip>
            </IconButton>
            {deal.deal_gatedByDefault ? (
              <Lock style={{ color: "red" }} />
            ) : (
              <LockOpen style={{ color: "green" }} />
            )}
            {deal.deal_pack && <Warning style={{ color: "orange" }} />}
          </div>
        );
      },
      flex: 1,
    },
  ];

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <Grid container p={2}>
      {loading ? (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <CircularProgress size={30} />
        </Grid>
      ) : (
        deals.length > 0 && (
          <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
            <AgGridReact
              rowData={deals}
              columnDefs={columns}
              pagination={true}
              paginationPageSize={20}
              domLayout="autoHeight"
              onGridReady={onGridReady}
            />
          </div>
        )
      )}

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

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <MDAlert onClose={handleCloseAlert} severity="info" sx={{ width: "100%" }}>
          {snackbarMessage}
        </MDAlert>
      </Snackbar>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogContent>
          <DialogContentText>{snackbarMessage}</DialogContentText>
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

// Prop validation
TableDeals.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string,
    date: PropTypes.string,
    salesRank: PropTypes.number,
    profit: PropTypes.number,
    roi: PropTypes.number,
    hideNoSalesRank: PropTypes.bool,
  }),
};

export default TableDeals;
