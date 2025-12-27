import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import StayForm from "../components/stays/StayForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";

function StayEditPage() {
  const { stayId } = useParams();
  const navigate = useNavigate();
  const [stay, setStay] = useState(null);
  const [values, setValues] = useState(null);
  const [houses, setHouses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);

  // Fetch stay
  useEffect(() => {
    const fetchStay = async () => {
      const snap = await getDoc(doc(db, "stays", stayId));
      if (!snap.exists()) return;
      setStay({ id: snap.id, ...snap.data() });
    };
    fetchStay();
  }, [stayId]);

  // Fetch houses
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

  // Fetch tenants
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

  // Initialize values after stay, houses, tenants are ready
  useEffect(() => {
    if (!stay || houses.length === 0 || tenants.length === 0) return;

    setValues({
      houseId: stay.houseId || "",
      roomId: "",
      tenantId: stay.tenantId || "",
      startDate: stay.startDate ? dayjs(stay.startDate.toDate()) : null,
      endDate: stay.endDate ? dayjs(stay.endDate.toDate()) : null,
    });
  }, [stay, houses, tenants]);

  // Fetch rooms after houseId is set
  useEffect(() => {
    if (!values?.houseId) return;

    const fetchRooms = async () => {
      const snap = await getDocs(
        query(
          collection(db, "rooms"),
          where("houseId", "==", values.houseId),
          where("deleted", "==", false)
        )
      );
      const roomList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRooms(roomList);

      if (stay?.roomId && roomList.find(r => r.id === stay.roomId)) {
        setValues(prev => ({ ...prev, roomId: stay.roomId }));
      }
    };
    fetchRooms();
  }, [values?.houseId, stay?.roomId]);

  if (!stay || !values || houses.length === 0 || tenants.length === 0) {
    return <p>Loading...</p>;
  }

  const handleChange = (field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
      ...(field === "houseId" ? { roomId: "" } : {}),
    }));
  };

  const handleUpdate = async (data) => {
    await updateDoc(doc(db, "stays", stayId), {
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
    });
    navigate(`/dashboard/stays/${stayId}`);
  };

  return (
    <>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/dashboard/stays/${stayId}`)}
        sx={{ mb: 2 }}
      >
        Back to Stay Details
      </Button>

      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Stay
      </Typography>

      <StayForm
        values={values}
        houses={houses}
        rooms={rooms}
        tenants={tenants}
        onChange={handleChange}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
      />
    </>
  );
}

export default StayEditPage;