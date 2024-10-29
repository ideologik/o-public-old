import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import TableMyDeals from "./TableMyDeals";

function MyDeals() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TableMyDeals />
    </DashboardLayout>
  );
}

export default MyDeals;
