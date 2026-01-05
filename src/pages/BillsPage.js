import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import BillsTable from "../components/bills/BillsTable";

const BillsPage = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!auth.currentUser) return;

            try {
                const housesSnap = await getDocs(
                    query(
                        collection(db, "houses"),
                        where("landlordId", "==", auth.currentUser.uid),
                        where("deleted", "==", false)
                    )
                );

                const houseMap = {};
                    housesSnap.docs.forEach(doc => {
                    houseMap[doc.id] = doc.data().name;
                });

                const floatSnap = await getDocs(
                    query(
                        collection(db, "floats"),
                        where("landlordId", "==", auth.currentUser.uid),
                        where("deleted", "==", false)
                    )
                );

                const floatMap = {};
                    floatSnap.docs.forEach(doc => {
                    floatMap[doc.id] = doc.data().category;
                });

                const billsSnap = await getDocs(
                    query(
                        collection(db, "bills"),
                        where("landlordId", "==", auth.currentUser.uid),
                        where("deleted", "==", false),
                        orderBy("transactionDate", "desc")
                    )
                );

                const billsData = billsSnap.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        houseName: houseMap[data.houseId] || "Unknown",
                        floatCategory: floatMap[data.floatId] || "Unknown"
                    };
                });

                setBills(billsData);
            } catch (e) {
                console.error("Failed to fetch bills", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return <BillsTable bills={bills} />;
};

export default BillsPage;