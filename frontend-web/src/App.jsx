import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Page1 from "./components/Page1.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route 
          path="/" 
          element={
            <>
              <Navigation />
              <Page1 />
            </>
          } 
        />
        
        <Route path="/login" element={<Login />} />
        
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;