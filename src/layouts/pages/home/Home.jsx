import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Home() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <h1>Home Page</h1>
    </DashboardLayout>
  );
}

export default Home;
