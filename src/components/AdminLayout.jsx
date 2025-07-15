// AdminLayout.jsx

import AdminSidebar from "../pages/admin/AdminSideBar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}
