import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import StayForm from "../components/stays/StayForm";

function StayCreatePage() {
  const navigate = useNavigate();

  const [houses, setHouses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);

  const [values, setValues] = useState({
    houseId: "",
    roomId: "",
    tenantId: "",
    startDate: null,
    endDate: null,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHouses = async () => {
      const snap = await getDocs(
        query(
          collection(db, "houses"),
          where("landlordId", "==", auth.currentUser.uid),
          where("deleted", "==", false)
        )
      );
      setHouses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchHouses();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const snap = await getDocs(
        query(
          collection(db, "rooms"),
          where("deleted", "==", false)
        )
      );
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchRooms();
  }, [values.houseId]);

  useEffect(() => {
    const fetchTenants = async () => {
      const snap = await getDocs(
        query(
          collection(db, "tenants"),
          where("landlordId", "==", auth.currentUser.uid),
          where("deleted", "==", false)
        )
      );
      setTenants(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchTenants();
  }, []);

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "houseId" ? { roomId: "" } : {}),
    }));
  };

  const handleSubmit = async (values) => {
    const { houseId, roomId, tenantId, startDate, endDate } = values;

    if (!houseId || !roomId || !tenantId || !startDate || !endDate) {
      alert("Please fill in all fields");
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "stays"), {
        houseId,
        roomId,
        tenantId,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        deleted: false,
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard/stays");
    } catch (e) {
      console.error(e);
      alert("Failed to create stay");
    } finally {
      setSaving(false);
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="en-gb"
    >
      <Box sx={{ maxWidth: 500 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Add Stay
        </Typography>

        <StayForm
          houses={houses}
          rooms={rooms}
          tenants={tenants}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Save"
          disabled={saving}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default StayCreatePage;