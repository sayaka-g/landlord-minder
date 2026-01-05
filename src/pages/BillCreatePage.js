import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp, getDocs, Timestamp, getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import BillForm from "../components/bills/BillForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function BillCreatePage() {
    const navigate = useNavigate();
  
    const [values, setValues] = useState({
        category: "",
        subCategory: "",
        remarks: "",
        houseId: "",
        floatId: "",
        transactionDate: null,
        transactionType: "",
        billingMonth: null,
        amount: 0,
        currency: ""
    });

    const [categories, setCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
        const snap = await getDocs(
            collection(db, "bills")
        );

        const list = snap.docs.map(d => d.data());
        setCategories(list);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!values.category) {
        setFilteredSubCategories([]);
        return;
        }

        const subs = [
        ...new Set(
            categories
            .filter(c => c.category === values.category)
            .map(c => c.subCategory)
        )];

        setFilteredSubCategories(subs);
    }, [values.category, categories]);

    const handleChange = (field, value) => {
        setValues(prev => ({
            ...prev,
            [field]: value,
            ...(field === "transactionType" && value !== "invoice"
            ? { billingMonth: null }
            : {}),
        }));
    };

    const handleCreate = async (data) => {
        await addDoc(collection(db, "bills"), {
            ...values,
            transactionDate: data.transactionDate
                ? Timestamp.fromDate(data.transactionDate.toDate())
                : null,
            billingMonth:
                data.transactionType === "invoice" && data.billingMonth
                    ? data.billingMonth.format("YYYY-MM")
                    : null,
            deleted: false,
            landlordId: auth.currentUser.uid,
            createdAt: serverTimestamp(),
        });
 
        const floatRef = doc(db, "floats", data.floatId);
        const floatSnap = await getDoc(floatRef);

        if (floatSnap.exists()) {
            const floatData = floatSnap.data();
            let newBalance = floatData.balance || 0;
            console.log("original balance:", floatData.balance);
            if (data.transactionType === "payment") {
                newBalance -= parseFloat(data.amount);
            } else if (data.transactionType === "income") {
                newBalance += parseFloat(data.amount);
            }

            await updateDoc(floatRef, {
                balance: newBalance,
            });
        }
  
        navigate("/dashboard/bills");
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/bills")}
            sx={{ mb: 2 }}
        >
            Back to Bills
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Create Bill       
        </Typography>
        <BillForm
            values={values}
            categories={categories}
            subCategories={filteredSubCategories}
            onChange={handleChange}
            onSubmit={handleCreate}
            submitLabel="Create"
        />
      </>
    );
}
  
export default BillCreatePage;