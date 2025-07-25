import { useState } from "react";
import { ChangePassword } from "../store/user/userActions";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { store } from "../store/store";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Yangi parol va tasdiqlash paroli mos kelmaydi");
      return;
    }
    if (newPassword.length < 8) {
        setError("Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak");
        return;
    }

    const passwordData = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    const res = await store.dispatch(ChangePassword(passwordData));

    if (res.error) {
      setError(res.error);
      return;
    }

    alert("Parol muvaffaqiyatli o'zgartirildi!");   
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // После успешной смены
    onClose();
    window.location.reload(); 
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Parolni o‘zgartirish</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}❗
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">Joriy parol</label>
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute top-[45px] right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showOld ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">Yangi parol</label>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute top-[45px] right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showNew ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">Yangi parolni tasdiqlash</label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-[45px] right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
