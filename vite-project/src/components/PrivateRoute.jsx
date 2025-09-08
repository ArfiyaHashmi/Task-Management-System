// components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user } = authContext;

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized</div>; // Or a dedicated unauthorized page
  }

  return children;
};

export default PrivateRoute;