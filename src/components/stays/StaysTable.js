import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import StayActions from "./StayActions";

const StaysTable = ({ stays }) => {
    const navigate = useNavigate();

    const handleRowClick = (stayId) => {
        navigate(`/dashboard/stays/${stayId}`);
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
                    Stay List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/dashboard/stays/new")}
                >
                    Add Stay
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Tenant</TableCell>
                        <TableCell>Room</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {stays.map(stay => (
                        <TableRow 
                            key={stay.id}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleRowClick(stay.id)}
                        >
                        <TableCell>{stay.tenantName || stay.tenantId}</TableCell>
                        <TableCell>{stay.roomName || stay.roomId}</TableCell>
                        <TableCell>{stay.startDate?.toDate().toLocaleDateString("en-GB")}</TableCell>
                        <TableCell>{stay.endDate?.toDate().toLocaleDateString("en-GB")}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                                <StayActions stayId={stay.id} variant="icon" />
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StaysTable;