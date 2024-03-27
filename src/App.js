// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import ProtectedRoute from './protectedRoute';
import HomePage from './components/HomePage';
import { isLoggedIn } from './authService';

const App = () => {
    return (
      <div>{
        isLoggedIn ? <HomePage/>  :<LoginComponent/>
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

