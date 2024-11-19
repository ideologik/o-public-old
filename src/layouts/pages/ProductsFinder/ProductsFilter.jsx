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

const data = [
  // Tu JSON aquí
];

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

// Llama a la función
const cleanedData = removeDuplicateCategories(data);

console.log(JSON.stringify(cleanedData, null, 2));

const ProductsFilter = ({ onFiltersChange }) => {
  const { features } = useFeatureFlags();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState([]);

  // Inicializa el estado con "Toys & Games" si no hay una categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useAtom(bsSelectedCategoryAtom);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedThirdLevelCategory, setSelectedThirdLevelCategory] = useState("");

  useEffect(() => {
    const fetchDealsGroups = async () => {
      const productGroups = await fetchDealCategories();
      let sortedCategories = productGroups.sort((a, b) => a.category.localeCompare(b.category));

      // Filtrar categorías y subcategorías vacías
      sortedCategories.forEach((cat) => {
        cat.subCategories = cat.subCategories.filter((sub) => sub.category !== "");
        cat.subCategories.forEach((sub) => {
          sub.subCategories = sub.subCategories.filter((sub2) => sub2.category !== "");
        });
      });

      sortedCategories = removeDuplicateCategories(sortedCategories);
      setCategories(sortedCategories);

      // Sincronizar estado inicial
      if (!selectedCategory) {
        const defaultCategory = sortedCategories.find((cat) => cat.category === "Toys & Games");
        setSelectedCategory(defaultCategory?.categoryId || "");
      } else {
        const currentCategory = sortedCategories.find((cat) => cat.categoryId === selectedCategory);
        setSubCategories(currentCategory?.subCategories || []);
      }
    };

    fetchDealsGroups();
  }, []);

  useEffect(() => {
    // Sincronizar subcategorías según la categoría seleccionada
    const currentCategory = categories.find((cat) => cat.categoryId === selectedCategory);
    setSubCategories(currentCategory?.subCategories || []);

    if (!currentCategory || !currentCategory.subCategories?.length) {
      setSelectedSubCategory("");
      setThirdLevelCategories([]);
      setSelectedThirdLevelCategory("");
    }

    handleFilterChange();
  }, [selectedCategory]);

  useEffect(() => {
    // Sincronizar tercer nivel según la subcategoría seleccionada
    const currentSubCategory = subCategories.find((sub) => sub.categoryId === selectedSubCategory);
    setThirdLevelCategories(currentSubCategory?.subCategories || []);

    if (!currentSubCategory || !currentSubCategory.subCategories?.length) {
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
                    value={selectedCategory ?? ""}
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
