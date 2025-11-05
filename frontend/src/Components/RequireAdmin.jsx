import React from 'react';
import { useAuth } from '../Context/UserContext';
import { Navigate } from 'react-router';

export default function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user ) return <Navigate to="/admin/login" replace />;
  return children;
}
