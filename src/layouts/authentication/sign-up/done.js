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

// @mui material components

// Material Dashboard 2 React components
import { useSearchParams } from "react-router-dom";
import theme from "assets/theme";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Grid } from "@mui/material";
import Icon from "@mui/material/Icon";
import { useState } from "react";
import MSLeftPanel from "components/MSLeftPanel/MSLeftPanel";

/*eslint-disable*/
function Done() {
  const [searchParams] = useSearchParams();
  const [user_token] = useState(searchParams.get("token"));
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
        <MSLeftPanel type="subscription-done" />
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
              All done !
            </MDTypography>

            <MDTypography variant="h2" fontWeight="medium" mb={2}>
              Please check your email.
            </MDTypography>

            <MDBox
              p={2}
              sx={{
                //You can copy the code below in your theme
                background: "#bce2be",
                "& .MuiPaper-root": {
                  background: "#bce2be",
                },
                "& .MuiBackdrop-root": {
                  backgroundColor: "transparent", // Try to remove this to see the result
                },
              }}
            >
              <MDTypography variant="subtitle2" mb={2} fontWeight="medium">
                <Icon>info</Icon>&nbsp;We've sent an email to {searchParams.get("email")} with a
                link to activate your account.
              </MDTypography>
            </MDBox>
            <MDTypography variant="subtitle2" mb={2}>
              If the email is not in your inbox, please check your spam folder.
            </MDTypography>
            <MDTypography
              component="a"
              onClick={() => {
                alert("Resend link");
              }}
              variant="button"
              fontWeight="bold"
              color="info"
              textGradient
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              <RefreshIcon /> Resend link
            </MDTypography>
          </MDBox>
        </MDBox>
      </Grid>
    </Grid>
  );
}

export default Done;
