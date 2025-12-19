import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import HouseForm from "../components/houses/HouseForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function HouseEditPage() {
    const { houseId } = useParams();
    const navigate = useNavigate();
    const [house, setHouse] = React.useState(null);
  
    useEffect(() => {
      const fetchHouse = async () => {
        const snap = await getDoc(doc(db, "houses", houseId));
        setHouse({ id: snap.id, ...snap.data() });
      };
      fetchHouse();
    }, [houseId]);
  
    if (!house) return <p>Loading...</p>;
  
    const handleUpdate = async (data) => {
      await updateDoc(doc(db, "houses", houseId), data);
      navigate(`/dashboard/houses/${houseId}`);
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/dashboard/houses/${houseId}`)}
            sx={{ mb: 2 }}
        >
            Back to House Details
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Edit House    
        </Typography>
        <HouseForm
          initialValues={house}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
        />
      </>
    );
  }

export default HouseEditPage;