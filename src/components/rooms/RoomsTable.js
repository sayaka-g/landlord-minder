import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RoomActions from "../rooms/RoomActions";
import AddIcon from "@mui/icons-material/Add";

const formatRent = (rent, currency, frequency) => {
  const amount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(rent);

  const freqLabel = {
    monthly: "/ month",
    weekly: "/ week",
    daily: "/ day",
  }[frequency] || "";

  return `${amount} ${freqLabel}`;
};

const RoomsTable = ({ rooms }) => {
    const navigate = useNavigate();

    const handleRowClick = (roomId) => {
        navigate(`/dashboard/rooms/${roomId}`);
    };

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
                    Room List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/dashboard/rooms/new")}
                >
                    Add Room
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Room</TableCell>
                            <TableCell>House</TableCell>
                            <TableCell>Floor</TableCell>
                            <TableCell>Rent</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rooms.map((room) => (
                        <TableRow 
                            key={room.id}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleRowClick(room.id)}
                        >
                        <TableCell>{room.name}</TableCell>
                        <TableCell>{room.houseName}</TableCell>
                        <TableCell>{room.floor}</TableCell>
                        <TableCell>
                            {formatRent(room.rent, room.rentCurrency, room.rentFrequency)}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                            <RoomActions roomId={room.id} variant="icon" />
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default RoomsTable;