import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import RoomsTable from "../components/rooms/RoomsTable";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [housesMap, setHousesMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
    
        const housesSnapshot = await getDocs(
          query(collection(db, "houses"), 
          where("landlordId", "==", auth.currentUser.uid),
          where("deleted", "==", false)
        )
        );

        const houses = housesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const map = {};
        houses.forEach(house => {
            map[house.id] = house.name;
        });
        setHousesMap(map);

        const roomsQuery = query(collection(db, "rooms"), where("deleted", "==", false), where("houseId", "in", houses.map(h => h.id)));
        const roomsSnapshot = await getDocs(roomsQuery);
        const roomsData = roomsSnapshot.docs.map(doc => {
        const room = doc.data();
        return {
          id: doc.id,
          ...room,
          houseName: map[room.houseId] || "Unknown"
        };
      });

      setRooms(roomsData);
    };

    fetchData();
  }, []);

  return <RoomsTable rooms={rooms} />;
};

export default RoomsPage;