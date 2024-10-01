import { ListItemText, MenuItem } from "@material-ui/core";
import { Select } from "@mui/material";
import MDSnackbar from "components/MDSnackbar";
import { useState } from "react";

/* eslint-disable */
export default function MSPersonalizationTags(props) {
  const [tags, setTags] = useState("Short codes");
  const [openAlert, setOpenAlert] = useState(false);
  const [personalizationTags] = useState([
    { variable: "[email]", description: "Subscriber email" },
    { variable: "[phone]", description: "Subscriber phone" },
    { variable: "[first]", description: "Subscriber first name" },
    { variable: "[last]", description: "Subscriber last name" },
    { variable: "[city]", description: "Subscriber city" },
    { variable: "[state]", description: "Subscriber state" },
    { variable: "[country]", description: "Subscriber country" },
  ]);

  const handleChangeTags = (event) => {
    setTags(event.target.value);
    if (event.target.value != "Short codes") {
      navigator.clipboard.writeText(event.target.value);
      setOpenAlert(true);
    }
  };

  return (
    <>
      <MDSnackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        color="success"
        icon="check_outlined"
        title={`${
          tags != "Short codes"
            ? personalizationTags.filter((tag) => tag.variable == tags)[0].description
            : ""
        } successfully copied`}
        content="You can now paste this to your email."
        dateTime=""
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        close={() => setOpenAlert(false)}
      />
      <Select placeholder="Short codes" value={tags} onChange={(e) => handleChangeTags(e)}>
        <MenuItem key="Short codes" value="Short codes">
          <ListItemText primary="Short codes" />
        </MenuItem>
        {personalizationTags.map((tag) => (
          <MenuItem key={tag.variable} value={tag.variable}>
            <ListItemText primary={tag.description} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
