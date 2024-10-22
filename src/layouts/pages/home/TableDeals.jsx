import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { Visibility, Lock, Warning } from "@mui/icons-material";
import PropTypes from "prop-types";
import client from "ApiClient";

const TableDeals = ({ filters }) => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    // Llamada a la API usando los filtros para obtener los deals filtrados
    const fetchDeals = async () => {
      try {
        let response = await client.get("deals", { params: filters });
        if (filters.hideNoSalesRank) {
          response = response.filter((deal) => deal.deal_salesrank !== 999999999);
        }

        setDeals(response);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();
  }, [filters]);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ margin: 2 }}>
        Deals Table
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Price at source</TableCell>
            <TableCell>Price at Amazon</TableCell>
            <TableCell>FBA fees</TableCell>
            <TableCell>90-avg Sales rank</TableCell>
            <TableCell>Profit</TableCell>
            <TableCell>ROI %</TableCell>
            <TableCell>Show</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.deal_id}>
              <TableCell>{deal.deal_productGroup || "N/A"}</TableCell>
              <TableCell>
                {deal.deal_date ? new Date(deal.deal_date).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell>
                {deal.deal_priceSource !== undefined
                  ? `$${deal.deal_priceSource.toFixed(2)}`
                  : "N/A"}
              </TableCell>
              <TableCell>
                {deal.deal_priceAmazon !== undefined
                  ? `$${deal.deal_priceAmazon.toFixed(2)}`
                  : "N/A"}
              </TableCell>
              <TableCell>
                {deal.deal_fbaFees !== undefined ? `$${deal.deal_fbaFees.toFixed(2)}` : "N/A"}
              </TableCell>
              <TableCell>{deal.deal_salesrank || "N/A"}</TableCell>
              <TableCell sx={{ color: deal.deal_profit >= 0 ? "green" : "red" }}>
                {deal.deal_profit !== undefined ? `$${deal.deal_profit.toFixed(2)}` : "N/A"}
              </TableCell>
              <TableCell>
                {deal.deal_roi !== undefined ? `${deal.deal_roi.toFixed(2)} %` : "N/A"}
              </TableCell>
              <TableCell>
                <IconButton color="primary">
                  <Visibility />
                </IconButton>
                {deal.deal_gatedByDefault ? (
                  <IconButton color="secondary">
                    <Lock />
                  </IconButton>
                ) : (
                  <IconButton color="warning">
                    <Warning />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Props validation
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
