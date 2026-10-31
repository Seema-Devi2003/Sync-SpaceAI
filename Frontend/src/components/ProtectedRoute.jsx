import { useAuth } from '../context/AuthContext.jsx'
import { Navigate } from 'react-router'
export function ProtectedRoute({children}){
    const{user, loading} = useAuth()
    if(loading){
        return <h1>loading....</h1>
    }
        if(!user){
            return <Navigate to="/login" />
        }
        return children
    
}