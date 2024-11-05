import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Search, FilterList, AttachMoney, Percent } from "@mui/icons-material";
import client from "services/ApiClient";

const ProductsFilter = ({ onFiltersChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("any");

  useEffect(() => {
    const fetchDealsGoups = async () => {
      const productGroups = await client.get("deals/categories");
      setCategories(productGroups.sort());
    };
    fetchDealsGoups();
  }, []);

  // Función para actualizar los filtros y pasarlos al componente padre
  const handleFilterChange = () => {
    const newFilters = {
      AmazonCategory: selectedCategory === "any" ? "" : selectedCategory,
    };
    onFiltersChange(newFilters); // Pasar los filtros al componente padre
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" color="#FFFFFF">
              Product Filter
            </Typography>
          }
          sx={{ backgroundColor: "#735AC7" }}
        />
        <CardContent style={{ paddingTop: "1.5%" }}>
          <Grid container spacing={2} alignItems="center">
            {/* Category Filter */}
            <Grid item md={12}>
              <FormControl fullWidth variant="outlined" sx={{ height: "56px" }}>
                <InputLabel>By category</InputLabel>
                <Select
                  label="By category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                  }}
                  autoWidth
                  sx={{ height: "56px" }}
                >
                  <MenuItem value="any">Select Product Type</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Search Button */}
            <Grid item xs={12}>
              <Box textAlign="center">
                <IconButton
                  color="primary"
                  size="large"
                  sx={{
                    backgroundColor: "#735AC7",
                    color: "#AAAAAA",
                    padding: 2,
                    borderRadius: "50%",
                  }}
                  onClick={handleFilterChange}
                >
                  <Search />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

// Props validation
ProductsFilter.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default ProductsFilter;
