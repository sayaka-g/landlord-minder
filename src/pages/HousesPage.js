import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import HousesTable from "../components/houses/HousesTable";

const HousesPage = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      if (!auth.currentUser) return;
  
      try {
        const q = query(
          collection(db, "houses"),
          where("landlordId", "==", auth.currentUser.uid),
          where("deleted", "==", false)
        );
  
        const snapshot = await getDocs(q);
  
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setHouses(list);
      } catch (e) {
        console.error("Failed to fetch houses", e);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHouses();
  }, []);

  return <HousesTable houses={houses} />;
};

export default HousesPage;