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
import MDTypography from "components/MDTypography";
import { Grid } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Card } from "@material-ui/core";

/*eslint-disable*/
function AlreadySubscribed() {
  return (
    <Grid container justifyContent={"center"}>
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
        <Card>
          <MDBox mt={10} display="flex" justifyContent="center">
            <MDBox component="form" role="form" style={{ width: "40%" }}>
              <MDBox display="flex" justifyContent="center">
                <CheckCircleOutlineOutlinedIcon color="success" fontSize="large" />
              </MDBox>
              <MDTypography variant="h2" fontWeight="medium" mb={2}>
                You're already subscribed and set up to receive our emails.
              </MDTypography>

              <MDTypography variant="subtitle1" mb={2}>
                If you're having trouble locating them, please check your spam folder.
              </MDTypography>
            </MDBox>
          </MDBox>
        </Card>
      </Grid>
    </Grid>
  );
}

export default AlreadySubscribed;
