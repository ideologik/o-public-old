import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProductsFilter from "./ProductsFilter";
import CardProducts from "./CardProducts";
import { useAtom } from "jotai";
import { bsSelectedCategorytAtom } from "stores/productAtom";

function ProductsFinder() {
  // Estado para almacenar los filtros seleccionados
  const [filters, setFilters] = useState({});
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);

  // Función que se pasa a SearchFilter para actualizar los filtros
  const handleFiltersChange = (newFilters) => {
    const { isCategoriesLoaded, ...filters } = newFilters;
    console.log("filters", newFilters);
    console.log("filters", filters);
    setFilters({ ...filters });
    if (newFilters.isCategoriesLoaded !== undefined) {
      setIsCategoriesLoaded(newFilters.isCategoriesLoaded);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ProductsFilter onFiltersChange={handleFiltersChange} />
      {isCategoriesLoaded ? <CardProducts filters={filters} /> : null}
    </DashboardLayout>
  );
}

export default ProductsFinder;
