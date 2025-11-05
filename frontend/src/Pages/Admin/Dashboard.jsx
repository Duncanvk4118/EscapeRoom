import { useEffect } from "react";
import { useAuth } from "../../Context/UserContext";
import AdminLayout from "../../Components/AdminLayout";
import { Link, useNavigate } from "react-router";

export const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to admin login when there's no token or token expired
        if (!user) {
            navigate('/admin/login');
        }
    }, [navigate]);

    return (
        <AdminLayout>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800 border border-gray-700 text-gray-100">Escape rooms<br/><Link to="/admin/escape-rooms" className="text-indigo-400">Manage</Link></div>
                    <div className="p-4 bg-gray-800 border border-gray-700 text-gray-100">Questions<br/><Link to="/admin/questions" className="text-indigo-400">Manage</Link></div>
                    <div className="p-4 bg-gray-800 border border-gray-700 text-gray-100">Sessions<br/><Link to="/admin/sessions" className="text-indigo-400">Manage</Link></div>
                </div>
            </AdminLayout>
    );
};
