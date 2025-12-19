import React from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import HouseForm from "../components/houses/HouseForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function HouseCreatePage() {
    const navigate = useNavigate();
  
    const handleCreate = async (data) => {
      await addDoc(collection(db, "houses"), {
        ...data,
        deleted: false,
        landlordId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
  
      navigate("/dashboard/houses");
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/houses")}
            sx={{ mb: 2 }}
        >
            Back to Houses
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Create House       
        </Typography>
        <HouseForm
          initialValues={{
            name: "",
            address: ""
          }}
          submitLabel="Create"
          onSubmit={handleCreate}
        />
      </>
    );
  }
  
  export default HouseCreatePage;