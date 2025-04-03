import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginSection from './feacture/Login/presentation/UI/LoginSection'
import CuyoDashboard from './feacture/Equipamet/presentation/UL/CuyoDashboard'
import RegisterSection from './feacture/Login/presentation/UI/Register'
import AdminPanel from './feacture/Admin/presentation/UL/AdminPanel';
import VideoMascota from './feacture/Equipamet/presentation/UL/videoMascota';


function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
     <div>
     <Router>
            <Routes>
                <Route path="/login" element={<LoginSection />} />

                <Route path="/main" element={<CuyoDashboard />} />
                <Route path="/register" element={<RegisterSection />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/monitoreo" element={<VideoMascota/>} />
                <Route path="/" element={<LoginSection />} />
            </Routes>
        </Router>
     </div> 
    </>
  )
}

export default App
