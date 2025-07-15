import { Routes, Route, BrowserRouter } from "react-router-dom"
import Error from "../pages/Eror";
import TestPage from "../pages/Test";
import TestDetail from "../pages/TestDetail";
import Login from "../pages/Login";
import ApplicationsPage from "../pages/ApplicationsPage";
import ProfilePage from "../pages/ProfilePage";
import DashboardPage from "../pages/DashboardPage";
import ScreenSizeGuard from "./ScreenSize";
import LeaderTablePage from "../pages/LeaderTablePage";

function Layout(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/testsList/" element={<TestPage />} />
                <Route path="/test/:id" element={<TestDetail />} />
                <Route path="/admin/login" element={<Login />} />

                {/* ✅ Admin routes под защитой */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ScreenSizeGuard>
                            <DashboardPage />
                        </ScreenSizeGuard>
                    }
                />
                <Route
                    path="/admin/profile"
                    element={
                        <ScreenSizeGuard>
                            <ProfilePage />
                        </ScreenSizeGuard>
                    }
                />
                <Route
                    path="/admin/applications"
                    element={
                        <ScreenSizeGuard>
                            <ApplicationsPage />
                        </ScreenSizeGuard>
                    }
                />
                <Route
                    path="/admin/leader/table"
                    element={
                        <ScreenSizeGuard>
                            <LeaderTablePage />
                        </ScreenSizeGuard>
                    }
                />
                
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Layout;
