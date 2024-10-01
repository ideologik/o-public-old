import { Grid, Icon, IconButton, InputAdornment, Tooltip } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { useEffect, useState } from "react";

/*eslint-disable*/
export default function MSMultipleSubjects(props) {
  const [subjects, setSubjects] = useState(props.subjects);

  const handleFormChange = (index, event) => {
    let data = [...subjects];
    data[index] = event.target.value;
    setSubjects(data);
  };

  const addSubject = () => {
    let newSubject = " ";
    setSubjects([...subjects, newSubject]);
  };

  const removeFields = (index) => {
    let data = [...subjects];
    data.splice(index, 1);
    setSubjects(data);
  };

  useEffect(() => {    
    if (props.subjects.length === 0) {
      setSubjects([""]);
    } else setSubjects(props.subjects);
  }, [props.subjects]);

  useEffect(() => {
    props.setSubjects(subjects);
  }, [subjects]);

  return (
    <div style={{ width: "50%" }}>
      <Grid container spacing={1}>
        {subjects.map((subject, index) => {
          return (
            <Grid item xs={11}>
              <MDInput
                key={index}
                value={subject}
                onChange={(event) => handleFormChange(index, event)}
                fullWidth
                InputProps={
                  index !== 0 && {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            removeFields(index);
                          }}
                          sx={{ fontWeight: "bold" }}
                          color="error"
                          aria-label="prompt"
                        >
                          <Tooltip id="button-report" title="Remove subject">
                            <Icon fontSize="small">delete</Icon>
                          </Tooltip>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }
              />
            </Grid>
          );
        })}
        <Grid item xs={1}>
          <MDBox justifyContent="right">
            <IconButton
              onClick={() => {
                addSubject();
              }}
              sx={{ fontWeight: "bold" }}
              color="primary"
              aria-label="prompt"
            >
              <Tooltip id="button-report" title="Add new subject">
                <Icon fontSize="small">add</Icon>
              </Tooltip>
            </IconButton>
          </MDBox>
        </Grid>
      </Grid>
    </div>
  );
}
