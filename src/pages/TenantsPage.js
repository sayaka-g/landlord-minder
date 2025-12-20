import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import TenantsTable from "../components/tenants/TenantsTable";

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      if (!auth.currentUser) return;
  
      try {
        const q = query(
          collection(db, "tenants"),
          where("landlordId", "==", auth.currentUser.uid),
          where("deleted", "==", false)
        );
  
        const snapshot = await getDocs(q);
  
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setTenants(list);
      } catch (e) {
        console.error("Failed to fetch tenants", e);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTenants();
  }, []);

  return <TenantsTable tenants={tenants} />;
};

export default TenantsPage;