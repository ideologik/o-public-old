import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { CircularProgress, Grid } from "@mui/material";
import PropTypes from "prop-types";

const MUITableServerPagination = ({ title, columns, fetchData, filters, onDelete }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Fetch data from API
  const loadTableData = async () => {
    setLoading(true);
    try {
      const response = await fetchData({ ...filters, page, rowsPerPage });
      setData(response.data || []);
      setCount(response.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTableData();
  }, [filters, page, rowsPerPage, fetchData]);

  const handleTableChange = (action, tableState) => {
    if (action === "changePage") {
      setPage(tableState.page);
    } else if (action === "changeRowsPerPage") {
      setRowsPerPage(tableState.rowsPerPage);
    }
  };

  // Handle deletion of a row
  const handleDelete = (dealId) => {
    onDelete(dealId);
  };

  // Pass handleDelete to custom actions in columns if needed

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
        <MUIDataTable title={title} data={data} columns={columns} options={options} />
      )}
    </Grid>
  );
};

MUITableServerPagination.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  filters: PropTypes.object,
  onDelete: PropTypes.func, // optional
};

export default MUITableServerPagination;
