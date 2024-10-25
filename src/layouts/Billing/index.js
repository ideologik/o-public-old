import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { CircularProgress, Grid } from "@mui/material";
import { Card, LinearProgress, TableCell } from "@material-ui/core";
import client from "services/ApiClient";
import MDTypography from "components/MDTypography";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { FeatureFlags } from "context/FeatureFlags";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Subscription from "./subscription";

/* eslint-disable */
export default function Billing() {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [openSB, setOpenSB] = useState(false);
  const [colorSB, setColorSB] = useState("success");
  const [iconSB, setIconSB] = useState("success");
  const [titleSB, setTitleSB] = useState("Success");
  const [contentSB, setContentSB] = useState("Subscription updated successfully");
  const [openSubscription, setOpenSubscription] = useState(false);
  const handleCloseSubscription = () => setOpenSubscription(false);
  const [openPayment, setOpenPayment] = useState(false);
  const handleClosePayment = () => setOpenPayment(false);
  const { features } = useContext(FeatureFlags);

  const oldRender = TableCell.render;
  TableCell.render = function (...args) {
    const [props, ...otherArgs] = args;
    if (typeof props === "object" && props && "isEmpty" in props) {
      const { isEmpty, ...propsWithoutEmpty } = props;
      return oldRender.apply(this, [propsWithoutEmpty, ...otherArgs]);
    } else {
      return oldRender.apply(this, args);
    }
  };

  const options = {
    method: "GET",
    url: "reports",
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

  const pause = () => {
    const options = {
      method: "GET",
      url: `users/pauseSubscription`,
      headers: {
        "content-type": "application/json",
      },
    };

    client
      .request(options)
      .then((response) => {
        if (response.indexOf("http") !== -1) window.location.href = response;
        else {
          setOpenSB(true);
          setContentSB("Subscription paused successfully");
        }
      })
      .catch(() => {
        // setErrorSB(true);
      });
  };

  const cancel = () => {
    const options = {
      method: "GET",
      url: `users/cancelSubscription`,
      headers: {
        "content-type": "application/json",
      },
    };

    client
      .request(options)
      .then((response) => {
        if (response.indexOf("http") !== -1) window.location.href = response;
        else {
          setOpenSB(true);
          setContentSB("Subscription cancelled successfully");
        }
      })
      .catch(() => {
        // setErrorSB(true);
      });
  };

  const updatePayment = () => {
    setIsLoading(true);
    const options = {
      method: "GET",
      url: `users/updatePaymentMethod`,
      headers: {
        "content-type": "application/json",
      },
    };

    client
      .request(options)
      .then((response) => {
        setIsLoading(false);
        if (response.indexOf("http") !== -1) window.location.href = response;
      })
      .catch(() => {
        // setErrorSB(true);
      });
  };

  useEffect(() => {
    planInformation();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDSnackbar
        color={colorSB}
        icon={iconSB}
        title={titleSB}
        content={contentSB}
        dateTime={""}
        open={openSB}
        onClose={() => setOpenSB(false)}
        close={() => setOpenSB(false)}
        bgWhite
      />
      <Subscription openModal={openSubscription} closeModal={handleCloseSubscription} plan={plan} />
      <MDBox pb={3} pt={2}>
        <Grid container spacing={6}>
          {plan && (
            <Grid item xs={12} md={12} lg={12} p={1} mb={2} pb={2} style={{ width: "100%" }}>
              <Card>
                <Grid
                  justify="flex-end"
                  pb={2}
                  px={2}
                  pt={2}
                  style={{ width: "100%", textAlign: "right" }}
                >
                  <MDButton
                    disabled={isLoading}
                    variant="outlined"
                    color="success"
                    sx={{ marginX: 2 }}
                    onClick={() => updatePayment()}
                  >
                    Change payment
                    {isLoading && (
                      <CircularProgress
                        size={24}
                        style={{ marginLeft: 15, position: "relative", top: 4 }}
                      />
                    )}
                  </MDButton>
                  {plan.contactsLimit != undefined && (
                    <>
                      <MDButton
                        disabled={isLoading}
                        variant="outlined"
                        color="success"
                        onClick={() => setOpenSubscription(true)}
                      >
                        Upgrade
                      </MDButton>

                      <MDButton
                        disabled={isLoading}
                        variant="outlined"
                        color="warning"
                        sx={{ marginX: 2 }}
                        onClick={() => pause()}
                      >
                        Pause
                      </MDButton>

                      <MDButton
                        disabled={isLoading}
                        variant="outlined"
                        color="error"
                        onClick={() => cancel()}
                      >
                        Cancel
                      </MDButton>
                    </>
                  )}
                </Grid>
                <MDBox pb={2} px={2} pt={2}>
                  <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize">
                    Subscription plan
                  </MDTypography>
                  <MDTypography variant="subtitle2" color="text" fontWeight="regular">
                    Cost ${plan.cost / 100} / {plan.frequency}
                  </MDTypography>
                </MDBox>
                <MDBox pb={2} px={2}>
                  <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize">
                    Current Plan
                  </MDTypography>
                  <MDTypography variant="subtitle2" color="text" fontWeight="regular">
                    {plan.totalContacts} / {plan.contactsLimit} subscribers
                  </MDTypography>
                  <LinearProgress
                    variant="determinate"
                    value={(plan.totalContacts * 100) / plan.contactsLimit}
                  />
                </MDBox>
                <MDBox pb={2} px={2}>
                  <MDTypography variant="subtitle" color="text" fontWeight="regular">
                    Your plan will renew at {moment(plan.nextBillingDate).format("MMM Do YY")}
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
