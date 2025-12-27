import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, CircularProgress, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StayActions from "../components/stays/StayActions";

const StayDetailPage = () => {
  const { stayId } = useParams();
  const navigate = useNavigate();

  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantName, setTenantName] = useState("");
  const [houseName, setHouseName] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const fetchStay = async () => {
      
      const StayRef = doc(db, "stays", stayId);
      const staySnap = await getDoc(StayRef);

      if (!staySnap.exists()) {
        setLoading(false);
        return;
      }

      const stayData = { id: staySnap.id, ...staySnap.data() };
      setStay(stayData);

      setLoading(false);
    };

    fetchStay();
  }, [stayId]);

    useEffect(() => {
        const fetchTenant = async () => {
          if (!stay?.tenantId) return;
      
          const snap = await getDoc(
            doc(db, "tenants", stay.tenantId)
          );
      
          if (snap.exists()) {
            setTenantName(snap.data().name);
          }
        };
      
        fetchTenant();
      }, [stay]);
    
    useEffect(() => {
        const fetchHouse = async () => {
            if (!stay?.houseId) return;
        
            const snap = await getDoc(
            doc(db, "houses", stay.houseId)
            );
        
            if (snap.exists()) {
            setHouseName(snap.data().name);
            }
        };
        
        fetchHouse();
    }, [stay]);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!stay?.roomId) return;
        
            const snap = await getDoc(
            doc(db, "rooms", stay.roomId)
            );
        
            if (snap.exists()) {
            setRoomName(snap.data().name);
            }
        };
        
        fetchRoom();
    }, [stay]);
  

  if (loading) return <CircularProgress />;
  if (!stay) return <Typography>Stay not found</Typography>;

  return (
    <Box sx={{ maxWidth: 800 }}>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/stays")}
            sx={{ mb: 2 }}
        >
            Back to Stays
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
            Stay Details
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
                {tenantName}
            </Typography>
            <Typography>House: {houseName}</Typography>
            <Typography>Room: {roomName}</Typography>
            <Typography>Start date: {stay.startDate?.toDate().toLocaleDateString("en-GB")}</Typography>
            <Typography>End date: {stay.endDate?.toDate().toLocaleDateString("en-GB")}</Typography>
        </Paper>
        <StayActions stayId={stay.id} stay={stay} variant="full" />
    </Box>
  );
};

export default StayDetailPage;
