import { useEffect, useState } from "react";
import { getGpaLeaders } from "../store/applications/applicationActions";
import { store } from "../store/store";
import { useSelector } from "react-redux";
import { Pagination } from "./pogintion";

export default function GpaLeaders() {
  const itemsPerPage = 20;

  const { results = [], count = 0 } = useSelector(
    (s) => s.applicationsInfo.gpa_leaders || {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [university1, setUniversity1] = useState("");
  const [level, setLevel] = useState("");
  const [faculty, setFaculty] = useState("");
  

  useEffect(() => {
    store.dispatch(getGpaLeaders(university1, level, faculty, currentPage));
  }, [currentPage, university1, level, faculty]);

  const totalPages = Math.ceil(count / itemsPerPage);
  const currentData = results;

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  const getRowBg = (index) => {
    if (index === 0) return "bg-yellow-100";
    if (index === 1) return "bg-gray-200";
    if (index === 2) return "bg-orange-100";
    return "";
  };

  return (
    <div className="min-w-screen-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🎓 GPA Leaderboard</h2>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-6 justify-end">
        <select
          value={university1}
          onChange={(e) => {
            setUniversity1(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Barcha universitetlar</option>
          <option value="university_a">University A</option>
          <option value="university_b">University B</option>
          {/* Добавь свои опции */}
        </select>

        <select
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Barcha darajalar</option>
          <option value="bachelor">Bakalavr</option>
          <option value="master">Magistr</option>
        </select>

        <select
          value={faculty}
          onChange={(e) => {
            setFaculty(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Barcha fakultetlar</option>
          <option value="engineering">Engineering</option>
          <option value="economics">Economics</option>
          {/* Добавь свои опции */}
        </select>
      </div>

      <div className="bg-white shadow-md  rounded-lg overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Talaba</th>
              <th className="py-3 px-4">GPA</th>
              <th className="py-3 px-4">Universitet</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentData?.map((student, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              const medal = getMedal(globalIndex);
              const rowBg = getRowBg(globalIndex);
              return (
                <tr
                  key={student.id}
                  className={`border-t hover:bg-gray-50 transition-all ${rowBg}`}
                >
                  <td className="py-2 px-4">
                    {medal ? `${medal}` : globalIndex + 1}
                  </td>
                  <td className="py-2 px-4 flex justify-center items-center gap-2">
                    <img
                      src={student.image}
                      alt={student.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-center w-[200px]">
                      {student.full_name}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-semibold">
                    {student.gpa_records?.[0]?.gpa || "0.00"}
                  </td>
                  <td className="py-2 px-4">{student.university}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <Pagination 
      totalPages={totalPages}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}/>
    </div>
  );
}
