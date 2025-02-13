import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Res1 from './components/Res1/Res1';
import AdminDashboard from './pages/AdminDashboard';
import AdminCRUD from './pages/AdminCRUD';
import CreateScreen from './pages/CRUD/CreateScreen';
import UpdateScreen from './pages/CRUD/UpdateScreen';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Res1 />} />
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/admin/crud" element={<AdminCRUD/>}/>
        <Route path="/admin/crud/create" element={<CreateScreen/>}/>
        <Route path="/admin/crud/update" element={<UpdateScreen/>}/>
      </Routes>
    </Router>
    
  )
}

export default App
