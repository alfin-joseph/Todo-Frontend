// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './authService';

const ProtectedRoute = ({ element: Element, ...rest }) => {
    return (
        <Route
            {...rest}
            element={isLoggedIn() ? <Element /> : <Navigate to="/login" replace />}
        />
    );
};

export default ProtectedRoute;

