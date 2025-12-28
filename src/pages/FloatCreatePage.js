import React from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import FloatForm from "../components/floats/FloatForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function FloatCreatePage() {
    const navigate = useNavigate();
  
    const handleCreate = async (data) => {
      await addDoc(collection(db, "floats"), {
        ...data,
        balance: 0,
        deleted: false,
        landlordId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
  
      navigate("/dashboard/floats");
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/floats")}
            sx={{ mb: 2 }}
        >
            Back to Floats
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Create Float       
        </Typography>
        <FloatForm
          initialValues={{
            category: "",
            remarks: "",
            houseId: ""
          }}
          submitLabel="Create"
          onSubmit={handleCreate}
        />
      </>
    );
  }
  
  export default FloatCreatePage;