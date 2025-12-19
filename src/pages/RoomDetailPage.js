import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, CircularProgress, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RoomActions from "../components/rooms/RoomActions";

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [landlordName, setLandlordName] = useState("");

  useEffect(() => {
    const fetchRoomAndHouse = async () => {
      
      const roomRef = doc(db, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        setLoading(false);
        return;
      }

      const roomData = { id: roomSnap.id, ...roomSnap.data() };
      setRoom(roomData);

      const houseRef = doc(db, "houses", roomData.houseId);
      const houseSnap = await getDoc(houseRef);

      if (houseSnap.exists()) {
        const houseData = { id: houseSnap.id, ...houseSnap.data() };
        setHouse(houseData);

        if (houseData.landlordId) {
          const userSnap = await getDoc(doc(db, "users", houseData.landlordId));
          if (userSnap.exists()) {
            setLandlordName(userSnap.data().name);
          }
        }
      }

      setLoading(false);
    };

    fetchRoomAndHouse();
  }, [roomId]);


  if (loading) return <CircularProgress />;
  if (!room) return <Typography>Room not found</Typography>;

  const formatRent = (rent, currency, frequency) => {
    const amount = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(rent);
  
    const freqLabel = {
      monthly: "/ month",
      weekly: "/ week",
      daily: "/ day",
    }[frequency] || "";
  
    return `${amount} ${freqLabel}`;
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/rooms")}
            sx={{ mb: 2 }}
        >
            Back to Rooms
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
            Room Details
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
            {room.name}
            </Typography>
            <Typography>Floor: {room.floor}</Typography>
            <Typography>
              Rent: {formatRent(room.rent, room.rentCurrency, room.rentFrequency)}
            </Typography>
        </Paper>

        {house && (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                    House Information
                </Typography>
                <Typography>Name: {house.name}</Typography>
                <Typography>Address: {house.address}</Typography>
                <Typography>Landlord: {landlordName}</Typography>
            </Paper>
        )}

        <RoomActions roomId={room.id} variant="full" />
    </Box>
  );
};

export default RoomDetailPage;
