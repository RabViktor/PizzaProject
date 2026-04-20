import { Navigate, replace } from "react-router-dom";

export function AdminProtectedRoute({children}) {
    const admin = JSON.parse(localStorage.getItem("admin") || "null");

    
    if(!admin){
        return <Navigate to={"/admin-panel"} replace/>
    }

    if(Date.now() > admin.expiresAt){
        localStorage.removeItem("admin");
        return <Navigate to={"/admin-panel"} replace/>
    }

    return children;
}