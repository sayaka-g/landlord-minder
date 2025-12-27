import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import StaysTable from "../components/stays/StaysTable";
import {
    Typography
} from "@mui/material";

const StaysPage = () => {
    const [stays, setStays] = useState([]);
    const [loading, setLoading] = useState(true);
      
    useEffect(() => {
      const fetchData = async () => {
        try {
          const roomsSnapshot = await getDocs(collection(db, "rooms"));
          const roomsMap = {};
          roomsSnapshot.docs.forEach(doc => {
            roomsMap[doc.id] = doc.data().name;
          });
  
          const tenantsSnapshot = await getDocs(collection(db, "tenants"));
          const tenantsMap = {};
          tenantsSnapshot.docs.forEach(doc => {
            tenantsMap[doc.id] = doc.data().name;
          });
  
          const staysSnapshot = await getDocs(
            query(
              collection(db, "stays"),
              where("deleted", "==", false)
            )
          );
          const staysData = staysSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              roomName: roomsMap[data.roomId] || "Unknown Room",
              tenantName: tenantsMap[data.tenantId] || "Unknown Tenant",
            };
          });
  
          setStays(staysData);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) return <p>Loading...</p>;
  
    return <StaysTable stays={stays} />;
  };
  
  export default StaysPage;