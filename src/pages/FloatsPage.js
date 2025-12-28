import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import FloatsTable from "../components/floats/FloatsTable";

const FloatPage = () => {
    const [floats, setFloats] = useState([]);
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

                const floatsSnap = await getDocs(
                    query(
                        collection(db, "floats"),
                        where("landlordId", "==", auth.currentUser.uid),
                        where("deleted", "==", false)
                    )
                );

                const floatsData = floatsSnap.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        houseName: houseMap[data.houseId] || "Unknown",
                    };
                });

                setFloats(floatsData);
            } catch (e) {
                console.error("Failed to fetch floats", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return <FloatsTable floats={floats} />;
};

export default FloatPage;