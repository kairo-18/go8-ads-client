import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Res1 from './components/Res1/Res1';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCRUD from './pages/AdminCRUD';
import CreateScreen from './pages/CRUD/CreateScreen';
import UpdateScreen from './pages/CRUD/UpdateScreen';
import Res2 from './components/Res2/Res2';
import Res3 from './components/Res3/Res3';
import axios from 'axios';
import CreateAnnouncement from './components/Announcement/CreateAnnouncement';
import axiosInstance from './axios/axiosInstance';


function App() {
  const [count, setCount] = useState(0)
  const [screens, setScreens] = useState([])

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/screens");
  
        setScreens((prevScreens) => {
          const newScreens = response.data;
  
          // Only update state if the data has changed
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
  }, []); // Dependency array ensures it only runs once
  

  
  
  return (
    <Router>
      <Routes>
      {screens.map((screen) => (
        <Route
          key={screen.id} // Ensure a unique key
          path={screen.routeName}
          element={
            screen.layoutType === "Res1" ? <Res1 screenId={screen.id}/> :
            screen.layoutType === "Res2" ? <Res2 screenId={screen.id}/> :
            screen.layoutType === "Res3" ? <Res3 screenId={screen.id}/> :
            <Navigate to="/" />
          }
        />
      ))}
        <Route path="/admin" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/crud" element={<AdminCRUD/>}/>
        <Route path="/admin/crud/create" element={<CreateScreen/>}/>
        <Route path="/admin/crud/update" element={<UpdateScreen/>}/>
        <Route path="/admin/crud/createAnnouncement" element={<CreateAnnouncement/>}/>
      </Routes>
    </Router>

  )
}

export default App
