import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Slider from "@material-ui/core/Slider";
import { fetchDealCategories, fetchDealSubCategories } from "services";
import { useAtom } from "jotai";
import { bsSelectedCategoryAtom } from "stores/productAtom";

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
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState([]);

  const [selectedCategoryState, setSelectedCategoryState] = useAtom(bsSelectedCategoryAtom);
  const [priceRange, setPriceRange] = useState([50, 150]);
  const [searchText, setSearchText] = useState("");

  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);

  // Fetch and clean categories on mount
  useEffect(() => {
    const fetchDealsGroups = async () => {
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
      searchText,
      AmazonCategoryId: selectedCategoryState.categoryId,
      AmazonSubCategoryId: selectedCategoryState.subCategoryId,
      AmazonThirdCategoryId: selectedCategoryState.thirdLevelCategoryId,
      priceFrom: priceRange[0],
      priceTo: priceRange[1],

      isCategoriesLoaded,
    });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = () => {
    onFiltersChange({
      searchText,
      AmazonCategoryId: selectedCategoryState.categoryId,
      AmazonSubCategoryId: selectedCategoryState.subCategoryId,
      priceFrom: priceRange[0],
      priceTo: priceRange[1],
    });
  };

  return (
    <MDBox sx={{ padding: 2 }}>
      <Card>
        <CardContent>
          {!isCategoriesLoaded ? (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="46px">
              <CircularProgress size={30} />
            </MDBox>
          ) : (
            <Grid container spacing={2} alignItems="center">
              {/* Search Field */}
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  sx={{ height: "46px" }}
                  InputProps={{ style: { height: "46px" } }}
                  value={searchText}
                  onChange={handleSearchTextChange}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined" sx={{ height: "46px" }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={selectedCategoryState.categoryId || ""}
                    onChange={(e) => handleCategoryChange("category", e.target.value)}
                    sx={{ height: "46px" }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Subcategory Filter */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined" sx={{ height: "46px" }}>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    label="Subcategory"
                    value={selectedCategoryState.subCategoryId || "all"}
                    onChange={(e) => handleCategoryChange("subCategory", e.target.value)}
                    sx={{ height: "46px" }}
                  >
                    <MenuItem value="all">All Subcategories</MenuItem>
                    {subCategories.map((subCategory) => (
                      <MenuItem key={subCategory.categoryId} value={subCategory.categoryId}>
                        {subCategory.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Price Range Slider */}
              <Grid item xs={12} md={2}>
                <Typography
                  id="price-range-slider"
                  gutterBottom
                  variant="body2"
                  color="textSecondary"
                >
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200}
                />
              </Grid>

              {/* Search Button */}
              <Grid item xs={12} md={2}>
                <MDButton
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ height: "46px" }}
                  onClick={handleSearch}
                >
                  Search
                </MDButton>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </MDBox>
  );
};

ProductsFilter.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default ProductsFilter;
