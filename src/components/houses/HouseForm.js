import React from "react";
import { Box, TextField, Button } from "@mui/material";

function HouseForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
}) {
  const [values, setValues] = React.useState(initialValues);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Box component="form" sx={{ maxWidth: 400 }}>     
      <TextField
        label="House name"
        name="name"
        value={values.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Address"
        name="address"
        value={values.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3 }}
        onClick={(e) => {
          e.preventDefault();
          onSubmit(values);
        }}
      >
        {submitLabel}
      </Button>
    </Box>
  );
}

export default HouseForm;
