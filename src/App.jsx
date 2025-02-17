import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Res1 from './components/Res1/Res1';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCRUD from './pages/AdminCRUD';
import CreateScreen from './pages/CRUD/CreateScreen';
import UpdateScreen from './pages/CRUD/UpdateScreen';
import Res2 from './components/Res2/Res2';
import Res3 from './components/Res3/Res3';
import axiosInstance from './axios/axiosInstance';
import CreateAnnouncement from './components/Announcement/CreateAnnouncement';
import socket from './socket-config/socket'; // Import the socket instance

// PrivateRoute component to protect admin routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Or wherever the token is stored
  
  if (!token) {
    // Redirect to login page if no token found
    return <Navigate to="/admin" />;
  }
  
  return children;
};

function App() {
  const [count, setCount] = useState(0);
  const [screens, setScreens] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/screens");
        setScreens((prevScreens) => {
          const newScreens = response.data;
          if (JSON.stringify(prevScreens) !== JSON.stringify(newScreens)) {
            return newScreens;
          }
          return prevScreens;
        });
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };
    fetchScreens();
  }, []);

  // Handle WebSocket connection based on authentication status
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check if the user is authenticated
    if (token) {
      socket.connect(); // Connect to the WebSocket server
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsSocketConnected(true);
      });
      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsSocketConnected(false);
      });
    } else {
      setIsSocketConnected(false);
    }

    // Clean up WebSocket connection on logout or when the component unmounts
    return () => {
      if (isSocketConnected) {
        socket.disconnect();
      }
    };
  }, [isSocketConnected]);

  return (
    <Router>
      <Routes>
        {screens.map((screen) => (
          <Route
            key={screen.id}
            path={screen.routeName}
            element={
              screen.layoutType === "Res1" ? <Res1 screenId={screen.id}/> :
              screen.layoutType === "Res2" ? <Res2 screenId={screen.id}/> :
              screen.layoutType === "Res3" ? <Res3 screenId={screen.id}/> :
              <Navigate to="/" />
            }
          />
        ))}

        {/* Admin Routes with PrivateRoute wrapper */}
        <Route path="/admin" element={<AdminLogin />} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        
        <Route 
          path="/admin/crud" 
          element={
            <PrivateRoute>
              <AdminCRUD />
            </PrivateRoute>
          }
        />
        
        <Route 
          path="/admin/crud/create" 
          element={
            <PrivateRoute>
              <CreateScreen />
            </PrivateRoute>
          }
        />
        
        <Route 
          path="/admin/crud/update" 
          element={
            <PrivateRoute>
              <UpdateScreen />
            </PrivateRoute>
          }
        />
        
        <Route 
          path="/admin/crud/createAnnouncement" 
          element={
            <PrivateRoute>
              <CreateAnnouncement />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
