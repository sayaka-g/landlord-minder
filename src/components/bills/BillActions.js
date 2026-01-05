import React from "react";
import { Button, Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, runTransaction} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function BillActions({ billId, variant = "full" }) {
    const isIconMode = variant === "icon";
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/dashboard/bills/${billId}/edit`);
    };

    const handleDelete = async () => {
        const ok = window.confirm("Are you sure you want to delete this bill?");
        if (!ok) return;

        try {
            const billRef = doc(db, "bills", billId);

            await runTransaction(db, async (transaction) => {
                const billSnap = await transaction.get(billRef);
                if (!billSnap.exists()) throw new Error("Bill not found");

                const bill = billSnap.data();
                const floatId = bill.floatId;
                if (!floatId) throw new Error("Bill has no floatId");

                const amount = Number(bill.amount) || 0;
                const type = bill.transactionType;

                const floatRef = doc(db, "floats", floatId);
                const floatSnap = await transaction.get(floatRef);
                if (!floatSnap.exists()) throw new Error("Float not found");

                let newBalance = Number(floatSnap.data().balance) || 0;

                if (type === "payment") newBalance += amount;
                else if (type === "income") newBalance -= amount;

                transaction.update(floatRef, { balance: newBalance });

                transaction.update(billRef, { deleted: true });
            });

            alert("Bill has been deleted.");
            navigate("/dashboard/bills");
        } catch (e) {
            console.error(e);
            alert("Failed to delete the bill.");
        }
    };

    return (
        <Box 
        sx={{ 
            mt: isIconMode ? 0 : 3,
            display: "flex",
            gap: 1.5
        }}>
        {isIconMode ? (
            <>
            <Tooltip title="Edit">
                <IconButton onClick={handleEdit} size="small">
                <EditIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
                <IconButton onClick={handleDelete} color="error" size="small">
                <DeleteIcon />
                </IconButton>
            </Tooltip>
            </>
        ) : (
            <>
            <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
            >
                Edit
            </Button>

            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
            >
                Delete
            </Button>
            </>
        )}
        </Box>
    );
}

export default BillActions;
