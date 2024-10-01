import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useState } from "react";

/* elint-disable */
export default function MSLeftPanel(props) {
  const [type] = useState(props);

  switch (process.env.REACT_APP_PLNAME) {
    case "sendpad":
      switch (type) {
        case "sign-in":
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <img src="/images/sendpad/login-illustration.d210c087.svg" alt="illustration" />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="body2" fontWeight="medium">
                  SendPad
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  style={{ color: "#000", width: "70%" }}
                  display="block"
                  variant="h3"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Create email broadcasts as quickly as the speed of light
                </MDTypography>
              </MDBox>
            </MDBox>
          );
        case "password-reset":
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <img src="/images/sendpad/signup-illustration.7613a235.svg" alt="illustration" />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="body2" fontWeight="medium">
                  SendPad
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  style={{ color: "#000", width: "70%" }}
                  display="block"
                  variant="h3"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Create email broadcasts as quickly as the speed of light
                </MDTypography>
              </MDBox>
            </MDBox>
          );
        case "forgot-done":
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <img
                  src="/images/sendpad/forgot-password-notification-illustration.965a39a4.svg"
                  alt="illustration"
                />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="body2" fontWeight="medium">
                  SendPad
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  style={{ color: "#000", width: "70%" }}
                  display="block"
                  variant="h3"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Create email broadcasts as quickly as the speed of light
                </MDTypography>
              </MDBox>
            </MDBox>
          );
        case "forgot":
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <img
                  src="/images/sendpad/forgot-password-illustration.56430e53.svg"
                  alt="illustration"
                />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="body2" fontWeight="medium">
                  SendPad
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  style={{ color: "#000", width: "70%" }}
                  display="block"
                  variant="h3"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Create email broadcasts as quickly as the speed of light
                </MDTypography>
              </MDBox>
            </MDBox>
          );
        case "sign-up":
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <img src="/images/sendpad/signup-illustration.7613a235.svg" alt="illustration" />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="body2" fontWeight="medium">
                  SendPad
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  style={{ color: "#000", width: "70%" }}
                  display="block"
                  variant="h3"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Create email broadcasts as quickly as the speed of light
                </MDTypography>
              </MDBox>
            </MDBox>
          );
        case "subscription":
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <img src="/images/sendpad/signup-illustration.7613a235.svg" alt="illustration" />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="body2" fontWeight="medium">
                  SendPad
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  style={{ color: "#000", width: "70%" }}
                  display="block"
                  variant="h3"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Create email broadcasts as quickly as the speed of light
                </MDTypography>
              </MDBox>
            </MDBox>
          );
        case "subscription-done":
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <img src="/images/sendpad/signup-illustration.7613a235.svg" alt="illustration" />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="body2" fontWeight="medium">
                  SendPad
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  style={{ color: "#000", width: "70%" }}
                  display="block"
                  variant="h3"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Create email broadcasts as quickly as the speed of light
                </MDTypography>
              </MDBox>
            </MDBox>
          );
        default:
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <img src="/images/sendpad/login-illustration.d210c087.svg" alt="illustration" />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="body2" fontWeight="medium">
                  SendPad
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="center">
                <MDTypography
                  style={{ color: "#000", width: "70%" }}
                  display="block"
                  variant="h3"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Create email broadcasts as quickly as the speed of light
                </MDTypography>
              </MDBox>
            </MDBox>
          );
      }

    case "mailsense":
      switch (type) {
        case "sign-in":
          return (
            <MDBox>
              <MDBox mt={10} mb={5} display="flex" justifyContent="center">
                <img src="/images/email.png" alt="logo" />
              </MDBox>
              <MDBox mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="h1" fontWeight="bold">
                  MailSense
                </MDTypography>
              </MDBox>
            </MDBox>
          );
        default:
          return (
            <MDBox>
              <MDBox mt={10} mb={15} display="flex" justifyContent="center">
                <img src="/images/email.png" alt="logo" />
              </MDBox>
              <MDBox mt={10} mb={3} display="flex" justifyContent="center">
                <MDTypography display="block" variant="h1" fontWeight="medium">
                  MailSense
                </MDTypography>
              </MDBox>
            </MDBox>
          );
      }
    default:
      return (
        <MDBox>
          <MDBox mt={10} mb={15} display="flex" justifyContent="center">
            <img src="/images/sendpad/sendpad-login-logo.32c527ca.svg" alt="logo" />
          </MDBox>
          <MDBox display="flex" justifyContent="center">
            <img src="/images/sendpad/login-illustration.d210c087.svg" alt="illustration" />
          </MDBox>
          <MDBox mt={10} mb={3} display="flex" justifyContent="center">
            <MDTypography display="block" variant="body2" fontWeight="medium">
              SendPad
            </MDTypography>
          </MDBox>
          <MDBox display="flex" justifyContent="center">
            <MDTypography
              style={{ color: "#000", width: "70%" }}
              display="block"
              variant="h3"
              textAlign="center"
              fontWeight="medium"
            >
              Create email broadcasts as quickly as the speed of light
            </MDTypography>
          </MDBox>
        </MDBox>
      );
  }
}
