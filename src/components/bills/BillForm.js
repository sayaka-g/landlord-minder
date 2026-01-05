import React, { useEffect, useState } from "react";
import { Autocomplete, Box, TextField, Button, MenuItem } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function BillForm({
  values,
  categories,
  subCategories,
  onChange,
  onSubmit,
  submitLabel = "Save",
}) {

  const [houses, setHouses] = useState([]);
  const [floats, setFloats] = useState([]);

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

  useEffect(() => {
    const fetchFloats = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      const q = query(
        collection(db, "floats"),
        where("landlordId", "==", user.uid)
      );
  
      const snap = await getDocs(q);
  
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
  
      setFloats(list);
    };
  
    fetchFloats();
  }, []);

  return (
    <Box component="form" 
        sx={{ 
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}
    >   
        
        <Autocomplete
            freeSolo
            options={[...new Set(categories.map(c => c.category).filter(Boolean))]}
            value={values.category || ""}
            onChange={(e, v) => onChange("category", v || "")}
            onInputChange={(e, v) => onChange("category", v || "")}
            renderInput={(params) => <TextField {...params} label="Category" fullWidth />}
        />

        <Autocomplete
            freeSolo
            options={[...new Set(
                categories
                .filter(c => c.category === values.category)
                .map(c => c.subCategory)
                .filter(Boolean)
            )]}
            value={values.subCategory || ""}
            onChange={(e, v) => onChange("subCategory", v || "")}
            onInputChange={(e, v) => onChange("subCategory", v || "")}
            disabled={!values.category}
            renderInput={(params) => (
                <TextField {...params} label="Sub Category" fullWidth />
            )}
        />

        <TextField
            label="Remarks"
            name="remarks"
            value={values.remarks}
            onChange={(e) => onChange("remarks", e.target.value)}
            fullWidth
        />

        <TextField
            select
            label="House"
            name="houseId"
            value={values.houseId}
            onChange={(e) => onChange("houseId", e.target.value)}
            fullWidth
        >
            {houses.map((house) => (
                <MenuItem key={house.id} value={house.id}>
                    {house.name}
                </MenuItem>
            ))}
        </TextField>

        <TextField
            select
            label="Float"
            name="floatId"
            value={values.floatId}
            onChange={(e) => onChange("floatId", e.target.value)}
            fullWidth
        >
            {floats.map((float) => (
                <MenuItem key={float.id} value={float.id}>
                    {float.category}
                </MenuItem>
            ))}
        </TextField>

        <DatePicker
            label="Transaction date"
            value={values.transactionDate ? dayjs(values.transactionDate) : null}
            onChange={(newValue) => onChange("transactionDate", newValue)}
            format="DD/MM/YYYY"
        />

        <TextField
            select
            label="Transaction type"
            name="transactionType"
            value={values.transactionType}
            onChange={(e) => onChange("transactionType", e.target.value)}
            fullWidth
        >
            <MenuItem value="payment">payment</MenuItem>
            <MenuItem value="income">income</MenuItem>
            <MenuItem value="invoice">invoice</MenuItem>
        </TextField>

        {values.transactionType === "invoice" && (
            <DatePicker
                views={["year", "month"]}
                label="Billing month"
                value={values.billingMonth ?? null}
                onChange={(v) => onChange("billingMonth", v)}
                format="MMMM YYYY"
            />
        )}

        <TextField
            label="Amount"
            name="amount"
            type="number"
            value={values.amount}
            onChange={(e) => onChange("amount", e.target.value)}
            fullWidth
        />

        <TextField
            select
            label="Currency"
            name="currency"
            type="currency"
            value={values.currency}
            onChange={(e) => onChange("currency", e.target.value)}
            fullWidth
        >
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
        </TextField>

        <Button
            type="submit"
            variant="contained"
            sx={{
                mt: 1,
                alignSelf: "flex-start",
            }}
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

export default BillForm;
