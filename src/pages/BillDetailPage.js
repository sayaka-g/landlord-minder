import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, CircularProgress, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BillActions from "../components/bills/BillActions";
import dayjs from "dayjs";

const BillDetailPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [houseName, setHouseName] = useState("");
  const [floatName, setFloatName] = useState("");

  useEffect(() => {
    const fetchBill = async () => {
      
      const billRef = doc(db, "bills", billId);
      const billSnap = await getDoc(billRef);

      if (!billSnap.exists()) {
        setLoading(false);
        return;
      }

      const billData = { id: billSnap.id, ...billSnap.data() };
      setBill(billData);

      setLoading(false);
    };

    fetchBill();
  }, [billId]);

  useEffect(() => {
    const fetchHouse = async () => {
        if (!bill?.houseId) return;

        const houseSnap = await getDoc(doc(db, "houses", bill.houseId));
        if (houseSnap.exists()) {
        setHouseName(houseSnap.data().name);
        }
    };

    fetchHouse();
    }, [bill]);

  useEffect(() => {
    const fetchFloat = async () => {
        if (!bill?.floatId) return;

        const floatSnap = await getDoc(doc(db, "floats", bill.floatId));
        if (floatSnap.exists()) {
        setFloatName(floatSnap.data().category);
        }
    };

    fetchFloat();
    }, [bill]);

  if (loading) return <CircularProgress />;
  if (!bill) return <Typography>Bill not found</Typography>;

  const formatAmount = (amount, currency) => {
    const formattedAmount  = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  
    return `${formattedAmount}`;
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/bills")}
            sx={{ mb: 2 }}
        >
            Back to Bills
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
            Bill Details
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
            {bill.category}
            </Typography>
            <Typography>Sub category: {bill.subCategory}</Typography>
            <Typography>Remarks: {bill.remarks}</Typography>
            <Typography>Float: {floatName}</Typography>
            <Typography>House: {houseName}</Typography>
            <Typography>Transaction type: {bill.transactionType}</Typography>
            {bill.transactionType === "invoice" && bill.billingMonth && (
                <Typography>
                    Billing month: {dayjs(bill.billingMonth).format("MMMM YYYY")}
                </Typography>
            )}
            <Typography>Transaction date: {bill.transactionDate?.toDate().toLocaleDateString("en-GB")}</Typography>
            <Typography>Amount:  {formatAmount(bill.amount, bill.currency)}</Typography>
        </Paper>
        <BillActions billId={bill.id} variant="full" />
    </Box>
  );
};

export default BillDetailPage;
