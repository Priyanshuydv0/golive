import React from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';


function Protectedroute({ children }) {
    console.log("protected route")
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <><div>Loading..</div></>
        )
    }
    if (!user) {
        return <Navigate to="/login" replace />
        

    }
    return children;

}

export default Protectedroute
