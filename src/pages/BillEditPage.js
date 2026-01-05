import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, getDocs, Timestamp, runTransaction } from "firebase/firestore";
import { db } from "../firebase";
import BillForm from "../components/bills/BillForm";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";

function BillEditPage() {
    const { billId } = useParams();
    const navigate = useNavigate();

    const [bill, setBill] = React.useState(null);
    const [values, setValues] = useState({
        category: "",
        subCategory: "",
        remarks: "",
        houseId: "",
        floatId: "",
        transactionType: "",
        transactionDate: null,
        billingMonth: null,
        amount: 0,
        currency: "",
    });
    const [categories, setCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);

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
      const fetchBill = async () => {
        const snap = await getDoc(doc(db, "bills", billId));
        setBill({ id: snap.id, ...snap.data() });
      };
      fetchBill();
    }, [billId]);

    useEffect(() => {
        if (!bill || !bill.category) {
            setFilteredSubCategories([]);
            return;
        }

        const subs = [
            ...new Set(
            categories
                .filter(c => c.category === bill.category)
                .map(c => c.subCategory)
                .filter(Boolean)
            )
        ];

        setFilteredSubCategories(subs);
    }, [bill, categories]);

    useEffect(() => {
        if (!bill) return;

        setValues({
            ...bill,
            transactionDate: bill.transactionDate
            ? dayjs(
                bill.transactionDate.toDate
                    ? bill.transactionDate.toDate()
                    : bill.transactionDate
                )
            : null,

            billingMonth: bill.billingMonth
            ? dayjs(
                bill.billingMonth.toDate
                    ? bill.billingMonth.toDate()
                    : bill.billingMonth
                )
            : null,
        });
    }, [bill]);
  
    if (!bill || !values) return <p>Loading...</p>;

    const handleChange = (field, value) => {
        setValues(prev => ({
            ...prev,
            [field]: value,
            ...(field === "transactionType" && value !== "invoice"
            ? { billingMonth: null }
            : {}),
        }));
    };
  
    

    const handleUpdate = async (data, billId, navigate) => {
        const billRef = doc(db, "bills", billId);

        await runTransaction(db, async (transaction) => {

            const billSnap = await transaction.get(billRef);
            if (!billSnap.exists()) throw new Error("Bill not found");

            const oldBill = billSnap.data();

            const oldAmount = Number(oldBill.amount) || 0;
            const newAmount = Number(data.amount) || 0;

            const oldType = oldBill.transactionType;
            const newType = data.transactionType;

            const oldFloatId = oldBill.floatId;
            const newFloatId = data.floatId;

            if (!oldFloatId || !newFloatId) {
                throw new Error(
                    `FloatId missing. oldFloatId=${oldFloatId}, newFloatId=${newFloatId}`
                );
            }

            const needBalanceUpdate =
            oldAmount !== newAmount ||
            oldType !== newType ||
            oldFloatId !== newFloatId;

            if (!needBalanceUpdate) {
                transaction.update(billRef, {
                    ...data,
                    amount: newAmount,
                    transactionDate: data.transactionDate
                    ? Timestamp.fromDate(data.transactionDate.toDate())
                    : null,
                    billingMonth: data.billingMonth
                    ? Timestamp.fromDate(data.billingMonth.toDate())
                    : null,
                    updatedAt: Timestamp.now(),
                });
                return;
            }

            const oldFloatRef = doc(db, "floats", oldFloatId);
            const newFloatRef = doc(db, "floats", newFloatId);

            const oldFloatSnap = await transaction.get(oldFloatRef);
            if (!oldFloatSnap.exists()) throw new Error("Old float not found");

            let newFloatSnap;
            if (oldFloatId === newFloatId) {
                newFloatSnap = oldFloatSnap;
            } else {
                newFloatSnap = await transaction.get(newFloatRef);
                if (!newFloatSnap.exists()) throw new Error("New float not found");
            }

            const oldEffect = calcEffect(oldAmount, oldType);
            const newEffect = calcEffect(newAmount, newType);

            if (oldFloatId === newFloatId) {
                const balance = Number(oldFloatSnap.data().balance) || 0;
                const newBalance = balance - oldEffect + newEffect;

                transaction.update(oldFloatRef, { balance: newBalance });
            } else {
                const oldBalance = (Number(oldFloatSnap.data().balance) || 0) - oldEffect;
                const newBalance = (Number(newFloatSnap.data().balance) || 0) + newEffect;

                transaction.update(oldFloatRef, { balance: oldBalance });
                transaction.update(newFloatRef, { balance: newBalance });
            }

            transaction.update(billRef, {
                ...data,
                amount: newAmount,
                transactionDate: data.transactionDate
                    ? Timestamp.fromDate(data.transactionDate.toDate())
                    : null,
                billingMonth: data.billingMonth
                    ? Timestamp.fromDate(data.billingMonth.toDate())
                    : null,
                updatedAt: Timestamp.now(),
            });
        });

        navigate(`/dashboard/bills/${billId}`);
    };

    const handleUpdateSubmit = async (data) => {
        try {
            await handleUpdate(data, billId, navigate);
        } catch (error) {
            console.error("Failed to update bill:", error);
        }
    };

    const calcEffect = (amount, type) => {
        if (type === "payment") return -amount;
        if (type === "income") return +amount;
        return 0;
    };
  
    return (
      <>
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/dashboard/bills/${billId}`)}
            sx={{ mb: 2 }}
        >
            Back to Bill Details
        </Button>
        <Typography variant="h4" sx={{ mb: 2 }}>
                Edit Bill    
        </Typography>
        <BillForm
            values={values}
            categories={categories}
            subCategories={filteredSubCategories}
            onChange={handleChange}
            submitLabel="Save changes"
            onSubmit={handleUpdateSubmit}
        />
      </>
    );
  }

export default BillEditPage;