import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, CircularProgress, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TenantActions from "../components/tenants/TenantActions";

const TenantDetailPage = () => {
  const { tenantId } = useParams();
    const navigate = useNavigate();
  
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [landlordName, setLandlordName] = useState("");
  
    useEffect(() => {
      const fetchTenant = async () => {
        
        const tenantRef = doc(db, "tenants", tenantId);
        const tenantSnap = await getDoc(tenantRef);
  
        if (!tenantSnap.exists()) {
          setLoading(false);
          return;
        }
  
        const tenantData = { id: tenantSnap.id, ...tenantSnap.data() };
        setTenant(tenantData);
  
        setLoading(false);
      };
  
      fetchTenant();
    }, [tenantId]);
  
    useEffect(() => {
      const fetchLandlord = async () => {
        if (!tenant?.landlordId) return;
    
        const snap = await getDoc(
          doc(db, "users", tenant.landlordId)
        );
    
        if (snap.exists()) {
          setLandlordName(snap.data().name);
        }
      };
    
      fetchLandlord();
    }, [tenant]);

  if (loading) return <CircularProgress />;
  if (!tenant) return <Typography>Tenant not found</Typography>;

  return (
    <Box sx={{ maxWidth: 800 }}>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/tenants")}
            sx={{ mb: 2 }}
        >
            Back to Tenants
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
            Tenant Details
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
                {tenant.name}
            </Typography>
            <Typography>Email: {tenant.email}</Typography>
            <Typography>
              Landlord: {landlordName}
            </Typography>
            <Typography>Type: {tenant.type}</Typography>
        </Paper>
        <TenantActions tenantId={tenant.id} variant="full" />
    </Box>
  );
};

export default TenantDetailPage;
