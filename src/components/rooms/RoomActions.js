import React from "react";
import { Button, Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function RoomActions({ roomId, variant = "full" }) {
  const isIconMode = variant === "icon";
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/dashboard/rooms/${roomId}/edit`);
  };

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this room?");
    if (!ok) return;

    try {
        await updateDoc(doc(db, "rooms", roomId), {
        deleted: true,
      });
      alert("Room has been deleted.");
      navigate("/dashboard/rooms");
    } catch (e) {
      console.error(e);
      alert("Failed to delete the room.");
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

export default RoomActions;
