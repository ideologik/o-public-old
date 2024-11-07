import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Checkbox,
  TextField,
} from "@mui/material";

import { useAtom } from "jotai";
import { useState } from "react";
import { bsSelectedProductAtom, aliexpressSelectedProductAtom } from "stores/productAtom";
import { ArrowUpward, ArrowDownward, HorizontalRule } from "@mui/icons-material";
import { AliExpressProductEnhancer } from "services";

// Función para el ícono de tendencia
const getTrendIcon = (current, average) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

const AliexpressDetail = () => {
  const [aliexpressSelectedProduct] = useAtom(aliexpressSelectedProductAtom);
  const [selectedProduct] = useAtom(bsSelectedProductAtom);

  // Estado para almacenar los datos de la API y selecciones
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // selección múltiple de imágenes
  const [selectedTitle, setSelectedTitle] = useState(null); // selección única de título
  const [selectedDescription, setSelectedDescription] = useState(null); // selección única de descripción
  const [editingTitleIndex, setEditingTitleIndex] = useState(null); // índice del título en edición
  const [editingDescriptionIndex, setEditingDescriptionIndex] = useState(null); // índice de descripción en edición

  // Función para obtener datos adicionales de la API
  const fetchAdditionalInfo = async () => {
    setLoading(true);
    try {
      const data = await AliExpressProductEnhancer(aliexpressSelectedProduct.product_id);
      setAdditionalInfo(data);
    } catch (error) {
      console.error("Error al obtener la información adicional:", error);
    }
    setLoading(false);
  };

  // Manejar selección de imagen
  const handleImageToggle = (index) => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Manejar selección única de título
  const handleTitleSelect = (index) => {
    setSelectedTitle(index);
  };

  // Manejar selección única de descripción
  const handleDescriptionSelect = (index) => {
    setSelectedDescription(index);
  };

  // Activar modo de edición para títulos y descripciones
  const handleTitleDoubleClick = (index) => {
    setEditingTitleIndex(index);
  };

  const handleDescriptionDoubleClick = (index) => {
    setEditingDescriptionIndex(index);
  };

  // Funciones para actualizar el contenido mientras se edita
  const handleTitleChange = (event, index) => {
    const newTitles = [...additionalInfo.productTitles];
    newTitles[index] = event.target.value;
    setAdditionalInfo((prev) => ({
      ...prev,
      productTitles: newTitles,
    }));
  };

  const handleDescriptionChange = (event, index) => {
    const newDescriptions = [...additionalInfo.productDescriptions];
    newDescriptions[index] = event.target.value;
    setAdditionalInfo((prev) => ({
      ...prev,
      productDescriptions: newDescriptions,
    }));
  };

  // Función para finalizar la edición
  const handleEditComplete = () => {
    setEditingTitleIndex(null);
    setEditingDescriptionIndex(null);
  };

  // Función para mostrar el alert al hacer clic en "Publish Product"
  const handlePublishProduct = () => {
    if (selectedImages.length > 0 && selectedTitle !== null && selectedDescription !== null) {
      const selectedTitleText = additionalInfo.productTitles[selectedTitle];
      const selectedDescriptionText = additionalInfo.productDescriptions[selectedDescription];
      const selectedImagesUrls = selectedImages.map((index) => additionalInfo.imageURLs[index]);

      alert(
        `Selected Images: ${selectedImagesUrls.join(
          ", "
        )}\nSelected Title: ${selectedTitleText}\nSelected Description: ${selectedDescriptionText}`
      );
    }
  };

  // Deshabilitar el botón si no hay al menos una imagen, un título y una descripción seleccionada
  const isPublishDisabled =
    selectedImages.length === 0 || selectedTitle === null || selectedDescription === null;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box display="flex" justifyContent="center" bgcolor="transparent" padding={4}>
        <Grid container spacing={2}>
          {/* Primera Tarjeta */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                padding: 4,
                borderRadius: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                {/* Contenedor de imagen cuadrado con sombra */}
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 1", // Hace que el contenedor sea cuadrado
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Sombra de la "tarjeta" de imagen
                    borderRadius: 2,
                    mb: 2, // Margen inferior
                  }}
                >
                  <Box
                    component="img"
                    src={aliexpressSelectedProduct.product_main_image_url || "/placeholder.jpg"}
                    alt={aliexpressSelectedProduct.product_title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", // Asegura que la imagen se vea completa sin recortes
                    }}
                  />
                </Box>
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {aliexpressSelectedProduct.product_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Category: {aliexpressSelectedProduct.second_level_category_name || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price: ${aliexpressSelectedProduct.target_sale_price || "N/A"}{" "}
                    {aliexpressSelectedProduct.target_sale_price_currency}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    DOA: $
                    {(
                      selectedProduct.bes_price - aliexpressSelectedProduct.target_sale_price
                    ).toFixed(2) || "0%"}{" "}
                    USD
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                    Potential Profit: $
                    {(
                      (selectedProduct.bes_price - aliexpressSelectedProduct.target_sale_price) *
                      selectedProduct.bes_boughtInPastMonth
                    ).toFixed(2) || "0%"}{" "}
                    USD
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Current Price Amazon: $
                    {selectedProduct.bes_price ? selectedProduct.bes_price.toFixed(2) : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Sales Rank: {selectedProduct.bes_salesrank || "N/A"}{" "}
                    {getTrendIcon(
                      selectedProduct.bes_salesrank,
                      selectedProduct.bes_salesrank90DaysAverage
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Sale Rank last 90 days: {selectedProduct.bes_salesrank90DaysAverage || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price Trend:{" "}
                    {getTrendIcon(
                      selectedProduct.bes_price,
                      selectedProduct.bes_priceBuyBox90DaysAverage
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Price Trend last 90 days:{" "}
                    {selectedProduct.bes_priceBuyBox90DaysAverage || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Competition Trend:{" "}
                    {getTrendIcon(
                      selectedProduct.bes_newOfferCount,
                      selectedProduct.bes_newOfferCount90DaysAverage
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Competition Trend last 90 days:{" "}
                    {selectedProduct.bes_newOfferCount90DaysAverage || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Bought in past month: &nbsp;
                    {selectedProduct.bes_boughtInPastMonth + "+" || "N/A"}
                  </Typography>

                  <MDButton
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={fetchAdditionalInfo}
                    sx={{
                      paddingY: 1.5,
                      marginTop: 2,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      backgroundColor: "#3A75C4",
                      "&:hover": {
                        backgroundColor: "#315d9d",
                      },
                    }}
                  >
                    Enhance Product
                  </MDButton>
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          {/* Segunda Tarjeta */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={4}
              sx={{
                padding: 4,
                borderRadius: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                height: "100%",
              }}
            >
              <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Product Information
                  </Typography>
                  {loading ? (
                    <CircularProgress />
                  ) : additionalInfo ? (
                    <>
                      <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                        Select Images:
                      </Typography>
                      <Grid container spacing={1}>
                        {additionalInfo.imageURLs.map((url, index) => (
                          <Grid item xs={2} key={index}>
                            <Card
                              sx={{
                                border: selectedImages.includes(index)
                                  ? "2px solid blue"
                                  : "1px solid gray",
                                cursor: "pointer",
                                overflow: "hidden",
                                aspectRatio: "1 / 1",
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                },
                              }}
                              onClick={() => handleImageToggle(index)}
                            >
                              <Box
                                component="img"
                                src={url}
                                alt={`Product ${index}`}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                              <Checkbox
                                checked={selectedImages.includes(index)}
                                sx={{ position: "absolute", top: 0, right: 0 }}
                              />
                            </Card>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Lista de Títulos */}
                      <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                        Select a Title:
                      </Typography>
                      <List>
                        {additionalInfo.productTitles.map((title, index) => (
                          <ListItemButton
                            key={index}
                            selected={selectedTitle === index}
                            onClick={() => handleTitleSelect(index)}
                            onDoubleClick={() => handleTitleDoubleClick(index)}
                          >
                            {editingTitleIndex === index ? (
                              <TextField
                                value={title}
                                onChange={(e) => handleTitleChange(e, index)}
                                onBlur={handleEditComplete}
                                autoFocus
                                fullWidth
                                size="small"
                              />
                            ) : (
                              <ListItemText primary={title} />
                            )}
                          </ListItemButton>
                        ))}
                      </List>

                      {/* Lista de Descripciones */}
                      <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                        Select a Description:
                      </Typography>
                      <List>
                        {additionalInfo.productDescriptions.map((desc, index) => (
                          <ListItemButton
                            key={index}
                            selected={selectedDescription === index}
                            onClick={() => handleDescriptionSelect(index)}
                            onDoubleClick={() => handleDescriptionDoubleClick(index)}
                          >
                            {editingDescriptionIndex === index ? (
                              <TextField
                                value={desc}
                                onChange={(e) => handleDescriptionChange(e, index)}
                                onBlur={handleEditComplete}
                                autoFocus
                                fullWidth
                                size="small"
                              />
                            ) : (
                              <ListItemText primary={desc} />
                            )}
                          </ListItemButton>
                        ))}
                      </List>

                      <MDButton
                        variant="contained"
                        fullWidth
                        color="primary"
                        onClick={handlePublishProduct}
                        disabled={isPublishDisabled} // Botón deshabilitado si faltan selecciones
                        sx={{
                          paddingY: 1.5,
                          marginTop: 2,
                          fontSize: "1rem",
                          fontWeight: "bold",
                          backgroundColor: isPublishDisabled ? "#c0c0c0" : "#3A75C4",
                          "&:hover": {
                            backgroundColor: isPublishDisabled ? "#c0c0c0" : "#315d9d",
                          },
                        }}
                      >
                        Publish Product
                      </MDButton>
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No additional information available. Press Enhance Product to load.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default AliexpressDetail;
