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
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { Search, FilterList, AttachMoney, Percent } from "@mui/icons-material";
import client from "services/ApiClient";

// Función para obtener y actualizar los datos de la API cada hora
const fetchAndStoreDeals = async () => {
  const ONE_HOUR = 60 * 60 * 1000; // 1 hora en milisegundos
  const lastFetchTime = localStorage.getItem("lastFetchTime");
  const now = new Date().getTime();

  if (!lastFetchTime || now - lastFetchTime >= ONE_HOUR) {
    try {
      // Hacer la llamada a la API
      const response = await client.get("deals");
      const deals = response;

      // Extraer los grupos de productos únicos
      const productGroups = Array.from(new Set(deals.map((deal) => deal.deal_productGroup)));
      //ordena alfabeticamente y saca los "Unknown"
      productGroups.sort();
      productGroups.splice(productGroups.indexOf("Unknown"), 1);

      // Guardar en localStorage
      localStorage.setItem("dealProductGroups", JSON.stringify(productGroups));
      localStorage.setItem("lastFetchTime", now);
      console.log("productGroups", productGroups);

      return productGroups;
    } catch (error) {
      console.error("Error fetching deals:", error);
      return [];
    }
  } else {
    // Si no ha pasado una hora, retornar los grupos almacenados
    return JSON.parse(localStorage.getItem("dealProductGroups")) || [];
  }
};

const calculateDateFrom = (daysAgo) => {
  const today = new Date();
  return new Date(today.setDate(today.getDate() + parseInt(daysAgo)));
};

const SearchFilter = ({ onFiltersChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("any");
  const [filterDate, setFilterDate] = useState("-7");
  const [salesRank, setSalesRank] = useState("");
  const [minProfit, setMinProfit] = useState("");
  const [minRoi, setMinRoi] = useState("");
  const [hideNoSalesRank, setHideNoSalesRank] = useState(true);

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
      dateFrom: calculateDateFrom(filterDate),
      dateTo: new Date(), // La fecha actual es el `dateTo`
      salesRankTo: salesRank === "" ? undefined : parseInt(salesRank, 10),
      profitFrom: minProfit === "" ? undefined : parseInt(minProfit, 10), // no funciona pasar decimales a la api parseFloat(minProfit).toFixed(2),
      ROIFrom: minRoi === "" ? undefined : parseInt(minRoi, 10),
      hideNoSalesRank,
    };
    console.log(newFilters);
    onFiltersChange(newFilters); // Pasar los filtros al componente padre
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" color="#FFFFFF">
              Search Filter
            </Typography>
          }
          sx={{ backgroundColor: "#735AC7" }}
        />
        <CardContent style={{ paddingTop: "1.5%" }}>
          <Grid container spacing={2} alignItems="center">
            {/* Category Filter */}
            <Grid item md={6}>
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

            {/* Filter Date */}
            <Grid item md={6}>
              <FormControl fullWidth variant="outlined" sx={{ height: "56px" }}>
                <InputLabel>show only deals from the:</InputLabel>
                <Select
                  label="show only deals from the:"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                  }}
                  sx={{ height: "56px" }}
                >
                  <MenuItem value="-7">Last week</MenuItem>
                  <MenuItem value="-14">Last two weeks</MenuItem>
                  <MenuItem value="-30">Last month</MenuItem>
                  <MenuItem value="-90">Last three months</MenuItem>
                  <MenuItem value="-180">Last six months</MenuItem>
                  <MenuItem value="-365">Last year</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Sales Rank */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  type="text"
                  label="Sales Rank"
                  value={salesRank}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^0-9]/g, "");
                    setSalesRank(newValue);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterList />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">or less</InputAdornment>,
                    sx: { height: "56px" },
                    inputMode: "numeric", // Muestra teclado numérico en móviles
                    pattern: "[0-9]*", // Ayuda a validar en algunos navegadores
                  }}
                />
              </FormControl>
            </Grid>

            {/* Profit */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  type="text"
                  label="Profit"
                  value={minProfit}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^0-9]/g, "");
                    setMinProfit(newValue);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">or greater</InputAdornment>,
                    sx: { height: "56px" },
                    inputMode: "numeric", // Muestra teclado numérico en móviles
                    pattern: "[0-9]*", // Ayuda a validar en algunos navegadores
                  }}
                />
              </FormControl>
            </Grid>

            {/* ROI */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  type="text"
                  label="ROI"
                  value={minRoi}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^0-9]/g, "");
                    setMinRoi(newValue);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Percent />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">or greater</InputAdornment>,
                    sx: { height: "56px" },
                    inputMode: "numeric", // Muestra teclado numérico en móviles
                    pattern: "[0-9]*", // Ayuda a validar en algunos navegadores
                  }}
                />
              </FormControl>
            </Grid>

            {/* Hide products without sales rank */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hideNoSalesRank}
                    onChange={(e) => {
                      setHideNoSalesRank(e.target.checked);
                    }}
                  />
                }
                label="Hide products with no sales rank."
              />
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
SearchFilter.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default SearchFilter;
