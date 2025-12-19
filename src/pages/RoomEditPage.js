import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import RoomForm from "../components/rooms/RoomForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function RoomEditPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = React.useState(null);
  
    useEffect(() => {
      const fetchRoom = async () => {
        const snap = await getDoc(doc(db, "rooms", roomId));
        setRoom({ id: snap.id, ...snap.data() });
      };
      fetchRoom();
    }, [roomId]);
  
    if (!room) return <p>Loading...</p>;
  
    const handleUpdate = async (data) => {
      await updateDoc(doc(db, "rooms", roomId), data);
      navigate(`/dashboard/rooms/${roomId}`);
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/dashboard/rooms/${roomId}`)}
            sx={{ mb: 2 }}
        >
            Back to Room Details
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Edit Room        
        </Typography>
        <RoomForm
          initialValues={room}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
        />
      </>
    );
  }

export default RoomEditPage;