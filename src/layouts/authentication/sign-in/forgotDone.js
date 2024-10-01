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
import MDBox from "components/MDBox";
import theme from "assets/theme";
import { useSearchParams } from "react-router-dom";
import MDTypography from "components/MDTypography";
import { Grid } from "@mui/material";
import Icon from "@mui/material/Icon";
import MSLeftPanel from "components/MSLeftPanel/MSLeftPanel";

/*eslint-disable*/
function ForgotDone() {
  const [searchParams] = useSearchParams();
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
        <MSLeftPanel type="forgot-done" />
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
                <Icon>info</Icon>&nbsp;We've sent an email to {searchParams.get("email")} with the
                password reset instructions.
              </MDTypography>
            </MDBox>
            <MDTypography variant="subtitle2" mb={2}>
              Didn't get your email? Check your spam folder.
            </MDTypography>
          </MDBox>
        </MDBox>
      </Grid>
    </Grid>
  );
}

export default ForgotDone;
