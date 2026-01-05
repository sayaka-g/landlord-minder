import React, { useEffect, useState }from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Button, Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BillActions from "./BillActions";
import AddIcon from "@mui/icons-material/Add";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";

const BillsTable = ({ bills }) => {
    const navigate = useNavigate();

    const handleRowClick = (billId) => {
        navigate(`/dashboard/bills/${billId}`);
    };

    const TRANSACTION_TYPE_CONFIG = {
        payment: {
            label: "Payment",
            color: "error",
        },
        income: {
            label: "Income",
            color: "primary",
        },
        invoice: {
            label: "Invoice",
            color: "warning",
        },
    };

    const formatAmount = (amount, currency) => {
        const formattedAmount  = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        }).format(amount);
    
        return `${formattedAmount}`;
    };

    const TransactionTypeChip = ({ type }) => {
        const config = TRANSACTION_TYPE_CONFIG[type];

        if (!config) {
            return <Chip label={type} size="small" />;
        }

        return (
            <Chip
                label={config.label}
                color={config.color}
                size="small"
                variant="outlined"
            />
        );
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
                    Bill List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/dashboard/bills/new")}
                    >
                    Add Bill
                </Button>
            </Box> 
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Sub category</TableCell>
                        <TableCell>House</TableCell>
                        <TableCell>Float</TableCell>
                        <TableCell>Transaction type</TableCell>
                        <TableCell>Billing month</TableCell>
                        <TableCell>Transaction date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {bills.map((bill) => (
                        <TableRow 
                            key={bill.id}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleRowClick(bill.id)}
                        >
                            <TableCell>{bill.category}</TableCell>
                            <TableCell>{bill.subCategory}</TableCell>
                            <TableCell>{bill.houseName}</TableCell>
                            <TableCell>{bill.floatCategory}</TableCell>
                            <TableCell>
                                <TransactionTypeChip type={bill.transactionType} />
                            </TableCell>
                            <TableCell>{bill.billingMonth ? dayjs(bill.billingMonth).format("MMMM YYYY") : ""}</TableCell>
                            <TableCell>{bill.transactionDate?.toDate().toLocaleDateString("en-GB")}</TableCell>
                            <TableCell>{formatAmount(bill.amount, bill.currency)}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <BillActions billId={bill.id} variant="icon" />
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BillsTable;