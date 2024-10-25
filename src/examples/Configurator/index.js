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

import { useState, useEffect } from "react";
import client from "services/ApiClient";
// react-github-btn
// @mui material components
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import TimezoneSelect from "react-timezone-select";
// @mui icons

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom styles for the Configurator
import ConfiguratorRoot from "examples/Configurator/ConfiguratorRoot";

// Material Dashboard 2 PRO React context
import { useMaterialUIController, setOpenConfigurator } from "context";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { CircularProgress } from "@material-ui/core";

function Configurator() {
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [setId, setSetId] = useState("");
  const [userId, setUserId] = useState("");
  const [running, setRunning] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyZip, setCompanyZip] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");

  const [controller, dispatch] = useMaterialUIController();
  const { openConfigurator, darkMode } = controller;
  const [disabled, setDisabled] = useState(false);

  // Use the useEffect hook to change the button state for the sidenav type based on window size.
  useEffect(() => {
    getData();
    // A function that sets the disabled state of the buttons for the sidenav type.
    function handleDisabled() {
      return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
    }

    // The event listener that's calling the handleDisabled function when resizing the window.
    window.addEventListener("resize", handleDisabled);

    // Call the handleDisabled function to set the state with the initial value.
    handleDisabled();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleDisabled);
  }, []);

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);

  const options = {
    method: "GET",
    url: "settings",
    headers: {
      "content-type": "application/json",
    },
  };

  const getData = async () => {
    setIsLoading(true);
    options.method = "GET";
    options.url = `settings`;
    await client
      .request(options)
      .then((response) => {
        localStorage.setItem("settings", JSON.stringify(response));
        setFirst(response.set_first);
        setLast(response.set_last);
        setApiKey(response.set_msApiKey);
        setSetId(response.set_id);
        setUserId(response.set_user_id);
        setCompanyCountry(response.set_country);
        setCompanyState(response.set_state);
        setCompanyCity(response.set_city);
        setCompanyAddress(response.set_address);
        setSelectedTimezone(response.set_timezone);
        setPhone(response.set_phone);
        setCompanyZip(response.set_zip);
        setSelectedTimezone(response.set_timezone);
        setRunning(response.set_running);
        setIsLoading(false);
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });
  };

  const handleSave = async () => {
    setIsLoading(true);
    options.method = "PUT";
    options.url = `settings`;
    options.data = JSON.stringify({
      set_id: setId,
      set_user_id: userId,
      set_running: running,
      set_first: first,
      set_last: last,
      set_country: companyCountry,
      set_state: companyState,
      set_city: companyCity,
      set_address: companyAddress,
      set_zip: companyZip,
      set_timezone: selectedTimezone,
      set_msApiKey: apiKey,
      set_phone: phone,
    });
    console.log(options.data);
    await client
      .request(options)
      .then(() => {
        setIsLoading(false);
        setOpenAlert(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={4}
        pb={0.5}
        px={3}
      >
        <MDBox>
          <MDTypography variant="h5">Settings</MDTypography>
        </MDBox>

        <Icon
          sx={({ typography: { size }, palette: { dark, white } }) => ({
            fontSize: `${size.lg} !important`,
            color: darkMode ? white.main : dark.main,
            stroke: "currentColor",
            strokeWidth: "2px",
            cursor: "pointer",
            transform: "translateY(5px)",
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </MDBox>

      <Divider />
      {localStorage.getItem("account") && (
        <>
          <MDTypography variant="h6" fontWeight="medium" px={3}>
            API key:
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium" px={3} color="text">
            {JSON.parse(localStorage.getItem("account")).user_apiKey}
          </MDTypography>
        </>
      )}
      <Divider />

      <MDInput
        type={"text"}
        label="First Name"
        value={first}
        onChange={(e) => setFirst(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <MDInput
        type={"text"}
        label="Last Name"
        value={last}
        onChange={(e) => setLast(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <MDInput
        type={"text"}
        label="City"
        value={companyCity}
        onChange={(e) => setCompanyCity(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <MDInput
        type={"text"}
        label="State"
        value={companyState}
        onChange={(e) => setCompanyState(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <MDInput
        type={"text"}
        label="Country"
        value={companyCountry}
        onChange={(e) => setCompanyCountry(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <MDInput
        type={"text"}
        label="Address"
        value={companyAddress}
        onChange={(e) => setCompanyAddress(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <MDInput
        type={"text"}
        label="Zip"
        value={companyZip}
        onChange={(e) => setCompanyZip(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <MDInput
        type={"text"}
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <MDInput
        readOnly
        type={"text"}
        label="SendPad API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        fullWidth
        style={{ marginBottom: 20 }}
      />
      <TimezoneSelect value={selectedTimezone} onChange={(e) => setSelectedTimezone(e.value)} />
      <MDButton
        onClick={handleSave}
        color="success"
        variant="gradient"
        style={{ marginTop: 20 }}
        disabled={isLoading}
      >
        Save
        {isLoading && <CircularProgress></CircularProgress>}
      </MDButton>
    </ConfiguratorRoot>
  );
}

export default Configurator;
