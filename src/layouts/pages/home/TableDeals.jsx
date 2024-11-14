import React, { useEffect, useState, useContext } from "react";
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
  CardContent,
  Card,
  CardHeader,
  Typography,
} from "@mui/material";

import MDSnackbar from "components/MDSnackbar";
import { fetchDeals, fetchCredit, checkDeal, unlockDeal } from "services";
import DealDetails from "./DealDetails";
import MUIDataTable from "mui-datatables";

const TableDeals = ({ filters }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ sort_by: "deal_id", asc: false });
  const fetchDealsData = async (currentPage, currentRowsPerPage, showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const params = {
        ...filters,
        ...sort,
        page: currentPage,
        total_rows: currentRowsPerPage,
      };
      console.log("filters xxxxx", params);
      const response = await fetchDeals(params);
      setDeals(response.data);
      setCount(response.total_records);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
    if (showLoading) {
      setLoading(false);
    }
  };

  // Actualización de los datos cuando cambian los filtros, orden o página
  useEffect(() => {
    const fetchData = async () => {
      await fetchDealsData(0, rowsPerPage, true); // Mostrar loading al cambiar filtros o el orden
    };

    fetchData();
    setPage(0); // Reinicia la página cuando cambian los filtros o el orden
  }, [filters, sort]);

  // Este efecto se ejecuta cuando cambian la página o las filas por página
  useEffect(() => {
    fetchDealsData(page, rowsPerPage); // No mostrar loading al cambiar de página
  }, [page, rowsPerPage, sort]);

  const handleTableChange = (action, tableState) => {
    if (action === "changePage") {
      setPage(tableState.page);
    } else if (action === "changeRowsPerPage") {
      setRowsPerPage(tableState.rowsPerPage);
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
    if (newDeal === null) {
      handleAlertOpen(
        "This deal is no longer profitable and has been marked as invalid.",
        "error",
        true
      );
      setDeals((prev) => prev.filter((d) => d.deal_id !== deal.deal_id));
      return;
    }

    handleAlertClose();
    // Verifica la rentabilidad actual (DOA)
    const currentDOA = newDeal.deal_priceAmazon - newDeal.deal_priceSource - newDeal.deal_fbaFees;
    if (currentDOA <= 0) {
      console.log("currentDOA", currentDOA);
      handleAlertOpen(
        "This deal is no longer profitable and has been marked as invalid.",
        "error",
        true
      );
      setDeals((prev) => prev.filter((d) => d.deal_id !== deal.deal_id));
      return;
    }

    let message = "";
    let title = "";
    let change = false;

    // Compara precios de Amazon y ajusta si es necesario
    if (deal.deal_priceAmazon !== newDeal.deal_priceAmazon) {
      console.log("precio distinto", deal.deal_priceAmazon, newDeal.deal_priceAmazon);
      title = deal.deal_priceAmazon > newDeal.deal_priceAmazon ? "Warning!" : "Good News!";
      message += `Amazon price has changed from ${deal.deal_priceAmazon} to ${newDeal.deal_priceAmazon}. `;
      change = true;
      setDeals((prev) => prev.map((d) => (d.deal_id === deal.deal_id ? newDeal : d)));
      setSelectedDeal(newDeal);
    }

    // Compara el ranking de ventas
    if (deal.deal_salesrank !== newDeal.deal_salesrank) {
      console.log("sales rank distinto", deal.deal_salesrank, newDeal.deal_salesrank);
      title = deal.deal_salesrank > newDeal.deal_salesrank ? "Good News!" : "Warning:";
      message += `Sales rank has changed from ${deal.deal_salesrank} to ${newDeal.deal_salesrank}. `;
      change = true;
      setDeals((prev) => prev.map((d) => (d.deal_id === deal.deal_id ? newDeal : d)));
      setSelectedDeal(newDeal);
    }

    // Si hubo cambios, confirma con el usuario
    if (change) {
      message =
        title +
        message +
        "Do you still wish to proceed and unlock the full information for this deal?";
      setAlertProps({
        open: true,
        message,
        color: title === "Warning!" ? "warning" : "success",
        dismissible: true,
      });
      setConfirmOpen(true);
    } else {
      // Si no hubo cambios, desbloquea directamente
      // Cada vez que se desbloque al mismo deal, se genera una nueva entrada en la tabla
      // Esto está bien?
      await handleUnlockDeal(newDeal);
      setDeals((prev) => prev.filter((d) => d.deal_id !== deal.deal_id));
    }
  };

  const handleUnlockDeal = async (deal) => {
    try {
      await unlockDeal(deal.deal_id);
      handleAlertOpen("1 credit are deducted from your account.", "info", false);
      setSelectedDeal(deal);
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

  const handleClickOpen = async (deal) => {
    setModalLoading(true);
    setSelectedDeal(deal);
    await handleTripleCheck(deal);
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDeal(null);
  };

  // Column definitions
  const columns = [
    {
      name: "deal_productGroup",
      label: "Category",
      options: {
        sort: false,
      },
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
        sort: false,
      },
    },
    {
      name: "deal_salesrank",
      label: "90-avg Sales rank",
      options: {
        customBodyRender: (value) => (value !== undefined && value !== 0 ? value : "No sales rank"),
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
          const deal = deals[tableMeta.rowIndex];
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <IconButton onClick={() => handleClickOpen(deal)} style={{ padding: "0px" }}>
                <Tooltip title="Click here to show the details of this deal">
                  <Visibility fontSize="small" color="primary" />
                </Tooltip>
              </IconButton>
              {deal.deal_gatedByDefault ? (
                <Tooltip title="This category needs Amazon approval to sell">
                  <Lock style={{ color: "red" }} />
                </Tooltip>
              ) : (
                <LockOpen style={{ color: "green" }} />
              )}
              {deal.deal_pack && <Warning style={{ color: "orange" }} />}
            </div>
          );
        },
      },
    },
  ];
  const options = {
    serverSide: true,
    count: count,
    page: page,
    rowsPerPage: rowsPerPage,
    onTableChange: handleTableChange,
    selectableRows: "none",
    filter: false,
    print: false,
    download: false,
    search: false,
    viewColumns: false,
    sortOrder: {
      name: sort.sort_by,
      direction: sort.asc ? "asc" : "desc",
    },
    onColumnSortChange: (changedColumn, direction) => {
      console.log(`Column sorted: ${changedColumn}`);
      console.log(`Sort direction: ${direction}`);
      setSort({ sort_by: changedColumn, asc: direction === "asc" });
    },
  };

  return (
    <Grid container p={2}>
      {loading ? (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <CircularProgress size={30} />
        </Grid>
      ) : (
        deals.length > 0 && (
          <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
            <MUIDataTable columns={columns} data={deals} options={options} />
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
