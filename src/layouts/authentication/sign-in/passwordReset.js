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
import { useState, useRef } from "react";
import theme from "assets/theme";
// import FacebookLogin from "react-facebook-login";
// import { GoogleLogin } from "react-google-login";
// react-router-dom components
import { useNavigate, useSearchParams } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// @mui material components
import PasswordChecklist from "react-password-checklist";
import bcrypt from "bcryptjs-react";
import client from "ApiClient";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
// import client from "ApiClient";
// import md5 from "md5";
import { Grid } from "@mui/material";
import { IconButton, InputAdornment, Tooltip } from "@material-ui/core";
import MDSnackbar from "components/MDSnackbar";
import MSLeftPanel from "components/MSLeftPanel/MSLeftPanel";

/* eslint-disable */
function PasswordReset() {
  const [termsAccepted, setTermsAccepted] = useState(true);
  const handlesetTermsAccepted = () => setTermsAccepted(!termsAccepted);
  const [isLoading, setIsLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [, forceUpdate] = useState();
  const simpleValidator = useRef(new SimpleReactValidator());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = () => {
    if (simpleValidator.current.allValid()) {
      setEmailTaken(false);
      setIsLoading(true);
      const options = {
        method: "GET",
        url: `users/passwordReset`,
      };

      options.params = {
        token: searchParams.get("token"),
        password: bcrypt.hashSync(password),
      };

      client
        .request(options)
        .then((response) => {
          setIsLoading(false);
          console.log(response);
          if (response == "unauthorized") setOpenAlert(true);
          if (response.indexOf("http") !== -1) window.location.href = response;
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    } else {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    }
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
        <MSLeftPanel type="password-reset" />
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
              Password reset{" "}
            </MDTypography>
            <MDBox mb={2}>
              <MDInput
                required
                type={passVisible ? "text" : "password"}
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPassVisible(!passVisible)}
                        color="secondary"
                        aria-label="prompt"
                      >
                        {!passVisible ? (
                          <Tooltip title="View password" color="text">
                            <VisibilityIcon />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Hide password" color="text">
                            <VisibilityOffIcon />
                          </Tooltip>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Your password must contain:
              </MDTypography>
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital", "lowercase", "match"]}
                minLength={8}
                value={password}
                valueAgain={passwordAgain}
                onChange={(isValid) => setValidPassword(isValid)}
                iconSize={12}
                style={{ fontSize: 12 }}
                messages={{
                  minLength: "Minimum 8 characters",
                  specialChar: "At least 1 special character",
                  number: "At least 1 number",
                  capital: "At least 1 upper case",
                  lowercase: "At least 1 lower case",
                  match: "Passwords match",
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                required
                type={passVisible ? "text" : "password"}
                label="Confirm Password"
                fullWidth
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPassVisible(!passVisible)}
                        color="secondary"
                        aria-label="prompt"
                      >
                        {!passVisible ? (
                          <Tooltip title="View password" color="text">
                            <VisibilityIcon />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Hide password" color="text">
                            <VisibilityOffIcon />
                          </Tooltip>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="primary"
                fullWidth
                onClick={handleLogin}
                disabled={isLoading || !validPassword}
              >
                change password
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Grid>
      <MDSnackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        color="error"
        icon="error"
        title={"Error"}
        content="Token expired. Please request a new one."
        dateTime=""
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        close={() => setOpenAlert(false)}
      />
    </Grid>
  );
}

export default PasswordReset;
