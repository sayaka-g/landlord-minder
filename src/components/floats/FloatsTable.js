import React, { useEffect, useState }from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FloatActions from "./FloatActions";
import AddIcon from "@mui/icons-material/Add";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const FloatsTable = ({ floats }) => {
    const navigate = useNavigate();

    const handleRowClick = (floatId) => {
        navigate(`/dashboard/floats/${floatId}`);
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
                    Float List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/dashboard/floats/new")}
                    >
                    Add Float
                </Button>
            </Box> 
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>House</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {floats.map((float) => (
                        <TableRow 
                            key={float.id}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleRowClick(float.id)}
                        >
                            <TableCell>{float.category}</TableCell>
                            <TableCell>{float.houseName}</TableCell>
                            <TableCell>{float.balance}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                            <FloatActions floatId={float.id} variant="icon" />
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default FloatsTable;