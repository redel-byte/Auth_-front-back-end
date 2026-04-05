import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
    const isAuth = !!localStorage.getItem('token');
    
    if (isAuth) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

export default PublicRoutes;