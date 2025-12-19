import React, { useEffect, useState }from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HouseActions from "../houses/HouseActions";
import AddIcon from "@mui/icons-material/Add";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const HousesTable = ({ houses }) => {
    const navigate = useNavigate();
    const [landlordNames, setLandlordNames] = useState("");

    const handleRowClick = (houseId) => {
        navigate(`/dashboard/houses/${houseId}`);
    };

    useEffect(() => {
        const fetchLandlordNames = async () => {
          const names = {};
          for (const house of houses) {
            if (house.landlordId) {
              const snap = await getDoc(doc(db, "users", house.landlordId));
              names[house.id] = snap.exists() ? snap.data().name : "Unknown";
            } else {
              names[house.id] = "Unknown";
            }
          }
          setLandlordNames(names);
        };
        fetchLandlordNames();
      }, [houses]);
    

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    House List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/dashboard/houses/new")}
                    >
                    Add House
                </Button>
            </Box> 
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Landlord</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {houses.map((house) => (
                        <TableRow 
                            key={house.id}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleRowClick(house.id)}
                        >
                            <TableCell>{house.name}</TableCell>
                            <TableCell>{house.address}</TableCell>
                            <TableCell>{landlordNames[house.id] || "Loading..."}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <HouseActions houseId={house.id} variant="icon" />
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default HousesTable;