import client from "ApiClient";
import rgba from "assets/theme/functions/rgba";
import React from "react";

export const FeatureFlags = React.createContext({});

/*eslint-disable*/
export function FeatureFlagsProvider({ children }) {
  const [features, setFeatures] = React.useState({
    isGooglePayEnabled: false,
    plName: "sendpad", //sendpad
    hiddenMenus: ["catalogs", "series", "blogs", "automation", "sales"],
    colorBackground: "#F4F0F7",
    colorPrimary: "#735AC7",
    colorPrimaryFocus: "#735AC7",
    colorPrimaryGradient: "#735AC7",
    colorPrimaryGradientState: "#998FC7",
  });

  /*SENDPAD*/
  switch (process.env.REACT_APP_PLNAME) {   
    case "funnelsense":
      features.plName = "funnelsense";
      features.hiddenMenus = [];
      features.colorBackground = rgba("#337AB0",0.1);
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
