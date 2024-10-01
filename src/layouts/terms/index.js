import MDBox from "components/MDBox";
import { useState } from "react";

/* eslint-disable */
export default function Terms() {
  const [addGroup, setAddGroup] = useState(0);
  return (
    <MDBox pb={3} pt={2}>
      {" "}
      terms and services{" "}
    </MDBox>
  );
}
