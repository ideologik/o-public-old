import React, { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PropTypes from "prop-types";
import { Visibility, Lock, Warning, LockOpen } from "@mui/icons-material";
import { CircularProgress, Grid, IconButton, Tooltip } from "@mui/material";
import { fetchDeals, fetchCredit, checkDeal } from "services";
import DealDetails from "./DealDetails";

const TableDeals = ({ filters }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        console.log(filters);
        let response = await fetchDeals(filters);

        setDeals(response);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
      setLoading(false);
    };

    fetch();
  }, [filters]);

  const handleClickOpen = async (deal) => {
    const credit = await fetchCredit();
    console.log("credit", credit);
    const newDealDetails = await checkDeal(deal);
    console.log("newDealDetails", newDealDetails);

    setSelectedDeal(deal);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDeal(null);
  };

  // Definición de las columnas con flex
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
            {/* Botón de visibilidad */}
            <IconButton onClick={() => handleClickOpen(deal)} style={{ padding: "0px" }}>
              <Tooltip title="Click here to show the details of this deal">
                <Visibility fontSize="small" color="primary" />
              </Tooltip>
            </IconButton>

            {/* Condicional para candado cerrado o abierto */}
            {deal.deal_gatedByDefault ? (
              <Tooltip title="This category needs Amazon approval in order to sell">
                <Lock style={{ color: "red" }} />
              </Tooltip>
            ) : (
              <LockOpen style={{ color: "green" }} />
            )}

            {/* Condicional para pack */}
            {deal.deal_pack && (
              <Tooltip title="Potential mismatch (since the product at Amazon has the word -pack- in its title)">
                <Warning style={{ color: "orange" }} />
              </Tooltip>
            )}
          </div>
        );
      },
      flex: 1,
    },
  ];

  // Función para auto-ajustar las columnas
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
        deals &&
        deals.length !== 0 && (
          <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
            <AgGridReact
              rowData={deals}
              columnDefs={columns}
              pagination={true}
              paginationPageSize={20}
              domLayout="autoHeight"
              onGridReady={onGridReady} // Autoajusta las columnas al estar listas
            />
          </div>
        )
      )}
      {selectedDeal && (
        <DealDetails
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          selectedDeal={selectedDeal}
        />
      )}
    </Grid>
  );
};

// Validación de props
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
