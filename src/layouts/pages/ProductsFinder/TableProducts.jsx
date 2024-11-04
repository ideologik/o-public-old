import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Grid } from "@mui/material";
import MDSnackbar from "components/MDSnackbar";
import { productsFinder } from "services";
import MUIDataTable from "mui-datatables";

const TableProducts = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertProps, setAlertProps] = useState({
    open: false,
    message: "",
    color: "info",
    dismissible: false,
  });
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const fetchProductsData = async (currentPage, currentRowsPerPage, showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const response = await productsFinder({
        ...filters,
        page: currentPage,
        total_rows: currentRowsPerPage,
      });
      setProducts(response.data);
      setCount(response.total_records);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
    if (showLoading) {
      setLoading(false);
    }
  };

  // Este efecto se ejecuta cuando cambian los filtros
  useEffect(() => {
    const fetchData = async () => {
      await fetchProductsData(0, rowsPerPage, true); // Mostrar loading al cambiar filtros
    };

    fetchData();
    setPage(0); // Reinicia la página cuando cambian los filtros
  }, [filters]);

  // Este efecto se ejecuta cuando cambian la página o las filas por página
  useEffect(() => {
    fetchProductsData(page, rowsPerPage); // No mostrar loading al cambiar de página
  }, [page, rowsPerPage]);

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

  // Column definitions
  const columns = [
    // {
    //   name: "bes_id",
    //   label: "ID",
    // },
    // {
    //   name: "bes_date",
    //   label: "Date",
    //   options: {
    //     customBodyRender: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    //   },
    // },
    // {
    //   name: "bes_upc",
    //   label: "UPC",
    // },
    // {
    //   name: "bes_asin",
    //   label: "ASIN",
    // },
    // {
    //   name: "bes_parentASIN",
    //   label: "Parent ASIN",
    // },
    {
      name: "bes_productGroup",
      label: "Product Group",
    },
    {
      name: "bes_title",
      label: "Title",
    },
    {
      name: "bes_brand",
      label: "Brand",
    },
    {
      name: "bes_price",
      label: "Price",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_salesrank",
      label: "Sales Rank",
    },
    {
      name: "bes_salesrank90DaysAverage",
      label: "90-Day Avg Sales Rank",
    },
    // {
    //   name: "bes_categoryCode",
    //   label: "Category Code",
    // },

    // {
    //   name: "bes_dimensions",
    //   label: "Dimensions",
    //   options: {
    //     customBodyRender: (value) => {
    //       if (value) {
    //         const dimensions = JSON.parse(value);
    //         return `H: ${dimensions.Height?.valueField || "N/A"} - L: ${
    //           dimensions.Length?.valueField || "N/A"
    //         } - W: ${dimensions.Width?.valueField || "N/A"} - Weight: ${
    //           dimensions.Weight?.valueField || "N/A"
    //         }`;
    //       }
    //       return "N/A";
    //     },
    //   },
    // },

    // {
    //   name: "bes_timestamp",
    //   label: "Timestamp",
    //   options: {
    //     customBodyRender: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
    //   },
    // },
    {
      name: "bes_link",
      label: "Link",
      options: {
        customBodyRender: (value) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            View Product
          </a>
        ),
      },
    },
    // {
    //   name: "bes_amazonTitle",
    //   label: "Amazon Title",
    // },

    {
      name: "bes_FBAFees",
      label: "FBA Fees",
      options: {
        customBodyRender: (value) => {
          try {
            const fees = value ? JSON.parse(value) : null;
            return fees && fees.pickAndPackFee
              ? `$${(fees.pickAndPackFee / 100).toFixed(2)}`
              : "N/A";
          } catch (error) {
            console.error("Invalid JSON format for FBA Fees:", error);
            return "N/A";
          }
        },
      },
    },
    {
      name: "bes_position",
      label: "Position",
    },
    {
      name: "bes_boughtInPastMonth",
      label: "Bought in Past Month",
    },
    {
      name: "bes_rating",
      label: "Rating",
    },
    {
      name: "bes_reviewCount",
      label: "Review Count",
    },
    {
      name: "bes_priceBuyBoxCurrent",
      label: "Buy Box Price (Current)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceBuyBox90DaysAverage",
      label: "Buy Box Price (90-Day Avg)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceAmazonCurrent",
      label: "Amazon Price (Current)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceAmazon90DaysAverage",
      label: "Amazon Price (90-Day Avg)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceNewThirdPartyCurrent",
      label: "New 3rd Party Price (Current)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceNewThirdParty90DaysAverage",
      label: "New 3rd Party Price (90-Day Avg)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceNewFBMCurrent",
      label: "New FBM Price (Current)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceNewFBM90DaysAverage",
      label: "New FBM Price (90-Day Avg)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceNewFBA",
      label: "New FBA Price",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceNewFBA90DaysAverage",
      label: "New FBA Price (90-Day Avg)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_FBAPickAndPackFee",
      label: "FBA Pick & Pack Fee",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceEbayNewCurrent",
      label: "eBay New Price (Current)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_priceEbayNew90DaysAverage",
      label: "eBay New Price (90-Day Avg)",
      options: {
        customBodyRender: (value) => (value !== undefined ? `$${value.toFixed(2)}` : "N/A"),
      },
    },
    {
      name: "bes_newOfferCount",
      label: "New Offer Count",
    },
    {
      name: "bes_newOfferCount90DaysAverage",
      label: "New Offer Count (90-Day Avg)",
    },
    {
      name: "bes_imageURLs",
      label: "Image URLs",
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
  };

  return (
    <Grid container p={2}>
      {loading ? (
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <CircularProgress size={30} />
        </Grid>
      ) : (
        products.length > 0 && (
          <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
            <MUIDataTable
              title={"Best Sellers"}
              columns={columns}
              data={products}
              options={options}
            />
          </div>
        )
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
    </Grid>
  );
};

TableProducts.propTypes = {
  filters: PropTypes.shape({
    AmazonCategory: PropTypes.string,
  }),
};

export default TableProducts;
