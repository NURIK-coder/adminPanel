import { useState } from "react"
import { store } from "../store/store"
import { userLogin } from "../store/user/auth"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        setError("") // очистить старую ошибку

        if (!username || !password) {
            setError("Iltimos, login va parolni to'ldiring.")
            return
        }

        const userData = {
            username: username,
            password: password
        }
        localStorage.setItem('username', userData.username)
        localStorage.setItem('password', userData.password)

        try {
            const result = await store.dispatch(userLogin(userData))

            // если успешно — редирект
            if (result && result.access) {
                navigate('/admin/profile')
            }
        } catch (err) {
            const message =
                err?.non_field_errors?.[0] ||
                err?.detail ||
                "Login yoki serverda xatolik yuz berdi"
            setError(message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Toshkent davlat tibbiyot akademiyasi
                    </h2>
                </div>

                <div  className="space-y-4 text-left">
                    {error && (
                        <div className="text-red-600 text-sm font-medium bg-red-100 px-3 py-2 rounded">
                            ❗ {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Login / Kodim ID
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Login / Kodim ID"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">
                            Parol
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Parol"
                            className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-[38px] right-3 text-gray-500 hover:text-gray-700"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                    </div>

                    <button
                        
                        onClick={handleLogin}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Kirish
                    </button>
                </div>
            </div>
        </div>
    )
}
