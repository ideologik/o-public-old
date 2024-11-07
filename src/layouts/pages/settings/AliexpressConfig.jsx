import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { CreateAuth } from "services/aliexpressService";
import MDAlert from "components/MDAlert"; // Asegúrate de importar MDAlert correctamente

function AliexpressConfig() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const ok = params.get("ok");

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    const handleCreateAuth = async () => {
      if (ok === null) {
        try {
          const response = await CreateAuth();
          if (response) {
            // Redirect to the URL provided in the response
            window.location.href = response;
          }
        } catch (err) {
          console.error("Error creating AliExpress authentication:", err);
          setMessage("Error connecting to AliExpress.");
          setMessageType("error");
        }
      }
    };

    handleCreateAuth();
  }, [ok]);

  // Show alerts based on the query parameter
  useEffect(() => {
    if (ok === "false") {
      setMessage("Failed to connect to AliExpress.");
      setMessageType("error");
    } else if (ok === "true") {
      setMessage("Successfully connected to AliExpress.");
      setMessageType("success");
    }
  }, [ok]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {message && (
        <MDAlert color={messageType} dismissible>
          {message}
        </MDAlert>
      )}
    </DashboardLayout>
  );
}

export default AliexpressConfig;