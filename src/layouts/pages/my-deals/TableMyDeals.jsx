import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Visibility, Lock, Warning, LockOpen } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import MDSnackbar from "components/MDSnackbar";
import { useDeal, setDeal } from "context/DealContext";
import { fetchUserDeals } from "services";
import { FeatureFlags } from "context/FeatureFlags";

const TableMyDeals = () => {
  const { features } = useContext(FeatureFlags);
  const [myDeals, setMyDeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const { state, dispatch } = useDeal();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyDealsData = async () => {
      setLoading(true);
      try {
        const response = await fetchUserDeals();
        console.log(response);
        setMyDeals(response);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
      setLoading(false);
    };
    fetchMyDealsData();
  }, []);

  // handle click details. Setear el deal en el contexto y redirigir a la página de detalles
  const handleClickOpen = (deal) => {
    setDeal(dispatch, deal.deal);
    navigate("/my-deal-details");
  };

  // Column definitions
  const columns = [
    {
      headerName: "Title",
      field: "deal.deal_title",
      flex: 1,
      width: 300,
      autoHeight: true,
      wrapText: true,
    },
    { headerName: "Category", field: "deal.deal_productGroup", filter: true, flex: 1 },
    {
      headerName: "Date",
      field: "deal.deal_date",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "N/A",
      flex: 1,
    },
    {
      headerName: "Price at source",
      field: "deal.deal_priceSource",
      valueFormatter: (params) =>
        params.value !== undefined ? `$${params.value.toFixed(2)}` : "N/A",
      flex: 1,
    },
    {
      headerName: "Price at Amazon",
      field: "deal.deal_priceAmazon",
      valueFormatter: (params) =>
        params.value !== undefined ? `$${params.value.toFixed(2)}` : "N/A",
      flex: 1,
    },
    {
      headerName: "FBA fees",
      field: "deal.deal_fbaFees",
      valueFormatter: (params) =>
        params.value !== undefined ? `$${params.value.toFixed(2)}` : "N/A",
      flex: 1,
    },
    {
      headerName: "90-avg Sales rank",
      field: "deal.deal_salesrank",
      valueFormatter: (params) =>
        params.value !== undefined && params.value !== 999999999 ? params.value : "No sales rank",
      flex: 1,
    },
    {
      headerName: "Profit",
      field: "deal.deal_doa",
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
      field: "deal.deal_roi",
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
        myDeals.length > 0 && (
          <Grid item xs={12} container justifyContent="center" alignItems="center">
            <Card style={{ width: "100%" }}>
              {" "}
              {/* Asegura que la Card ocupe el 100% */}
              <CardHeader
                title={
                  <Typography variant="h6" color="#FFFFFF">
                    My Deals
                  </Typography>
                }
                sx={{ backgroundColor: features.colorPrimary }}
              />
              <CardContent sx={{ paddingTop: "1.5%", width: "100%" }}>
                <div className="ag-theme-alpine" style={{ width: "100%" }}>
                  <AgGridReact
                    rowData={myDeals}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={20}
                    domLayout="autoHeight"
                    onGridReady={onGridReady}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        )
      )}
    </Grid>
  );
};

export default TableMyDeals;
