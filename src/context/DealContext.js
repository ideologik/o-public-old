// DealContext.js
import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

const DealContext = createContext();

DealContext.displayName = "DealContext";

function dealReducer(state, action) {
  switch (action.type) {
    case "SET_DEAL": {
      return { ...state, deal: action.value };
    }
    case "SET_SELECTED_PRODUCT": {
      return { ...state, selectedProduct: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function DealProvider({ children }) {
  const initialState = {
    deal: null, // Estado inicial del `deal`
    selectedProduct: null, // Estado inicial del `selectedProduct`
  };

  const [state, dispatch] = useReducer(dealReducer, initialState);

  return <DealContext.Provider value={{ state, dispatch }}>{children}</DealContext.Provider>;
}

DealProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook para usar el contexto del `deal`
function useDeal() {
  const context = useContext(DealContext);
  if (!context) {
    throw new Error("useDeal debe usarse dentro de un DealProvider");
  }
  return context;
}

// Función para establecer el `deal`
const setDeal = (dispatch, deal) => dispatch({ type: "SET_DEAL", value: deal });
const setSelectedProduct = (dispatch, selectedProduct) =>
  dispatch({ type: "SET_SELECTED_PRODUCT", value: selectedProduct });

export { DealProvider, useDeal, setDeal, setSelectedProduct };
