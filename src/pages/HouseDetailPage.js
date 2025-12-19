import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, CircularProgress, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HouseActions from "../components/houses/HouseActions";

const HouseDetailPage = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [landlordName, setLandlordName] = useState("");

  useEffect(() => {
    const fetchHouse = async () => {
      
      const houseRef = doc(db, "houses", houseId);
      const houseSnap = await getDoc(houseRef);

      if (!houseSnap.exists()) {
        setLoading(false);
        return;
      }

      const houseData = { id: houseSnap.id, ...houseSnap.data() };
      setHouse(houseData);

      setLoading(false);
    };

    fetchHouse();
  }, [houseId]);

  useEffect(() => {
    const fetchLandlord = async () => {
      if (!house?.landlordId) return;
  
      const snap = await getDoc(
        doc(db, "users", house.landlordId)
      );
  
      if (snap.exists()) {
        setLandlordName(snap.data().name);
      }
    };
  
    fetchLandlord();
  }, [house]);


  if (loading) return <CircularProgress />;
  if (!house) return <Typography>House not found</Typography>;

  return (
    <Box sx={{ maxWidth: 800 }}>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/houses")}
            sx={{ mb: 2 }}
        >
            Back to Houses
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
            House Details
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
            {house.name}
            </Typography>
            <Typography>Address: {house.address}</Typography>
            <Typography>Landlord: {landlordName}</Typography>
        </Paper>
        <HouseActions houseId={house.id} variant="full" />
    </Box>
  );
};

export default HouseDetailPage;
