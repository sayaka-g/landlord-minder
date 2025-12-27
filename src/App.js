import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage"; 
import ProtectedRoute from "./components/ProtectedRoute";
import RoomsPage from "./pages/RoomsPage"; 
import RoomDetailPage from "./pages/RoomDetailPage";
import RoomCreatePage from "./pages/RoomCreatePage";
import RoomEditPage from "./pages/RoomEditPage";
import HousesPage from "./pages/HousesPage";
import HouseDetailPage from "./pages/HouseDetailPage";
import HouseCreatePage from "./pages/HouseCreatePage";
import HouseEditPage from "./pages/HouseEditPage";
import TenantsPage from "./pages/TenantsPage";
import TenantDetailPage from "./pages/TenantDetailPage";
import TenantCreatePage from "./pages/TenantCreatePage";
import TenantEditPage from "./pages/TenantEditPage";
import StaysPage from "./pages/StaysPage";
import StayDetailPage from "./pages/StayDetailPage";
import StayCreatePage from "./pages/StayCreatePage";
import StayEditPage from "./pages/StayEditPage";

function App() {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="en-gb"
    >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="houses">
                <Route index element={<HousesPage />} />
                <Route path=":houseId" element={<HouseDetailPage />} />
                <Route path="new" element={<HouseCreatePage />} />
                <Route path=":houseId/edit" element={<HouseEditPage />} />
              </Route>
              <Route path="rooms">
                <Route index element={<RoomsPage />} />
                <Route path=":roomId" element={<RoomDetailPage />} />
                <Route path="new" element={<RoomCreatePage />} />
                <Route path=":roomId/edit" element={<RoomEditPage />} />
              </Route>
              <Route path="tenants">
                <Route index element={<TenantsPage />} />
                <Route path=":tenantId" element={<TenantDetailPage />} />
                <Route path="new" element={<TenantCreatePage />} />
                <Route path=":tenantId/edit" element={<TenantEditPage />} />
              </Route>
              <Route path="stays">
                <Route index element={<StaysPage />} />
                <Route path=":stayId" element={<StayDetailPage />} />
                <Route path="new" element={<StayCreatePage />} />
                <Route path=":stayId/edit" element={<StayEditPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
