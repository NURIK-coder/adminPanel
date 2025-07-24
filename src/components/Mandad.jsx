import { useEffect, useState } from "react";
import { GetExel, getGpaLeaders, getMandad } from "../store/applications/applicationActions";
import { store } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "./pogintion";
import { fetchAllFiltres } from "../store/filtres/filterActions";

export default function Mandad() {
  const itemsPerPage = 100;
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const faculties = useSelector((state) => state.filterInfo.faculties.facultys || []);
  const levels = useSelector((state) => state.filterInfo.levels.levels || []);
  const university = useSelector((state) => state.filterInfo.universities.universitys || []);
  // console.log("Faculties:", faculties, "Courses:", levels, "Universities:", university);
    
  
  useEffect(() => {
    store.dispatch(fetchAllFiltres())
  }, [])


  const { results = [], count = 0 } = useSelector(
    (s) => s.applicationsInfo.gpa_leaders || {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [university1, setUniversity1] = useState("");
  const [level, setLevel] = useState("");
  const [faculty, setFaculty] = useState("");
  const [toifa, setToifa] = useState(""); 

  
  const dispatch = useDispatch();

  
  
  useEffect(() => {
    setLoading(true);
    dispatch(getMandad({
     
      page: currentPage,
    itemsPerPage,
    })).then(() => {
      setLoading(false);
    });
  }, [currentPage]);
  useEffect(() => {
  if (!loading && results.length === 0) {
    const timeout = setTimeout(() => {
      window.location.reload(); // 👈 перезагрузка через 3 секунды
    }, 2000);

    return () => clearTimeout(timeout); // очистка таймера при размонтировании
  }
}, [loading, results]);


  async function serachData(name) {
    setSearchName(name);
    setCurrentPage(1);
    setLoading(true);
    dispatch(getMandad({
    //   university1,
    //   level,
    //   faculty,
      page: currentPage,
      itemsPerPage,
    //   full_name: searchName
    })).then(() => {
      setLoading(false);
    });
  } 



  


  

  // Удаляем slice — данные уже отфильтрованы сервером
const filteredResults = results
  .map((student, index) => ({
    ...student,
    globalIndex: (currentPage - 1) * itemsPerPage + index,
  }))
  

  // !! totalPages должен считаться от count (взятый с сервера)
  const totalPages = Math.ceil(count / itemsPerPage);

  // Используем весь filteredResults, не режем его снова
  const currentData = filteredResults;



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

  if (loading ) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  if (!loading && results.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">🎓 GPA Leaderboard</h2>
          <p className="text-gray-500">Ma'lumotlar topilmadi</p>
          <p className="text-sm text-gray-400 mt-2">2 soniyadan so‘ng sahifa yangilanadi...</p>
        </div>
      </div>
    );
  }

  const handleDownloadExcel = async () => {
      try {
        const response = await store.dispatch(GetExel());
        
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
    <div className="min-w-screen-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🎓Mandad</h2>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-6 justify-end">
          <select
            value={toifa}
            onChange={(e) => {
              setToifa(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded text-center w-[200px]"
          >
            <option value="">Barcha toifalar</option>
            <option value="true">Toifaga ega</option>
            <option value="false">Toifasiz</option>
          </select>


        <form
            onSubmit={(e) => {
              e.preventDefault(); // обязательно!
              const name = e.target.elements.search.value; // по name инпута
              serachData(name)
            }}
          >
            <input
              type="text"
              name="search" 
              placeholder="Talaba ismi bo‘yicha qidirish"
              defaultValue={searchName}
              className="border p-2 rounded w-[200px]"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
            >
              Qidirish
            </button>
          </form>

        

        <select
          value={university1}
          onChange={(e) => {
            setUniversity1(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded text-center w-[200px]"
        >
          <option value="">Barcha universitetlar</option>
          {university.map((u) => (
            <option value={u.name}>{u.name}</option>))}
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
          {levels.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>


        <select
            value={faculty}
            onChange={(e) => {
              setFaculty(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded w-[200px] text-center"
          >
            <option value="">Barcha fakultetlar</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
        </select>
        <button className="p-2 rounded-md bg-green-500 shadow-xl flex gap-2 items-center hover:bg-green-600 " onClick={handleDownloadExcel}>{error || "Yuklab o'lish"} <img 
        className="w-5 h-5"
        src="https://img.icons8.com/?size=100&id=83159&format=png&color=000000" alt="" /></button>


      </div>

      <div className="bg-white shadow-md  rounded-lg overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className=" bg-gray-100 text-center">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Talaba</th>
              <th className="py-3 px-4">GPA</th>
              <th className="py-3 px-4">Umumiy ball</th>
              <th className="py-3 px-4">Universitet</th>
              <th className="py-3 px-4">Ijtimoyi toifa reestri</th>
              <th className="py-3 px-4">Kurs/Guruh</th>
              <th className="py-3 px-4">Fakultet</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentData?.map((student, index) => {
              const globalIndex = student.globalIndex ?? (currentPage - 1) * itemsPerPage + index;
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
                  <td className="py-2 px-4 ">
                    <div className="flex justify-center items-center gap-2">
                        <img
                        src={
                            student.image && student.image.trim()
                            ? student.image
                            : "https://img.freepik.com/premium-psd/contact-icon-illustration-isolated_23-2151903357.jpg?semt=ais_hybrid&w=740"
                        }
                        className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-center w-[200px]">
                        {student.full_name}
                        </span>
                    </div>
                    
                  </td>
                  <td className="py-2 px-4 font-semibold">
                    {student.gpa_records?.[0]?.gpa || "0.00"}
                  </td>
                  <td className="py-2 px-4">{student.gpaball}</td>
                  <td className="py-2 px-4">{student.university}</td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex items-center justify-center w-full h-full">
                      {student.toifa === false ? (
                        <p className="p-2 rounded-xl bg-red-500 opacity-80 shadow-md text-white w-20 h-8 flex items-center justify-center ">Yoq</p>
                      ):(
                        <p className="p-2 rounded-xl bg-green-500 opacity-80 shadow-md text-white w-20 h-8 flex items-center justify-center ">Ha</p>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 w-40 ">{student.course} / {student.group}</td>
                  <td className="py-2 px-4">{student.faculty}</td>
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
