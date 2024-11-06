// productAtom.js
import { atom } from "jotai";

// Átomo para el producto general
export const productAtom = atom(null);

// Átomo para productos seleccionados de diferentes plataformas
export const bsSelectedProductAtom = atom(null); // Producto seleccionado en BS
export const bsSelectedCategoryAtom = atom(null); // Categoría seleccionada en BS
export const aliexpressSelectedProductAtom = atom(null); // Producto seleccionado en AliExpress
