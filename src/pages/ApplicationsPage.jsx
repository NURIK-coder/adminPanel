import ApplicationsList from "../components/admin/ApplicationsList";
import AdminLayout from "../components/AdminLayout";

export default function ApplicationsPage(){
    return(
        <AdminLayout>
            <ApplicationsList/>
        </AdminLayout>
    )
}