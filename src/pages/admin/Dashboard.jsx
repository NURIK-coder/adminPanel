import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://tanlov.medsfera.uz/api/stats/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  const topAppType = data.application_types.reduce((a, b) =>
    a.count > b.count ? a : b
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#f7f9fc] p-6">
      <div className="bg-white shadow-lg rounded-xl px-6 py-4 text-center mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Platforma statistikasi</h1>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Umumiy talabalar" value={data.students.total} />
        <StatCard title="GPA: 4+" value={data.gpa_distribution["4+"]} />
        <StatCard title="Test o‘rtacha" value={data.application_items.avg_test_result} />
        <StatCard title="Eng ko‘p ariza turi" value={topAppType.application_type__name} blue />
      </div>

      {/* Charts & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Jins bo‘yicha taqsimot">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.students.by_gender}
                dataKey="count"
                nameKey="gender"
                cx="50%" cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.students.by_gender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Kurs bo‘yicha taqsimot">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.students.by_level}>
              <XAxis dataKey="level__name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="GPA oralig‘i bo‘yicha taqsimot">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={Object.entries(data.gpa_distribution).map(([range, count]) => ({ range, count }))}
            >
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        

        <div className="col-span-full">
          <Card title="Fakultet bo‘yicha taqsimot">
            <div className="w-full h-[700px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.students.by_faculty.filter(f => f.faculty__name !== null)}
                  layout="vertical"
                  margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
                  
                >
                  <XAxis type="number" />
                  <YAxis
                    dataKey="faculty__name"
                    type="category"
                    width={450}
                    
                    tick={{ fontSize: 15 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div className="flex justify-center flex-row gap-5 col-span-full ">
            <Card title="Arizalar turlari bo‘yicha statistikasi">
            <ul className="space-y-2 px-10 py-3 w-[500px]">
              {data.application_types.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-white rounded-md px-3 py-2 shadow hover:shadow-md transition"
                >
                  <span className="text-sm">{item.application_type__name}</span>
                  <span className="text-blue-600 font-bold">{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Ariza topshirish uchun ro'yxatdan o'tgan talabalar soni">
            <ul className="space-y-2 w-[500px] px-10 py-3">
              {data.students.by_university.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-white rounded-md px-3 py-2 shadow hover:shadow-md transition"
                >
                  <span className="text-sm">{item.university}</span>
                  <span className="text-blue-600 font-bold">{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        
      </div>
    </div>
  );
}


function StatCard({ title, value, blue = false }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center hover:shadow-md transition transform hover:-translate-y-2">
      <div className="text-sm text-gray-600 font-medium">{title}</div>
      <div className={`text-xl font-bold ${blue ? "text-blue-600" : "text-gray-800"}`}>{value}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-2">
      <h3 className="text-base font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}