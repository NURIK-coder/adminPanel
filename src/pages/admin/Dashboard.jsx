import { useEffect } from "react";
import { useSelector } from "react-redux";
import { store } from "../../store/store";
import { fetchAllStats } from "../../store/status/statusActions";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";

export default function Dashboard() {
  const stats = useSelector((state) => state.statsInfo.stats);
  const types = useSelector((state) => state.statsInfo.stats_applications_by_type);
  const gpa = useSelector((state) => state.statsInfo.stats_gpa);
  const gender = useSelector((state) => state.statsInfo.stats_students_by_gender);
  const university = useSelector((state) => state.statsInfo.stats_students_by_university);
  const faculties = useSelector((state) => state.statsInfo.stats_faculty_students);
  console.log("TYPES:",  types);
  
  useEffect(() => {
    store.dispatch(fetchAllStats());
  }, []);

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#A66DD4", "#FF8C42"];

  const gpaData = [
    { name: "1-2", value: gpa["1-2"] || 0 },
    { name: "2-3", value: gpa["2-3"] || 0 },
    { name: "3-4", value: gpa["3-4"] || 0 },
    { name: "4+", value: gpa["4+"] || 0 },
  ];

  if (!stats || !types || !gpa || !gender || !university || !faculties) {
    return (<p className="text-center mt-20 text-gray-500 text-lg">Yuklanmoqda...</p>)  ;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">📊 Statistika Paneli</h1>

      {/* Типы заявок */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">📂 Ariza turlari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {types?.map((type, i) => (
            <motion.div
              key={type.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 rounded-xl border shadow"
            >
              <p className="text-gray-700 font-medium">{type.name}</p>
              <p className="text-2xl font-bold text-blue-600">{type.application_count}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GPA Chart */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">📈 GPA taqsimoti</h2>
        <div className="bg-white p-6 rounded-xl shadow w-full h-96 ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gpaData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {gpaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Пол студентов */}
      <section className="mb-10 ">
        <h2 className="text-xl font-semibold mb-4">👩‍🎓 Talabalar jinsi bo‘yicha</h2>
      
          <div className="flex flex-wrap gap-4 justify-center">
            {gender.map((g, i) => (
              <motion.div
                key={g.gender}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 rounded-xl border shadow w-[48%] md:w-[30%] lg:w-[22%] min-w-[150px]"
              >
                <p className="text-gray-700">{g.gender}</p>
                <p className="text-2xl font-bold text-blue-600">{g.count}</p>
              </motion.div>
            ))}
          </div>

        
      </section>

      {/* Университеты */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🏫 Universitetlar bo‘yicha</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {university.map((u, i) => (
            <motion.div
              key={u.university}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 rounded-xl border shadow"
            >
              <p className="text-gray-700 font-medium">{u.university}</p>
              <p className="text-xl font-bold text-blue-600">{u.count}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Факультеты */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🏛️ Fakultetlar bo‘yicha</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faculties.map((f, i) => (
            <motion.div
              key={f.faculty}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 rounded-xl border shadow"
            >
              <p className="text-gray-700 font-medium">{f.faculty}</p>
              <p className="text-xl font-bold text-blue-600">{f.count}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
