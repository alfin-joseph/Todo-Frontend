// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import ProtectedRoute from './protectedRoute';
import HomePage from './components/HomePage';
import "bootstrap/dist/css/bootstrap.min.css";
// import { isLoggedIn } from './authService';

const App = () => {
  const [accessToken,setAccessToken] = useState(null)
  const [loggedin,setLoggedin] = useState(false)

  const refreshtoken = localStorage.getItem("refreshToken")
  
  const refreshToken = async () => {
    try {
      const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: refreshtoken,
      });

      const newAccessToken = refreshResponse.data.access;

      localStorage.setItem("token",newAccessToken )
      
      setLoggedin(true)

      // Store the new access token in local storage
      localStorage.setItem("accessToken", newAccessToken);
    } catch (error) {
      console.error("Token refresh error:", error);
      // Handle token refresh failure (e.g., redirect to login page)
    }
  };
  useEffect(()=>{
    refreshToken()
  },[])
    return (
      <div>{
        loggedin ? <HomePage/>  :<LoginComponent/>
        }
        
      </div>
        // <Router>
        //     <Routes>
        //         <Route path="/login" component={LoginComponent} />
        //         <ProtectedRoute path="/dashboard" element={<HomePage />} />

        //     </Routes>
        // </Router>
    );
};

export default App;

