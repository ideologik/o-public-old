import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MDBox from "components/MDBox";
import { fecthDealCategories } from "services";

import { useAtom } from "jotai";
import { bsSelectedCategoryAtom } from "stores/productAtom";
import { useFeatureFlags } from "context/FeatureFlags";

const ProductsFilter = ({ onFiltersChange }) => {
  const { features } = useFeatureFlags();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useAtom(bsSelectedCategoryAtom);

  useEffect(() => {
    const fetchDealsGoups = async () => {
      const productGroups = await fecthDealCategories();
      setCategories(productGroups.sort());
      if (!selectedCategory) setSelectedCategory("Toys & Games");
    };
    fetchDealsGoups();
    handleFilterChange();
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory]);

  // Función para actualizar los filtros y pasarlos al componente padre
  const handleFilterChange = () => {
    const newFilters = {
      AmazonCategory: selectedCategory,
    };
    onFiltersChange(newFilters); // Pasar los filtros al componente padre
  };

  return (
    <MDBox sx={{ padding: 2 }}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" color="#FFFFFF">
              Product Filter
            </Typography>
          }
          sx={{ backgroundColor: features.colorPrimary }}
        />
        <CardContent style={{ paddingTop: "1.5%" }}>
          <Grid container spacing={2} alignItems="center">
            {/* Category Filter */}
            <Grid item md={12}>
              {categories.length > 0 && (
                <FormControl fullWidth variant="outlined" sx={{ height: "56px" }}>
                  <InputLabel>By category</InputLabel>
                  <Select
                    label="By category"
                    value={selectedCategory || "any"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    autoWidth
                    sx={{ height: "56px" }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </MDBox>
  );
};

// Props validation
ProductsFilter.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default ProductsFilter;
