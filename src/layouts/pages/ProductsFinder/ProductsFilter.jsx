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
import { fetchDealCategories } from "services";

import { useAtom } from "jotai";
import { bsSelectedCategoryAtom } from "stores/productAtom";
import { useFeatureFlags } from "context/FeatureFlags";

const ProductsFilter = ({ onFiltersChange }) => {
  const { features } = useFeatureFlags();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useAtom(bsSelectedCategoryAtom);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedThirdLevelCategory, setSelectedThirdLevelCategory] = useState("");

  useEffect(() => {
    const fetchDealsGroups = async () => {
      const productGroups = await fetchDealCategories();
      const sortedCategories = productGroups.sort((a, b) => a.category.localeCompare(b.category));
      setCategories(sortedCategories);

      // Inicializar selectedCategory con "Toys & Games" si no está definido
      if (!selectedCategory) {
        setSelectedCategory("Toys & Games");
      } else {
        // Si selectedCategory ya tiene un valor, inicializar subcategorías
        const currentCategory = sortedCategories.find((cat) => cat.categoryId === selectedCategory);
        setSubCategories(
          currentCategory?.subCategories.sort((a, b) => a.category.localeCompare(b.category)) || []
        );
      }
    };
    fetchDealsGroups();
  }, []);

  useEffect(() => {
    const currentCategory = categories.find((cat) => cat.categoryId === selectedCategory);
    setSubCategories(
      currentCategory?.subCategories.sort((a, b) => a.category.localeCompare(b.category)) || []
    );

    // Si la categoría seleccionada no tiene subcategorías, limpiar los subniveles
    if (!currentCategory?.subCategories.length) {
      setSelectedSubCategory("");
      setThirdLevelCategories([]);
      setSelectedThirdLevelCategory("");
    }

    handleFilterChange();
  }, [selectedCategory]);

  useEffect(() => {
    const currentSubCategory = subCategories.find((sub) => sub.categoryId === selectedSubCategory);
    setThirdLevelCategories(
      currentSubCategory?.subCategories.sort((a, b) => a.category.localeCompare(b.category)) || []
    );

    // Si la subcategoría seleccionada no tiene tercer nivel, limpiar el tercer nivel
    if (!currentSubCategory?.subCategories.length) {
      setSelectedThirdLevelCategory("");
    }

    handleFilterChange();
  }, [selectedSubCategory]);

  useEffect(() => {
    handleFilterChange();
  }, [selectedThirdLevelCategory]);

  const handleFilterChange = () => {
    const newFilters = {
      mainCategory: selectedCategory,
      subCategory: selectedSubCategory || null,
      thirdLevelCategory: selectedThirdLevelCategory || null,
    };
    onFiltersChange(newFilters);
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
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    autoWidth
                    sx={{ height: "56px" }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            {/* Subcategory Filter */}
            {subCategories.length > 0 && (
              <Grid item md={12}>
                <FormControl fullWidth variant="outlined" sx={{ height: "56px" }}>
                  <InputLabel>By subcategory</InputLabel>
                  <Select
                    label="By subcategory"
                    value={selectedSubCategory || ""}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    autoWidth
                    sx={{ height: "56px" }}
                  >
                    {subCategories.map((subCategory) => (
                      <MenuItem key={subCategory.categoryId} value={subCategory.categoryId}>
                        {subCategory.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {/* Third Level Category Filter */}
            {thirdLevelCategories.length > 0 && (
              <Grid item md={12}>
                <FormControl fullWidth variant="outlined" sx={{ height: "56px" }}>
                  <InputLabel>By third-level category</InputLabel>
                  <Select
                    label="By third-level category"
                    value={selectedThirdLevelCategory || ""}
                    onChange={(e) => setSelectedThirdLevelCategory(e.target.value)}
                    autoWidth
                    sx={{ height: "56px" }}
                  >
                    {thirdLevelCategories.map((thirdLevelCategory) => (
                      <MenuItem
                        key={thirdLevelCategory.categoryId}
                        value={thirdLevelCategory.categoryId}
                      >
                        {thirdLevelCategory.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </MDBox>
  );
};

ProductsFilter.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default ProductsFilter;
