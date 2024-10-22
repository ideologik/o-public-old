import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SearchFilter from "./SearchFilter";
import TableDeals from "./TableDeals";

function Home() {
  // Estado para almacenar los filtros seleccionados
  const [filters, setFilters] = useState({});

  // Función que se pasa a SearchFilter para actualizar los filtros
  const handleFiltersChange = (newFilters) => {
    console.log("filters", newFilters);
    setFilters(newFilters);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SearchFilter onFiltersChange={handleFiltersChange} />
      <TableDeals filters={filters} />
    </DashboardLayout>
  );
}

export default Home;
