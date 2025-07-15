import AdminLayout from "../components/AdminLayout";
import Dashboard from "./admin/Dashboard";

export default function DashboardPage(){
    return(
        <AdminLayout>
            <Dashboard/>
        </AdminLayout>
    )
}