import React, { useEffect, useState }from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Typography, Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TenantActions from "../tenants/TenantActions";
import AddIcon from "@mui/icons-material/Add";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const TenantsTable = ({ tenants }) => {
    const navigate = useNavigate();
    const [landlordNames, setLandlordNames] = useState("");

    const handleRowClick = (tenantId) => {
        navigate(`/dashboard/tenants/${tenantId}`);
    };

    useEffect(() => {
        const fetchLandlordNames = async () => {
          const names = {};
          for (const tenant of tenants) {
            if (tenant.landlordId) {
              const snap = await getDoc(doc(db, "users", tenant.landlordId));
              names[tenant.id] = snap.exists() ? snap.data().name : "Unknown";
            } else {
              names[tenant.id] = "Unknown";
            }
          }
          setLandlordNames(names);
        };
        fetchLandlordNames();
      }, [tenants]);
    

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
                    Tenant List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/dashboard/tenants/new")}
                    >
                    Add tenant
                </Button>
            </Box> 
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Landlord</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {tenants.map((tenant) => (
                        <TableRow 
                            key={tenant.id}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleRowClick(tenant.id)}
                        >
                            <TableCell>{tenant.name}</TableCell>
                            <TableCell>{tenant.email}</TableCell>
                            <TableCell>{landlordNames[tenant.id] || "Unknown"}</TableCell>
                            <TableCell>{tenant.type}</TableCell>
                            <TableCell></TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <TenantActions tenantId={tenant.id} variant="icon" />
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TenantsTable;