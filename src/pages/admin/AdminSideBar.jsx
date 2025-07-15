import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 64 }}
      className="bg-white shadow-md h-full transition-all duration-300 overflow-hidden "
    >
      <div className="flex justify-between items-center p-4 ">
        {isOpen && <h2 className="text-lg font-bold text-blue-600">Admin Panel</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className="text-blue-600 text-xl">
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      <ul className="flex flex-col gap-2 mt-4 px-2">
        <div className="flex flex-col justify-between min-h-screen">
            <div>
              <li className="hover:bg-gray-200 p-3 rounded-xl">
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                  📊 {isOpen && "Dashboard"}
                </Link>
              </li>
              <li className="hover:bg-gray-200 p-3 rounded-xl">
                <Link to="/admin/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                  👥 {isOpen && "Profil"}
                </Link>
              </li>
              <li className="hover:bg-gray-200 p-3 rounded-xl">
                <Link to="/admin/applications" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                  📄 {isOpen && "Arizalar"}
                </Link>
              </li>
              <li className="hover:bg-gray-200 p-3 rounded-xl text-left text-[13px]">
                <Link to="/admin/leader/table" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                  🏆 {isOpen && "Ariza bahosi bo'yicha liderlar"}
                </Link>
              </li>
            </div>
            <div>
              <li className="hover:bg-gray-200 p-3 rounded-xl mt-auto text-red-500 mb-[100px]">
                <Link
                  to="/admin/login"
                  onClick={() => localStorage.removeItem("token")}
                  className="flex items-center  gap-2 hover:text-red-700"
                >
                  🚪 {isOpen && "Chiqish"}
                </Link>
              </li>
            </div>
        </div>
        
        
      </ul>
    </motion.div>
  );
}
