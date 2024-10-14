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

// react-router-dom components
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import client from "ApiClient";
// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import SimpleReactValidator from "simple-react-validator";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// @mui material components
import PasswordChecklist from "react-password-checklist";
import bcrypt from "bcryptjs-react";
// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { IconButton, InputAdornment, Tooltip } from "@material-ui/core";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useEffect, useRef, useState } from "react";

function Cover() {
  const [termsAccepted, setTermsAccepted] = useState(true);
  const handlesetTermsAccepted = () => setTermsAccepted(!termsAccepted);
  const [isLoading, setIsLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [, forceUpdate] = useState();
  const [iagree, setIagree] = useState(false);
  //  const simpleValidator = useRef(new SimpleReactValidator());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (searchParams.get("email")) setEmail(searchParams.get("email"));
  }, []);

  const Login = () => {
    navigate("/done?email=" + email);
  };

  const simpleValidator = useRef(
    new SimpleReactValidator({
      validators: {
        passwords: {
          // name the rule
          message: "Please check the password requirements",
          rule: (val, params, validator) => {
            return val;
          },
          messageReplace: (message, params) =>
            message.replace(":values", this.helpers.toSentence(params)), // optional
          required: true, // optional
        },
        iagree: {
          // name the rule
          message: "Please accept Terms and Conditions",
          rule: (val, params, validator) => {
            return val;
          },
          messageReplace: (message, params) =>
            message.replace(":values", this.helpers.toSentence(params)), // optional
          required: true, // optional
        },
      },
    })
  );

  const handleLogin = () => {
    if (simpleValidator.current.allValid()) {
      setEmailTaken(false);
      setIsLoading(true);
      const options = {
        method: "POST",
        url: `users/register`,
      };

      options.params = {
        name: name,
        email: email,
        coupon: couponCode,
        password: bcrypt.hashSync(password),
      };

      client
        .request(options)
        .then((response) => {
          setIsLoading(false);
          console.log(response);
          if (response.indexOf("http") !== -1) window.location.href = response;
          else {
            if (response === "User already exists") setEmailTaken(true);
            else if (response !== "Unauthorized") Login();
            else console.log("Unauthorized");
          }
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
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                required
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <MDBox color="red">{simpleValidator.current.message("Name", name, "required")}</MDBox>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              {emailTaken && (
                <MDBox ml={2}>
                  <MDTypography fontWeight="bold" color="error" variant="button" textGradient>
                    User already exists
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
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
              <MDBox color="red">
                {simpleValidator.current.message("Password", validPassword, "passwords")}
              </MDBox>
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="couponCode"
                label="Coupon code"
                placeholder="Enter a coupon code"
                fullWidth
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox onChange={(e) => setIagree(!iagree)} value={iagree} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox color="red">{simpleValidator.current.message("iagree", iagree, "iagree")}</MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                disabled={isLoading}
                variant="gradient"
                color="info"
                style={{ cursor: isLoading ? "not-allowed" : "pointer", color: "white" }}
                fullWidth
                onClick={() => handleLogin()}
              >
                sign up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
