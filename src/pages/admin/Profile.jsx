import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { store } from "../../store/store"
import { CurrentUser } from "../../store/user/userActions"
import AdminSidebar from "./AdminSideBar"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const user = useSelector(u => u.userInfo.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  useEffect(() => {
        async function checkUser() {
            try {
                await store.dispatch(CurrentUser());
                setLoading(false)
            } catch (err) {
                // Здесь будет ошибка из throw { detail: data }
                navigate('/admin/login');
            }
        }

        checkUser();
    }, [navigate]);



  // Защита: если данные ещё не загружены
  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  return (
    
    <div className="max-w-6xl mx-auto p-6  space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow flex items-center gap-6 relative">
        <img
          src={user.avatar ? user.avatar :'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
          alt="avatar"
          className="w-20 h-20 rounded-full border-2 border-green-500"
        />
        <div>
          
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.full_name || '—'}</h2>
          <p className="text-gray-500 capitalize">{user.role}</p>
          <p className="text-gray-400 text-sm">{user.university1}</p>
        </div>
        <select className="p-3 bg-blue-600 text-white rounded absolute right-5">
            <option
              defaultValue={user.value}
              value={user.role}
              className="text-black bg-white"
            >
              {user.role}
            </option>
            <option value="admin" className="text-black bg-white">
              Admin
            </option>
            <option value="kichik_admin" className="text-black bg-white">
              Kichik admin
            </option>
            <option value="dekan" className="text-black bg-white">
              Dekan
            </option>
        </select>

      </div>

      {/* Shaxsiy ma'lumotlar */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Shaxsiy ma'lumotlar</h3>
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
            Tahrirlash
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="p-3 rounded shadow hover:shadow-md  ">
            <p className="text-sm text-gray-500">Foydalanuvchi nomi</p>
            <p className="font-medium">@{user.username}</p>
          </div>
          <div className="p-3 rounded shadow hover:shadow-md  ">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email || "—"}</p>
          </div>
          <div className="p-3 rounded shadow hover:shadow-md  ">
            <p className="text-sm text-gray-500">Faollik</p>
            <p className="font-medium">{user.is_active ? "Faol" : "Faol emas"}</p>
          </div>
          <div className="p-3 rounded shadow hover:shadow-md  ">
            <p className="text-sm font-bold text-gray-700 ">Ball qo'yishi mumkinmi</p>
            <p className="font-medium" > <span className="font-bold" style={user.can_score ? {color:'green'} : {color: 'red'}}>{user.can_score ? "Ha" : "Yo'q"}</span></p>
          </div>
          <div className="p-3 rounded shadow hover:shadow-md  ">
            <p className="text-sm text-gray-500">Barcha talabalar ruxsat etilganmi?</p>
            <p className="font-medium">{user.allow_all_students ? "Ha" : "Yo'q"}</p>
          </div>
          <div className="p-3 rounded shadow hover:shadow-md  ">
            <p className="text-sm text-gray-500">Kurs bo‘yicha cheklov</p>
            <p className="font-medium">{user.limit_by_course ? "Ha" : "Yo'q"}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-center flex-wrap">
        {/* Fakultetlar */}
        <div className="bg-white p-6 rounded-lg shadow transform hover:-translate-y-2 transition hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎓 Fakultetlar</h3>
            {user.faculties?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
                {user.faculties.map((f, i) => (
                <li key={i}>{f}</li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-500">Fakultet biriktirilmagan</p>
            )}
        </div>

        {/* Yo‘nalishlar */}
        <div className="bg-white p-6 rounded-lg shadow hover:-translate-y-2 transition hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2  ">📚 Yo‘nalishlar</h3>
            {user.directions?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 text-left">
                {user.directions.map((d, i) => (
                <li key={i}>{d}</li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-500">Yo‘nalishlar mavjud emas</p>
            )}
        </div>

        {/* Bosqichlar */}
        <div className="bg-white p-6 rounded-lg shadow hover:-translate-y-2 transition hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📌 Bosqichlar</h3>
            {user.levels?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
                {user.levels.map((l, i) => (
                <li key={i}>{l}</li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-500">Bosqichlar biriktirilmagan</p>
            )}
        </div>

        {/* Bo‘limlar */}
        <div className="bg-white p-6 rounded-lg shadow hover:-translate-y-2 transition hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📖 Bo‘limlar</h3>
            {user.sections?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
                {user.sections.map((s, i) => (
                <li key={i}>{s}</li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-500">Bo‘limlar mavjud emas</p>
            )}
        </div>
      </div>
      
    </div>
  )
}
