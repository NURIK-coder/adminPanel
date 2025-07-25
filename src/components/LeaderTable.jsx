import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../store/store";
import { GetExelLeaderBoard, LeaderList } from "../store/applications/applicationActions";
import { Pagination } from "./pogintion";
import { fetchAllFiltres } from "../store/filtres/filterActions";

export default function LeaderTable() {
  const dispatch = useDispatch();
  const { results = [], count = 0 } = useSelector(
    (state) => state.applicationsInfo.leaders || {}
  );

  const itemsPerPage = 100;
  const [searchName, setSearchName] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [university, setUniversity] = useState("");
  const [toifa, setToifa] = useState("");
  
  
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const faculties = useSelector((state) => state.filterInfo.faculties.facultys || []);
  const courses = useSelector((state) => state.filterInfo.levels.levels || []);
  const universities = useSelector((state) => state.filterInfo.universities.universitys || []);
  const debounceTimeout = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState(""); 

  

  useEffect(() => {
    store.dispatch(fetchAllFiltres())
  }, [])
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchName);
    }, 500); // 500ms задержка

    return () => clearTimeout(debounceTimeout.current);
  }, [searchName]);

  useEffect(() => {
    setLoading(true);
    dispatch(
      LeaderList({
        page: currentPage,
        itemsPerPage,
        full_name: debouncedSearch,
        faculty: selectedFaculty,
        course: selectedCourse,
        university,
        toifa
      })
    ).then(() => setLoading(false));
  }, [currentPage, debouncedSearch, selectedFaculty, selectedCourse, university, toifa]);

  

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  

  const handleDownloadExcel = async () => {
        try {
          const response = await store.dispatch(GetExelLeaderBoard());
          
          if (response?.payload) {
            const url = window.URL.createObjectURL(response.payload);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "studentlar.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            setError("Excel faylni yuklab bo‘lmadi");
          }
        } catch (err) {
          setError(err.message || "Xatolik yuz berdi");
        }
    };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🏆 Umumiy ball bo‘yicha liderlar
      </h1>

      <div className="flex flex-wrap justify-end items-center gap-4 mb-6">
        <input  
          type="text"
          placeholder="Ism bo‘yicha qidirish"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded border w-[200px]"
        />

        <select
          value={university}
          onChange={(e) => {
            setUniversity(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded border w-[200px]"
        >
          <option value="">Barcha universitetlar</option>
          {universities?.map((u, i) => (
            <option key={i} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select
          value={selectedFaculty}
          onChange={(e) => {
            setSelectedFaculty(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded border w-[200px]"
        >
          <option value="">Barcha fakultetlar</option>
          {faculties?.map((f, i) => (
            <option key={i} value={f.id}>{f.name}</option>
          ))}
        </select>

        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded border w-[200px]"
        >
          <option value="">Barcha kurslar</option>
          {courses?.map((c, i) => (
            <option key={i} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={toifa}
          onChange={(e) => {
            setToifa(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded border w-[220px]"
        >
          <option value="">Barcha ijtimoiy toifalar</option>
          <option value="true">Ha</option>
          <option value="false">Yoq</option>
        </select>

        
        <button onClick={handleDownloadExcel} className="p-2 rounded-md bg-green-500 shadow-xl flex gap-2 items-center hover:bg-green-600 " >{error || "Yuklab o'lish"} <img 
        className="w-5 h-5"
        src="https://img.icons8.com/?size=100&id=83159&format=png&color=000000" alt="" /></button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg max-h-[600px] overflow-y-auto">
        

<div className="overflow-x-auto bg-white rounded-xl shadow-lg max-h-[600px] overflow-y-auto">
  {loading ? (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
    </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500 text-white text-center text-sm font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Talaba</th>
                <th className="px-6 py-3">Fakultet</th>
                <th className="px-6 py-3">Universitet</th>
                <th className="px-6 py-3">Ijtimoyi toifa reesti</th>
                <th className="px-6 py-3">Kurs / Guruh</th> 
                <th className="px-6 py-3">Ball</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((leader, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                const medal = getMedal(globalIndex);

                return (
                  <tr key={leader.id} className={globalIndex < 3 ? "bg-yellow-50 font-semibold" : ""}>
                    <td className="px-6 py-4 text-center">{medal || globalIndex + 1}</td>
                    <td className="px-6 py-4">{leader.full_name || '-'}</td>
                    <td className="px-6 py-4">{leader.faculty || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-full h-full">
                        {leader.toifa === false ? (
                          <p className="p-2 rounded-xl bg-red-500 opacity-80 shadow-md text-white w-20 h-8 flex items-center justify-center ">Yoq</p>
                        ):(
                          <p className="p-2 rounded-xl bg-green-500 opacity-80 shadow-md text-white w-20 h-8 flex items-center justify-center ">Ha</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{leader.course || '-'} / {leader.group || '-'}</td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600">
                      {leader.total_score || '0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      </div>

      <Pagination
        totalPages={Math.ceil(count / itemsPerPage)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
