import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, CircularProgress, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FloatActions from "../components/floats/FloatActions";

const FloatDetailPage = () => {
  const { floatId } = useParams();
  const navigate = useNavigate();

  const [float, setFloat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [houseName, setHouseName] = useState("");

  useEffect(() => {
    const fetchFloat = async () => {
      
      const floatRef = doc(db, "floats", floatId);
      const floatSnap = await getDoc(floatRef);

      if (!floatSnap.exists()) {
        setLoading(false);
        return;
      }

      const floatData = { id: floatSnap.id, ...floatSnap.data() };
      setFloat(floatData);

      setLoading(false);
    };

    fetchFloat();
  }, [floatId]);

  useEffect(() => {
    const fetchHouse = async () => {
        if (!float?.houseId) return;

        const houseSnap = await getDoc(doc(db, "houses", float.houseId));
        if (houseSnap.exists()) {
        setHouseName(houseSnap.data().name);
        }
    };

    fetchHouse();
    }, [float]);

  if (loading) return <CircularProgress />;
  if (!float) return <Typography>Float not found</Typography>;

  return (
    <Box sx={{ maxWidth: 800 }}>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/floats")}
            sx={{ mb: 2 }}
        >
            Back to Floats
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
            Float Details
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
            {float.category}
            </Typography>
            <Typography>Remarks: {float.remarks}</Typography>
            <Typography>Balance: {float.balance}</Typography>
            <Typography>House: {houseName}</Typography>
        </Paper>
        <FloatActions floatId={float.id} variant="full" />
    </Box>
  );
};

export default FloatDetailPage;
