import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProductsFilter from "./ProductsFilter";
import CardProducts from "./CardProducts";

function ProductsFinder() {
  // Estado para almacenar los filtros seleccionados
  const [filters, setFilters] = useState({});

  // Función que se pasa a SearchFilter para actualizar los filtros
  const handleFiltersChange = (newFilters) => {
    console.log("filters", newFilters);
    setFilters({ ...newFilters, page: 0, total_rows: 10000 });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ProductsFilter onFiltersChange={handleFiltersChange} />
      <CardProducts filters={filters} />
    </DashboardLayout>
  );
}

export default ProductsFinder;
