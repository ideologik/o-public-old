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

// Función recursiva para eliminar categorías duplicadas
function removeDuplicateCategories(categories, seenIds = new Set()) {
  return categories
    .filter((category) => {
      if (seenIds.has(category.categoryId)) {
        return false; // Excluye categorías duplicadas
      } else {
        seenIds.add(category.categoryId); // Agrega el ID al Set
        return true; // Incluye la categoría
      }
    })
    .map((category) => ({
      ...category,
      subCategories: removeDuplicateCategories(category.subCategories, seenIds), // Limpia subcategorías recursivamente
    }));
}

const ProductsFilter = ({ onFiltersChange }) => {
  const { features } = useFeatureFlags();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState([]);

  const [selectedCategoryState, setSelectedCategoryState] = useAtom(bsSelectedCategoryAtom);

  useEffect(() => {
    const fetchDealsGroups = async () => {
      const productGroups = await fetchDealCategories();
      const sortedCategories = productGroups.sort((a, b) => a.category.localeCompare(b.category));

      // Filtrar categorías y subcategorías vacías
      sortedCategories.forEach((cat) => {
        cat.subCategories = cat.subCategories.filter((sub) => sub.category !== "");
        cat.subCategories.forEach((sub) => {
          sub.subCategories = sub.subCategories.filter((sub2) => sub2.category !== "");
        });
      });

      const cleanedCategories = removeDuplicateCategories(sortedCategories);
      setCategories(cleanedCategories);

      // Inicializar categoría predeterminada si no hay una seleccionada
      if (!selectedCategoryState.categoryId) {
        const defaultCategory = cleanedCategories.find((cat) => cat.category === "Toys & Games");
        if (defaultCategory) {
          setSelectedCategoryState({
            categoryId: defaultCategory.categoryId,
            subCategoryId: null,
            thirdLevelCategoryId: null,
          });
        }
      } else {
        const currentCategory = sortedCategories.find(
          (cat) => cat.categoryId === selectedCategoryState.categoryId
        );
        setSubCategories(currentCategory?.subCategories || []);
      }
    };

    fetchDealsGroups();
  }, []);

  useEffect(() => {
    const currentCategory = categories.find(
      (cat) => cat.categoryId === selectedCategoryState.categoryId
    );
    setSubCategories(currentCategory?.subCategories || []);

    if (!currentCategory || !currentCategory.subCategories?.length) {
      setSelectedCategoryState((prev) => ({
        ...prev,
        subCategoryId: null,
        thirdLevelCategoryId: null,
      }));
      setThirdLevelCategories([]);
    }

    handleFilterChange();
  }, [selectedCategoryState.categoryId]);

  useEffect(() => {
    const currentSubCategory = subCategories.find(
      (sub) => sub.categoryId === selectedCategoryState.subCategoryId
    );
    setThirdLevelCategories(currentSubCategory?.subCategories || []);

    if (!currentSubCategory || !currentSubCategory.subCategories?.length) {
      setSelectedCategoryState((prev) => ({
        ...prev,
        thirdLevelCategoryId: null,
      }));
    }

    handleFilterChange();
  }, [selectedCategoryState.subCategoryId]);

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategoryState.thirdLevelCategoryId]);

  const handleFilterChange = () => {
    onFiltersChange({
      AmazonCategoryId: selectedCategoryState.categoryId,
      AmazonSubCategoryId: selectedCategoryState.subCategoryId,
      AmazonThirdCategoryId: selectedCategoryState.thirdLevelCategoryId,
    });
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
                    value={selectedCategoryState.categoryId || ""}
                    onChange={(e) =>
                      setSelectedCategoryState({
                        categoryId: e.target.value,
                        subCategoryId: null,
                        thirdLevelCategoryId: null,
                      })
                    }
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
                    value={selectedCategoryState.subCategoryId || ""}
                    onChange={(e) =>
                      setSelectedCategoryState((prev) => ({
                        ...prev,
                        subCategoryId: e.target.value,
                        thirdLevelCategoryId: null,
                      }))
                    }
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
                    value={selectedCategoryState.thirdLevelCategoryId || ""}
                    onChange={(e) =>
                      setSelectedCategoryState((prev) => ({
                        ...prev,
                        thirdLevelCategoryId: e.target.value,
                      }))
                    }
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
