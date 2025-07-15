import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../store/store";
import { LeaderList } from "../store/applications/applicationActions";

export default function LeaderTable() {
  const leaders = useSelector((state) => state.applicationsInfo.leaders || []);
  const [searchName, setSearchName] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");

  useEffect(() => {
    store.dispatch(LeaderList());
  }, []);

  if (!leaders.length)
    return <p className="text-center text-gray-500 py-10">Yuklanmoqda...</p>;

  const sortedLeaders = [...leaders].sort(
    (a, b) => b.total_score - a.total_score
  );

  const faculties = Array.from(new Set(leaders.map((l) => l.faculty))).filter(Boolean);
  const courses = Array.from(new Set(leaders.map((l) => l.course))).filter(Boolean);

  const filteredLeaders = sortedLeaders.filter((leader) => {
    const matchName = leader.full_name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchFaculty =
      selectedFaculty === "all" || leader.faculty === selectedFaculty;
    const matchCourse =
      selectedCourse === "all" || leader.course === selectedCourse;
    return matchName && matchFaculty && matchCourse;
  });

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🏆 Umumiy ball bo‘yicha liderlar
      </h1>

      {/* --- ФИЛЬТРЫ --- */}
      <div className="flex  flex-row justify-end items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Ism bo‘yicha qidirish"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="px-4 py-2 rounded border w-full sm:w-64"
        />

        <select
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          className="px-4 py-2 rounded border w-full sm:w-64"
        >
          <option value="all">Barcha fakultetlar</option>
          {faculties.map((f, i) => (
            <option key={i} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-4 py-2 rounded border w-full sm:w-64"
        >
          <option value="all">Barcha kurslar</option>
          {courses.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-center text-sm font-semibold text-gray-600"
          style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Talaba</th>
              <th className="px-6 py-3">Fakultet</th>
              <th className="px-6 py-3">Kurs / Guruh</th>
              <th className="px-6 py-3 text-right">Ball</th>
            </tr>
          </thead>

          {/* --- СКРОЛЛИРУЕМЫЙ TBODY --- */}
          <tbody
            className="divide-y divide-gray-100"
            style={{
              display: "block",
              maxHeight: "700px",
              overflowY: "auto",
            }}
          >
            {filteredLeaders.map((leader, index) => {
              const medal = getMedal(index);
              const isTopThree = index < 3;

              return (
                <tr
                  key={leader.full_name}
                  className={`transition-all ${
                    isTopThree ? "bg-yellow-50 font-semibold" : ""
                  }`}
                  style={{ display: "table", tableLayout: "fixed", width: "100%" }}
                >
                  <td className="px-6 py-4 text-center align-middle text-lg">
                    {medal || index + 1}
                  </td>
                  <td className="px-6 py-4 align-middle text-gray-800">
                    {leader.full_name}
                  </td>
                  <td className="px-6 py-4 align-middle">{leader.faculty}</td>
                  <td className="px-6 py-4 align-middle">
                    {leader.course} / {leader.group}
                  </td>
                  <td className="px-6 py-4 align-middle text-right font-bold text-blue-600">
                    {leader.total_score}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
