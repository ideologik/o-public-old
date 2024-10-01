/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Anaytics dashboard components
import SalesByCountry from "layouts/dashboards/analytics/components/SalesByCountry";

// ApiClient
import client from "ApiClient";

import { useEffect, useState } from "react";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import PieChart from "examples/Charts/PieChart";
import Subscription from "./subscription";
import { Card } from "@mui/material";
import { Chip, ListItemText, MenuItem, Select } from "@material-ui/core";

/*eslint-disable*/
function Analytics() {
  const [countryData, setCountryData] = useState(null);
  const [openSubscription, setOpenSubscription] = useState(false);
  const handleCloseSubscription = () => setOpenSubscription(false);
  const [plan, setPlan] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(0);

  const options = {
    method: "GET",
    url: "dashboard",
  };

  const planInformation = async () => {
    options.url = `dashboard/planInformation`;
    await client
      .request(options)
      .then((response) => {
        setPlan(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = async () => {
    options.method = "GET";
    options.url = `dashboard?page_id=${selectedPage}`;

    await client
      .request(options)
      .then((response) => {
        setCountryData(response);
      })
      .catch((error) => {
        console.log("ERRORE", error);
      });
  };

  const getPages = async () => {
    setPages([]);
    options.method = "GET";
    options.url = `pages`;
    await client
      .request(options)
      .then((response) => {
        setPages(response.filter((p) => p.pag_fun_id == 0).reverse());
        //set filter for search with all disctinct pag_category
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getPages();
    getData();
    planInformation();
  }, []);

  useEffect(() => {
    getData();
  }, [selectedPage]);

  useEffect(() => {
    if (countryData != null) {
      countryData.traffic_by_day.datasets[0].color = "info";
      countryData.traffic_by_day.datasets[1].color = "secondary";
    }
  }, [countryData]);

  // Action buttons for the BookingCard
  const actionButtons = (
    <>
      <Tooltip title="Refresh" placement="bottom">
        <MDTypography
          variant="body1"
          color="primary"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
        >
          <Icon color="inherit">refresh</Icon>
        </MDTypography>
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        <MDTypography variant="body1" color="info" lineHeight={1} sx={{ cursor: "pointer", mx: 3 }}>
          <Icon color="inherit">edit</Icon>
        </MDTypography>
      </Tooltip>
    </>
  );

  const getStatus = (plan) => {
    switch (plan.status) {
      case "active":
        return (
          <Chip
            label="Active"
            color="success"
            size="small"
            style={{ backgroundColor: "#4caf50", color: "#fff" }}
          />
        );
      case "trialing":
        return (
          <Chip
            label="Trial"
            color="info"
            size="small"
            style={{ backgroundColor: "#0088F5", color: "#fff" }}
          />
        );
      case "past_due":
        return (
          <Chip
            label="Past due"
            color="warning"
            size="small"
            style={{ backgroundColor: "#ff9800", color: "#fff" }}
          />
        );
      case "canceled":
        return (
          <Chip
            label="Canceled"
            color="error"
            size="small"
            style={{ backgroundColor: "#f44336", color: "#fff" }}
          />
        );
      default:
        return (
          <Chip
            label={plan.status === undefined ? "No plan" : plan.status}
            color="info"
            size="small"
            style={{ backgroundColor: "#f44336", color: "#fff" }}
          />
        );
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {plan && (
        <Subscription
          openModal={openSubscription}
          closeModal={handleCloseSubscription}
          plan={plan}
        />
      )}
      {plan && (
        <Grid item xs={12} md={12} lg={12} p={1} mb={2} pb={2}>
          <Card>
            <MDBox pb={2} px={2} pt={2}>
              <Grid container>
                <Grid item xs={10}>
                  <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize">
                    Subscription plan
                  </MDTypography>
                  <MDTypography variant="subtitle2" color="text" fontWeight="regular">
                    {plan.lenght > 0 ? "Cost " + plan.cost / 100 / plan.frequency : ""}
                  </MDTypography>
                </Grid>
                <Grid item xs={2} style={{ width: "100%", textAlign: "right" }}>
                  {getStatus(plan)}
                </Grid>
              </Grid>
            </MDBox>
            <MDBox pb={2} px={2}>
              {plan.status === "active" && (
                <MDTypography variant="subtitle" color="text" fontWeight="regular">
                  Your plan will renew at {moment(plan.nextBillingDate).format("MMM Do YY")}
                </MDTypography>
              )}
              {plan.status === "past_due" && (
                <MDTypography variant="subtitle" color="text" fontWeight="regular">
                  Fail to billing your subscription. Please complete your payment
                  <a
                    href={plan.hostedInvoiceUrl}
                    target="_blank"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    {" "}
                    here
                  </a>
                </MDTypography>
              )}
            </MDBox>
            <MDBox pb={2} px={2}>
              {plan.remainingContacts < 0 && (
                <MDTypography variant="subtitle" color="text" fontWeight="regular">
                  Your current subscriptors exceed the limit.{" "}
                  <MDButton
                    variant="gradient"
                    color="success"
                    onClick={() => setOpenSubscription(true)}
                    style={{ marginRight: 10 }}
                  >
                    Please upgrade your plan
                  </MDButton>
                </MDTypography>
              )}
            </MDBox>
          </Card>
        </Grid>
      )}
      {pages && pages.length > 0 && (
        <Card mb={2}>
          <MDTypography variant="h6" fontWeight="medium" p={2}>
            Select a page to view reports
          </MDTypography>
          <MDBox pl={4} pb={4}>
            <Select
              placeholder="Select a page"
              value={selectedPage}
              onChange={(e) => {
                setSelectedPage(e.target.value);
              }}
            >
              <MenuItem key={0} value={0}>
                <ListItemText primary={"All pages"} secondary="Get reports for all pages" />
              </MenuItem>
              {pages.map((page) => (
                <MenuItem key={page.pag_id} value={page.pag_id}>
                  <ListItemText primary={page.pag_title} secondary={page.pag_url} />
                </MenuItem>
              ))}
            </Select>
          </MDBox>
        </Card>
      )}
      {countryData && (
        <MDBox py={3}>
          <MDBox mt={1.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="weekend"
                    title="Total visits today"
                    count={countryData.total_last_24}
                    percentage={{
                      color:
                        countryData.total_last_48 - countryData.total_last_24 > 0
                          ? "error"
                          : "success",
                      amount: Math.abs(countryData.total_last_48 - countryData.total_last_24),
                      label:
                        countryData.total_last_48 - countryData.total_last_24 > 0
                          ? " less than yesterday"
                          : " more than yesterday",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="info"
                    icon="weekend"
                    title="Total visits yesterday"
                    count={countryData.total_last_48}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="secondary"
                    icon="weekend"
                    title="Total visits this month"
                    count={countryData.total_last_30_days}
                    percentage={{
                      color:
                        countryData.total_last_60_days - countryData.total_last_30_days > 0
                          ? "error"
                          : "success",
                      amount: Math.abs(
                        countryData.total_last_60_days - countryData.total_last_30_days
                      ),
                      label:
                        countryData.total_last_60_days - countryData.total_last_30_days > 0
                          ? " less than last month"
                          : " more than last month",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="weekend"
                    title="Total visits last month"
                    count={countryData.total_last_60_days}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
          {countryData.map_markers.length > 0 && (
            <>
              <Grid container mt={2}>
                <SalesByCountry salesTableData={countryData} />
              </Grid>
              <MDBox mt={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} lg={12}>
                    <MDBox mb={3}>
                      <DefaultLineChart title="Daily visits" chart={countryData.traffic_by_day} />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <PieChart title="Traffic by OS" chart={countryData.traffic_by_os_pie} />
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <PieChart
                        title="traffic by browser"
                        chart={countryData.traffic_by_browser_pie}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <PieChart
                        title="Traffic by language"
                        chart={countryData.traffic_by_language_pie}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <PieChart title="Traffic by page" chart={countryData.traffic_by_page_pie} />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <PieChart
                        title="Traffic by screen resolution"
                        chart={countryData.traffic_by_screenres_pie}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <PieChart
                        title="Traffic by source"
                        chart={countryData.traffic_by_source_pie}
                      />
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </>
          )}
          {/*}
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mt={3}>
                <BookingCard
                  image={booking1}
                  title="Cozy 5 Stars Apartment"
                  description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
                  price="$899/night"
                  location="Barcelona, Spain"
                  action={actionButtons}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mt={3}>
                <BookingCard
                  image={booking2}
                  title="Office Studio"
                  description='The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the night life in London, UK.'
                  price="$1.119/night"
                  location="London, UK"
                  action={actionButtons}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mt={3}>
                <BookingCard
                  image={booking3}
                  title="Beautiful Castle"
                  description='The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Milan.'
                  price="$459/night"
                  location="Milan, Italy"
                  action={actionButtons}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        */}
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
