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
import { useState } from "react";
// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
// @mui material components
import theme from "assets/theme";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
// Images
import client from "ApiClient";

import { Grid } from "@mui/material";
import MSLeftPanel from "components/MSLeftPanel/MSLeftPanel";

/*eslint-disable*/
function Forgot() {
  const [errorSB, setErrorSB] = useState(false);
  const navigate = useNavigate();
  const closeErrorSB = () => setErrorSB(false);
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    const options = {
      method: "GET",
      url: `users/forgotPassword`,
      headers: {
        "content-type": "application/json",
      },
    };

    options.params = {
      email: email,
    };

    client
      .request(options)
      .then((response) => {
        navigate(`/forgotDone?email=${email}`); // window.location.href = "/"; // navigate("/blogArticles");
      })
      .catch((error) => {
        console.log("ERROR", error);
        setErrorSB(true);
      });
  };

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Login failed"
      content="Your credentails are wrong"
      dateTime=""
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      backgroundcolor={"error"}
    />
  );

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
        <MSLeftPanel type="forgot" />
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
          <MDBox component="form" role="form" style={{ width: "40%" }}>
            <MDTypography variant="h2" fontWeight="medium" mb={2}>
              Forgot password
            </MDTypography>

            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="primary"
                fullWidth
                onClick={handleLogin}
              >
                Recover password
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Go back to{" "}
                <MDTypography
                  component={Link}
                  to="/"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  sign in
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
        {renderErrorSB}
      </Grid>
    </Grid>
  );
}

export default Forgot;
