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

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

// Image
import bgImage from "assets/images/illustrations/illustration-verification.jpg";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";

// ApiClient
import client from "services/ApiClient";
import MDSnackbar from "components/MDSnackbar";

function Illustration() {
  const [rememberMe, setRememberMe] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const closeErrorSB = () => setErrorSB(false);
  // const [email, setEmail] = useState("kiamso@gmail.com");
  // const [password, setPassword] = useState("CatrielYPaquito");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  const navigate = useNavigate();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const location = useLocation();
  const [scode, setScode] = useState(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const scodeParam = queryParams.get("scode");
    if (scodeParam) {
      setScode(scodeParam);
    }
    // Limpia el token de autorización y el nombre de usuario
    localStorage.removeItem("AuthorizationToken");
    localStorage.removeItem("userName");
  }, [location]);

  const handleLogin = () => {
    const options = {
      method: "GET",
      url: `users/login`,
      headers: {
        "content-type": "application/json",
      },
    };

    options.params = {
      email: email,
      // base64 encoded password
      password: btoa(password),
    };
    if (scode) {
      options.params.scode = scode;
    }
    console.log("scode", scode);

    client
      .request(options)
      .then((response) => {
        if (response == "Unauthorized") setErrorSB(true);
        else if (response.toString().indexOf("http") !== -1) {
          window.location.href = response;
        } else {
          if (response.user_token !== undefined) {
            switch (process.env.REACT_APP_MAIN_DOMAIN) {
              case "localhost":
                localStorage.setItem("unlayerID", 229090);
                localStorage.setItem("plName", "SendPad");
                break;
              case "sendpaddev.com":
                localStorage.setItem("unlayerID", 229090);
                localStorage.setItem("plName", "SendPad");
                break;
              case "sendpad.com":
                localStorage.setItem("unlayerID", 229090);
                localStorage.setItem("plName", "SendPad");
                break;
              case "mailsense.ai":
                localStorage.setItem("unlayerID", 205839);
                localStorage.setItem("plName", "mailSense");
                break;
              case "funnelsense.ai":
                localStorage.setItem("unlayerID", 205839);
                localStorage.setItem("plName", "funnelsense");
                break;
              default:
                localStorage.setItem("unlayerID", 229090);
                localStorage.setItem("plName", "SendPad");
                break;
            }
            localStorage.setItem("account", JSON.stringify(response));
            localStorage.setItem("AuthorizationToken", JSON.stringify(response.user_token));
            localStorage.setItem("userName", response.user_name);
            localStorage.setItem(
              "userPicture",
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            );
            navigate("/products-finder");
            window.location.reload();
          } else setErrorSB(true);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
        setErrorSB(true);
      });
  };

  useEffect(() => {
    localStorage.removeItem("AuthorizationToken");
    localStorage.removeItem("userName");
  }, []);

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
    <IllustrationLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      illustration={bgImage}
    >
      <MDBox component="form" role="form">
        <MDBox mb={2}>
          <MDInput
            autoComplete="email"
            type="email"
            label="Email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            // value={"kiamso@gmail.com"}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            autoComplete="email"
            type={passVisible ? "text" : "password"}
            label="Password"
            value={password}
            //value={"CatrielYPaquito"}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
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
            color="info"
            size="large"
            fullWidth
            onClick={() => handleLogin()}
          >
            sign in
          </MDButton>
        </MDBox>
        <MDBox mt={3} textAlign="center">
          <MDTypography variant="button" color="text">
            Don&apos;t have an account?{" "}
            <MDTypography
              component={Link}
              to="/authentication/sign-up/cover"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
      {renderErrorSB}
    </IllustrationLayout>
  );
}

export default Illustration;
