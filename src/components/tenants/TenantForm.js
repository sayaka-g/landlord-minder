import React from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";

function TenantForm({
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
        label="Tenant name"
        name="name"
        value={values.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Type"
        name="type"
        value={values.type}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="tenant">Tenant</MenuItem>
        <MenuItem value="guest">Guest</MenuItem>
      </TextField>

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

export default TenantForm;
