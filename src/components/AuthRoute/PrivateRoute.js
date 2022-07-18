import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const auth = localStorage.getItem('token');
    return auth ? <div>
        {children}
    </div> : <Navigate to="/login" />;
}

export default PrivateRoute
