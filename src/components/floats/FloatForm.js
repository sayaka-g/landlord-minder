import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";

function FloatForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
}) {
  const [values, setValues] = React.useState(initialValues);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      const q = query(
        collection(db, "houses"),
        where("landlordId", "==", user.uid)
      );
  
      const snap = await getDocs(q);
  
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
  
      setHouses(list);
    };
  
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Box component="form" sx={{ maxWidth: 400 }}>     
      <TextField
        label="Category"
        name="category"
        value={values.category}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Remarks"
        name="remarks"
        value={values.remarks}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="House"
        name="houseId"
        value={values.houseId}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {houses.map((house) => (
            <MenuItem key={house.id} value={house.id}>
                {house.name}
            </MenuItem>
        ))}
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

export default FloatForm;
