import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import TenantForm from "../components/tenants/TenantForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function TenantEditPage() {
    const { tenantId } = useParams();
    const navigate = useNavigate();
    const [tenant, setTenant] = React.useState(null);
  
    useEffect(() => {
      const fetchTenant = async () => {
        const snap = await getDoc(doc(db, "tenants", tenantId));
        setTenant({ id: snap.id, ...snap.data() });
      };
      fetchTenant();
    }, [tenantId]);
  
    if (!tenant) return <p>Loading...</p>;
  
    const handleUpdate = async (data) => {
      await updateDoc(doc(db, "tenants", tenantId), data);
      navigate(`/dashboard/tenants/${tenantId}`);
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/dashboard/tenants/${tenantId}`)}
            sx={{ mb: 2 }}
        >
            Back to Tenant Details
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Edit Tenant    
        </Typography>
        <TenantForm
          initialValues={tenant}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
        />
      </>
    );
  }

export default TenantEditPage;