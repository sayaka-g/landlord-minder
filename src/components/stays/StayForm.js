import { Box, TextField, Button, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function StayForm({
  values,
  houses = [],
  rooms = [],
  tenants = [],
  onChange,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}) {
  const filteredRooms = values.houseId
    ? rooms.filter((r) => r.houseId === values.houseId)
    : [];

  const roomValue  = filteredRooms.find(r => r.id === values.roomId) ? values.roomId : "";

  return (
    <Box component="form" sx={{ maxWidth: 400 }} onSubmit={(e) => { e.preventDefault(); onSubmit(values); }}>
        <TextField
            select
            label="House"
            value={values.houseId || ""}
            onChange={(e) => onChange("houseId", e.target.value)}
            fullWidth
            margin="normal"
        >
            {houses.map((house) => (
            <MenuItem key={house.id} value={house.id}>
                {house.name}
            </MenuItem>
            ))}
        </TextField>

        <TextField
            select
            label="Room"
            value={roomValue || ""}
            onChange={(e) => onChange("roomId", e.target.value)}
            fullWidth
            margin="normal"
            disabled={!values.houseId}
        >
            {filteredRooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                  {room.name}
              </MenuItem>
            ))}
        </TextField>

        <TextField
            select
            label="Tenant"
            value={values.tenantId || ""}
            onChange={(e) => onChange("tenantId", e.target.value)}
            sx={{ mb: 3, width: "100%" }}
            margin="normal"
        >
            {tenants.map((tenant) => (
              <MenuItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
              </MenuItem>
            ))}
        </TextField>

        <DatePicker
            label="Start Date"
            value={values.startDate ? dayjs(values.startDate) : null}
            onChange={(v) => onChange("startDate", v)}
            format="DD/MM/YYYY"
            sx={{ mb: 3, width: "100%" }}
        />

        <DatePicker
            label="End Date"
            value={values.endDate ? dayjs(values.endDate) : null}
            onChange={(v) => onChange("endDate", v)}
            format="DD/MM/YYYY"
            sx={{ mb: 3, width: "100%" }}
        />

        <Button type="submit" variant="contained" disabled={disabled}>
            {submitLabel}
        </Button>
    </Box>
  );
}

export default StayForm;