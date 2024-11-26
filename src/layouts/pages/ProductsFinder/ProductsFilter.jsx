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
  CircularProgress,
} from "@mui/material";
import MDBox from "components/MDBox";
import { fetchDealCategories, fetchDealSubCategories } from "services";

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

  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);

  // Fetch and clean categories on mount
  useEffect(() => {
    const fetchDealsGroups = async () => {
      console.log("entro en fetchDealsGroups");
      setIsCategoriesLoaded(false);
      const productGroups = await fetchDealCategories();
      const sortedCategories = productGroups.sort((a, b) => a.category.localeCompare(b.category));

      sortedCategories.forEach((cat) => {
        cat.subCategories = cat.subCategories.filter((sub) => sub.category !== "");
        cat.subCategories.forEach((sub) => {
          sub.subCategories = sub.subCategories.filter((sub2) => sub2.category !== "");
        });
      });

      const cleanedCategories = removeDuplicateCategories(sortedCategories);
      setCategories(cleanedCategories);
      setIsCategoriesLoaded(true);
      console.log("lo pone  a true a setIsCategoriesLoaded");

      // Establecer categoría predeterminada y subcategorías si no hay categoría seleccionada
      if (!selectedCategoryState.categoryId) {
        const defaultCategory = cleanedCategories.find((cat) => cat.category === "Toys & Games");
        if (defaultCategory) {
          setSelectedCategoryState({
            categoryId: defaultCategory.categoryId,
            subCategoryId: null,
            thirdLevelCategoryId: null,
          });
          setSubCategories(defaultCategory.subCategories || []);
        }
      } else {
        // Si ya hay una categoría seleccionada, establece las subcategorías correspondientes
        const currentCategory = cleanedCategories.find(
          (cat) => cat.categoryId === selectedCategoryState.categoryId
        );
        setSubCategories(currentCategory?.subCategories || []);
      }
    };

    fetchDealsGroups();
  }, []);

  // Actualizar subcategorías cuando cambia la categoría seleccionada o las categorías se cargan
  useEffect(() => {
    if (!categories.length) return; // Esperar a que las categorías se carguen

    const currentCategory = categories.find(
      (cat) => cat.categoryId === selectedCategoryState.categoryId
    );
    setSubCategories(currentCategory?.subCategories || []);

    if (!currentCategory || !currentCategory.subCategories?.length) {
      // Solo actualizar si hay cambios para evitar sobrescrituras innecesarias
      if (
        selectedCategoryState.subCategoryId !== null ||
        selectedCategoryState.thirdLevelCategoryId !== null
      ) {
        setSelectedCategoryState((prev) => ({
          ...prev,
          subCategoryId: null,
          thirdLevelCategoryId: null,
        }));
      }
      setThirdLevelCategories([]);
    }
  }, [selectedCategoryState.categoryId, categories]);

  // Actualizar categorías de tercer nivel cuando cambia la subcategoría seleccionada o las subcategorías se cargan
  useEffect(() => {
    const fetchThirdLevelCategories = async (id) => {
      const thirdLevelCategories = await fetchDealSubCategories(id);
      return thirdLevelCategories;
    };

    if (!subCategories.length) return; // Esperar a que las subcategorías se carguen

    const currentSubCategory = subCategories.find(
      (sub) => sub.categoryId === selectedCategoryState.subCategoryId
    );
    console.log("currentCategory", currentSubCategory);
    if (currentSubCategory) {
      fetchThirdLevelCategories(currentSubCategory.categoryId).then((thirdLevelCategories) => {
        setThirdLevelCategories(thirdLevelCategories);
      });
    }

    if (!currentSubCategory || !currentSubCategory.subCategories?.length) {
      if (selectedCategoryState.thirdLevelCategoryId !== null) {
        setSelectedCategoryState((prev) => ({
          ...prev,
          thirdLevelCategoryId: null,
        }));
      }
    }
  }, [selectedCategoryState.subCategoryId, subCategories]);

  // Actualizar los filtros cuando cambie cualquier parte del estado seleccionado
  useEffect(() => {
    handleFilterChange();
  }, [selectedCategoryState, isCategoriesLoaded]);

  const handleCategoryChange = (level, value) => {
    setSelectedCategoryState((prev) => {
      if (level === "category") {
        return {
          ...prev,
          categoryId: value,
          subCategoryId: null,
          thirdLevelCategoryId: null,
        };
      }
      if (level === "subCategory") {
        return {
          ...prev,
          subCategoryId: value,
          thirdLevelCategoryId: null,
        };
      }
      if (level === "thirdLevelCategory") {
        return {
          ...prev,
          thirdLevelCategoryId: value,
        };
      }
      return prev;
    });
  };

  const handleFilterChange = () => {
    onFiltersChange({
      AmazonCategoryId: selectedCategoryState.categoryId,
      AmazonSubCategoryId: selectedCategoryState.subCategoryId,
      AmazonThirdCategoryId: selectedCategoryState.thirdLevelCategoryId,
      isCategoriesLoaded,
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
          {!isCategoriesLoaded && (
            <Grid item xs={12} container justifyContent="center" alignItems="center">
              <CircularProgress size={30} />
            </Grid>
          )}
          <Grid container spacing={2} alignItems="center">
            {/* Category Filter */}
            <Grid item md={12}>
              {categories.length > 0 && (
                <FormControl fullWidth variant="outlined" sx={{ height: "56px" }}>
                  <InputLabel>By category</InputLabel>
                  <Select
                    label="By category"
                    value={selectedCategoryState.categoryId || ""}
                    onChange={(e) => handleCategoryChange("category", e.target.value)}
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
                    value={selectedCategoryState.subCategoryId || "all"}
                    onChange={(e) => handleCategoryChange("subCategory", e.target.value)}
                    autoWidth
                    sx={{ height: "56px" }}
                  >
                    <MenuItem value="all">All</MenuItem>
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
                    onChange={(e) => handleCategoryChange("thirdLevelCategory", e.target.value)}
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
