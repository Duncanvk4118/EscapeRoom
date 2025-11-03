import {useNavigate, Link} from "react-router";
import {useAuth} from "../../Context/UserContext";
import {useEffect} from "react";

export const Dashboard = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/admin/login");
        }
    }, []);
    return (
        <>
            <Link to={"/assignments/create"}>Maak vraag aan</Link>
        </>
    )
}
