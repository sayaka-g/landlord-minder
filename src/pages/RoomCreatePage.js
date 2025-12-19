import React from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import RoomForm from "../components/rooms/RoomForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function RoomCreatePage() {
    const navigate = useNavigate();
  
    const handleCreate = async (data) => {
      await addDoc(collection(db, "rooms"), {
        ...data,
        deleted: false,
        createdAt: serverTimestamp(),
      });
  
      navigate("/dashboard/rooms");
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/rooms")}
            sx={{ mb: 2 }}
        >
            Back to Rooms
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Create Room        
        </Typography>
        <RoomForm
          initialValues={{
            houseId: "",
            name: "",
            rent: "",
            rentCurrency: "",
            rentFrequency: "",
            floor: "",
          }}
          submitLabel="Create"
          onSubmit={handleCreate}
        />
      </>
    );
  }
  
  export default RoomCreatePage;