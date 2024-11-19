// productAtom.js
import { atom } from "jotai";

// Átomo para el producto general
export const productAtom = atom(null);

// Átomo para productos seleccionados de diferentes plataformas
export const bsSelectedProductAtom = atom(null); // Producto seleccionado en BS
export const bsSelectedCategoryAtom = atom({
  categoryId: null, // ID de la categoría principal
  subCategoryId: null, // ID de la subcategoría
  thirdLevelCategoryId: null, // ID de la categoría de tercer nivel
}); // Categoría seleccionada en BS
export const aliexpressSelectedProductAtom = atom(null); // Producto seleccionado en AliExpress
