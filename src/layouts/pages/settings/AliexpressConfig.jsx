import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { createAuth, statusAuth } from "services/aliexpressService";
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
      try {
        // // Primero, verifica el estado de autenticación
        // const authStatus = await statusAuth();
        // const { status } = authStatus;

        // if (status === "Connected") {
        //   // Mostrar mensaje si ya está conectado
        //   setMessage("Already connected to AliExpress.");
        //   setMessageType("success");
        // } else if (ok === null) {
        //   // Si no está conectado y ok es null, intenta crear la autenticación
        //   const response = await createAuth();
        //   if (response) {
        //     // Redirigir a la URL proporcionada en la respuesta
        //     window.location.href = response;
        //   }
        // }
        if (ok === null) {
          // Si ok es null, intenta crear la autenticación
          const response = await createAuth();
          if (response) {
            // Redirigir a la URL proporcionada en la respuesta
            window.location.href = response;
          }
        }
      } catch (err) {
        console.error("Error verifying AliExpress authentication:", err);
        setMessage("Error connecting to AliExpress.");
        setMessageType("error");
      }
    };

    handleCreateAuth();
  }, []);

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
