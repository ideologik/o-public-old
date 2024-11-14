import client from "services/ApiClient";
import rgba from "assets/theme/functions/rgba";
import React, { useEffect } from "react";
export const FeatureFlags = React.createContext({});

/*eslint-disable*/
export function FeatureFlagsProvider({ children }) {
  const [features, setFeatures] = React.useState({
    isGooglePayEnabled: false,
    plName: "sendpad", //sendpad
    hiddenMenus: ["catalogs", "series", "blogs", "automation", "sales"],
    colorBackground: "#E1EBF7", // color de fondo
    colorPrimary: "#1B59D6", // color azul oscuro del botón "REGISTER NOW"
    colorPrimaryFocus: "#153A91", // azul oscuro en el texto de "ACTION STEP #1"
    colorPrimaryGradient: "#2851A3", // azul gradiente en la sección del encabezado
    colorPrimaryGradientState: "#3B71B1", // azul gradiente más claro
  });

  /*SENDPAD*/
  switch (process.env.REACT_APP_PLNAME) {
    case "funnelsense":
      features.plName = "funnelsense";
      features.hiddenMenus = [];
      features.colorBackground = rgba("#337AB0", 0.1);
      features.colorPrimary = "#337AB0";
      features.colorPrimaryFocus = "#337AB0";
      features.colorPrimaryGradient = "#337AB0";
      features.colorPrimaryGradientState = "#3352B0";
      break;
  }

  const getFeatures = () => {
    const options = {
      method: "GET",
      url: "users/getFeatures",
    };
    client.request(options).then((response) => {
      if (response != undefined) setFeatures(response);
    });
  };

  /*
  React.useEffect(() => {
    getFeatures;
  }, []);
  */

  return <FeatureFlags.Provider value={{ features }}>{children}</FeatureFlags.Provider>;
}

export const useFeatureFlags = () => React.useContext(FeatureFlags);
