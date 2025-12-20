import React from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import TenantForm from "../components/tenants/TenantForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function TenantCreatePage() {
    const navigate = useNavigate();
  
    const handleCreate = async (data) => {
      await addDoc(collection(db, "tenants"), {
        ...data,
        deleted: false,
        landlordId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
  
      navigate("/dashboard/tenants");
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/tenants")}
            sx={{ mb: 2 }}
        >
            Back to Tenants
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Create Tenant       
        </Typography>
        <TenantForm
          initialValues={{
            name: "",
            email: "",
            type: ""
          }}
          submitLabel="Create"
          onSubmit={handleCreate}
        />
      </>
    );
  }
  
  export default TenantCreatePage;