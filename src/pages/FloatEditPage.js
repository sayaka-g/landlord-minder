import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import FloatForm from "../components/floats/FloatForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function FloatEditPage() {
    const { floatId } = useParams();
    const navigate = useNavigate();
    const [float, setFloat] = React.useState(null);
  
    useEffect(() => {
      const fetchFloat = async () => {
        const snap = await getDoc(doc(db, "floats", floatId));
        setFloat({ id: snap.id, ...snap.data() });
      };
      fetchFloat();
    }, [floatId]);
  
    if (!float) return <p>Loading...</p>;
  
    const handleUpdate = async (data) => {
      await updateDoc(doc(db, "floats", floatId), data);
      navigate(`/dashboard/floats/${floatId}`);
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/dashboard/floats/${floatId}`)}
            sx={{ mb: 2 }}
        >
            Back to Float Details
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Edit Float    
        </Typography>
        <FloatForm
          initialValues={float}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
        />
      </>
    );
  }

export default FloatEditPage;