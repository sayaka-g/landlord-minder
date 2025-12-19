import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";


function RoomForm({
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
        select
        label="House"
        name="houseId"
        value={values.houseId || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {houses.length === 0 && (
          <MenuItem disabled>
            Please create a house first
          </MenuItem>
        )}

        {houses.map((house) => (
          <MenuItem key={house.id} value={house.id}>
            {house.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Room name"
        name="name"
        value={values.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Rent"
        name="rent"
        type="number"
        value={values.rent}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Currency"
        name="rentCurrency"
        type="currency"
        value={values.rentCurrency}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="EUR">EUR</MenuItem>
        <MenuItem value="GBP">GBP</MenuItem>
      </TextField>

      <TextField
        select
        label="Rent frequency"
        name="rentFrequency"
        value={values.rentFrequency}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </TextField>

      <TextField
        label="Floor"
        name="floor"
        type="number"
        value={values.floor}
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

export default RoomForm;
