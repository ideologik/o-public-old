/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useEffect, useState } from "react";
import theme from "assets/theme";
// react-router-dom components
import { useSearchParams } from "react-router-dom";
// @mui material components
import Slider from "@material-ui/core/Slider";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
// import axios from "axios";
import client from "ApiClient";

import { Grid } from "@mui/material";
import { Card, Chip, Divider } from "@material-ui/core";
import MDButton from "components/MDButton";
import MSLeftPanel from "components/MSLeftPanel/MSLeftPanel";

/*eslint-disable*/
function Subscription() {
  const [value, setValue] = useState(0);
  const [searchParams] = useSearchParams();
  const [showSlider, setShowSlider] = useState(true);
  const [acconuntsData, setAcconuntsData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [pricingMarks, setPricingMarks] = useState();
  const [maxValue, setMaxValue] = useState(200);
  const [user_token] = useState(searchParams.get("token"));
  const [user_freeTrials] = useState(searchParams.get("ftdays"));

  const options = {
    method: "GET",
    url: `users`,
    headers: {
      "content-type": "application/json",
    },
  };

  const getData = async () => {
    options.method = "GET";
    options.url = `users/getStripeSubscriptions?token=${user_token}`;
    await client
      .request(options)
      .then((response) => {
        setAcconuntsData(response);
        let cntValue = 0;
        let arrContacts = [];
        let arrResponse = Array.from(new Set(response.map((item) => item.contacts)));

        arrResponse.map(
          (item) => (
            arrContacts.push({
              value: cntValue,
              scaledValue: item,
              label: numFormatter(item),
            }),
            (cntValue += 25)
          )
        );

        const discount = response.filter((item) => item.monthly_discount > 0);

        if (discount.length > 0) {
          setSelectedPlan(discount[0]);
          setShowSlider(false);
        }

        cntValue -= 25;
        setMaxValue(cntValue);
        setPricingMarks(arrContacts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setSelectedPlan(
      acconuntsData.filter(
        (data) => data.contacts === pricingMarks.filter((item) => item.value === 0)[0].scaledValue
      )
    );
  }, [pricingMarks]);

  useEffect(() => {
    setSelectedPlan(
      acconuntsData.filter(
        (data) =>
          data.contacts === pricingMarks.filter((item) => item.value === value)[0].scaledValue
      )
    );
  }, [value]);

  const scale = (value) => {
    const previousMarkIndex = Math.floor(value / 25);
    const previousMark = pricingMarks[previousMarkIndex];
    const remainder = value % 25;
    if (remainder === 0) {
      return previousMark.scaledValue;
    }
    const nextMark = pricingMarks[previousMarkIndex + 1];
    const increment = (nextMark.scaledValue - previousMark.scaledValue) / 25;
    return remainder * increment + previousMark.scaledValue;
  };

  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  }

  const handleChange = (event, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
      setSelectedPlan(
        acconuntsData.filter(
          (data) =>
            data.contacts === pricingMarks.filter((item) => item.value === newValue)[0].scaledValue
        )
      );
    }
  };

  const onSubscribe = (type) => {
    const options = {
      method: "GET",
      url: `users/CreateSubscription`,
      headers: {
        "content-type": "application/json",
      },
    };
    switch (type) {
      case "monthly":
        options.params = {
          price_id: selectedPlan.filter((item) => item.monthly > 0)[0].price_id,
          token: user_token,
        };
        break;
      case "annual":
        options.params = {
          price_id: selectedPlan.filter((item) => item.annual > 0)[0].price_id,
          token: user_token,
        };
        break;
    }

    client
      .request(options)
      .then((response) => {
        if (response.indexOf("http") !== -1) window.location.href = response;
      })
      .catch(() => {
        // setErrorSB(true);
      });
  };
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        xl={4}
        style={{ height: "100vh" }}
        sx={{
          //You can copy the code below in your theme
          background: theme.palette.background.default,
          "& .MuiPaper-root": {
            background: theme.palette.background.default,
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent", // Try to remove this to see the result
          },
        }}
      >
        <MSLeftPanel type="subscription" />
      </Grid>
      <Grid
        item
        xs={12}
        xl={8}
        sx={{
          //You can copy the code below in your theme
          background: "#FFFFFF",
          "& .MuiPaper-root": {
            background: "#FFFFF",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent", // Try to remove this to see the result
          },
        }}
      >
        <MDBox mt={10} display="flex" justifyContent="center">
          <MDTypography variant="h2" fontWeight="medium" mb={2}>
            {process.env.REACT_APP_SITE_TITLE} Standard Plan
          </MDTypography>
        </MDBox>
        <MDBox mt={10} display="flex" justifyContent="center">
          {showSlider && pricingMarks && setSelectedPlan && (
            <Slider
              style={{ maxWidth: 500, color: "primary" }}
              value={value}
              min={0}
              step={25}
              max={maxValue}
              valueLabelFormat={numFormatter}
              marks={pricingMarks}
              scale={scale}
              onChange={handleChange}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
          )}
        </MDBox>
        <MDBox display="flex" justifyContent="center" mt={2}>
          <Grid container spacing={5} pl={10} pr={10} pt={10} style={{ maxWidth: 800 }}>
            <Grid item xs={6}>
              <Card style={{ height: 400, padding: 30 }}>
                <MDTypography display="block" variant="h5" fontWeight="medium" mb={2}>
                  Monthly
                </MDTypography>
                <MDTypography
                  display="block"
                  variant="h2"
                  fontWeight="medium"
                  style={{
                    textDecoration:
                      selectedPlan.length > 0 &&
                      selectedPlan.filter((item) => item.monthly > 0)[0].monthly_discount != 0
                        ? "line-through"
                        : "none",
                  }}
                >
                  {selectedPlan.length > 0 &&
                    "$" + selectedPlan.filter((item) => item.monthly > 0)[0].monthly / 100}
                </MDTypography>
                {selectedPlan.length > 0 &&
                  selectedPlan.filter((item) => item.monthly > 0)[0].monthly_discount != 0 && (
                    <MDTypography display="block" variant="h2" fontWeight="medium">
                      {selectedPlan.length > 0 &&
                        "$" +
                          selectedPlan.filter((item) => item.monthly_discount > 0)[0]
                            .monthly_discount /
                            100}
                    </MDTypography>
                  )}
                <MDTypography display="block" variant="text">
                  <TaskAltIcon />
                  {selectedPlan.length > 0 && selectedPlan[0].contacts + " Contacts"}
                </MDTypography>
                <MDTypography display="block" variant="text" mb={9}>
                  <TaskAltIcon /> Enterprise support
                </MDTypography>
                <Divider />

                <MDBox display="flex" justifyContent="center" mt={2}>
                  <MDButton
                    variant="gradient"
                    color="secondary"
                    onClick={() => onSubscribe("monthly")}
                  >
                    {user_freeTrials > 0 ? user_freeTrials + "-days Free trial" : "Subscribe"}
                  </MDButton>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card style={{ height: 400, padding: 30 }}>
                <MDTypography display="block" variant="h5" fontWeight="medium" mb={2}>
                  Annual{" "}
                  <Chip
                    label="2 Months free"
                    style={{ color: "#66BB6A", backgroundColor: "#bce2be" }}
                  />
                </MDTypography>
                <MDTypography
                  display="block"
                  variant="h2"
                  fontWeight="medium"
                  style={{
                    textDecoration:
                      selectedPlan.length > 0 &&
                      selectedPlan.filter((item) => item.annual > 0)[0].annual_discount != 0
                        ? "line-through"
                        : "none",
                  }}
                >
                  {selectedPlan.length > 0 &&
                    "$" + selectedPlan.filter((item) => item.annual > 0)[0].annual / 100}
                </MDTypography>
                {selectedPlan.length > 0 &&
                  selectedPlan.filter((item) => item.annual > 0)[0].annual_discount != 0 && (
                    <MDTypography display="block" variant="h2" fontWeight="medium">
                      {selectedPlan.length > 0 &&
                        "$" +
                          selectedPlan.filter((item) => item.annual_discount > 0)[0]
                            .annual_discount /
                            100}
                    </MDTypography>
                  )}
                <MDTypography display="block" variant="text">
                  <TaskAltIcon />
                  Billed Annually
                </MDTypography>
                <MDTypography display="block" variant="text">
                  <TaskAltIcon />
                  {selectedPlan.length > 0 && selectedPlan[0].contacts + " Contacts"}
                </MDTypography>
                <MDTypography display="block" variant="text" mb={5}>
                  <TaskAltIcon /> Enterprise support
                </MDTypography>
                <Divider />
                <MDBox display="flex" justifyContent="center" mt={2}>
                  <MDButton
                    variant="gradient"
                    color="success"
                    onClick={() => onSubscribe("annual")}
                  >
                    {user_freeTrials > 0 ? user_freeTrials + "-days Free trial" : "Subscribe"}
                  </MDButton>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </Grid>
    </Grid>
  );
}

export default Subscription;
