import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminPanel from "./pages/Admin/AdminPanel";
import AdminPreviews from "./pages/Admin/AdminPreviews";
import AdSettings from "./pages/Admin/AdSettings";
import Availability from "./pages/Availability";
import Announcement from "./pages/Admin/Announcement";
import CreateScreen from "./pages/CRUD/CreateScreen";
import UpdateScreen from "./pages/CRUD/UpdateScreen";
import CreateAnnouncement from "./components/Announcement/CreateAnnouncement";
import CreateAd from "./pages/Admin/CreateAd";
import axiosInstance from "./axios/axiosInstance";
import { useEffect, useState } from "react";
import Res1 from "./components/Res1/Res1";
import Res2 from "./components/Res2/Res2";
import Res3 from "./components/Res3/Res3";

// PrivateRoute component to protect admin routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin" />;
};

function App() {
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await axiosInstance.get("/api/screens");
        setScreens(response.data);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };
    fetchScreens();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Dynamic Screen Routes */}
        {screens.map((screen) => (
          <Route
            key={screen.id}
            path={screen.routeName}
            element={
              screen.layoutType === "Res1" ? <Res1 screenId={screen.id} /> :
              screen.layoutType === "Res2" ? <Res2 screenId={screen.id} /> :
              screen.layoutType === "Res3" ? <Res3 screenId={screen.id} /> :
              <Navigate to="/" />
            }
          />
        ))}

        {/* Public Route */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Routes Wrapped in AdminLayout */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AdminPanel />} />
          <Route path="previews" element={<AdminPreviews />} />
          <Route path="ad-setting" element={<AdSettings />} />
          <Route path="availability" element={<Availability />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="crud/create" element={<CreateScreen />} />
          <Route path="crud/update" element={<UpdateScreen />} />
          <Route path="crud/createAnnouncement" element={<CreateAnnouncement />} />
          <Route path="ad-setting/create-ad" element={<CreateAd />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
