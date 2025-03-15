import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginSection from './feacture/Login/presentation/UI/LoginSection'
import CuyoDashboard from './feacture/Equipamet/presentation/UL/CuyoDashboard'


function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
     <div>
     <Router>
            <Routes>
                <Route path="/login" element={<LoginSection />} />

                <Route path="/main" element={<CuyoDashboard />} />

                <Route path="/" element={<LoginSection />} />
            </Routes>
        </Router>
     </div> 
    </>
  )
}

export default App
