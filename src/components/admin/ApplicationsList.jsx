import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../store/store";
import { ApplicationDetail, ApplicationList, sendScoreWithAuth } from "../../store/applications/applicationActions";
import AdminSidebar from "../../pages/admin/AdminSideBar";

export default function ApplicationsList() {
  const applications = useSelector((a) => a.applicationsInfo.applications.results);
  const paginationInfo = useSelector((a) => a.applicationsInfo.applications);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAppId, setExpandedAppId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  console.log(selectedDetail);
  const [openCommentFields, setOpenCommentFields] = useState({});
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  const fetchApplications = async (page = 1) => {
    await store.dispatch(ApplicationList(page));
  };

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const handleOpenComment = (id) => {
    setOpenCommentFields((prev) => ({
      ...prev,
      [id]: true
    }));
  };


  const handleScoreChange = (idx, value) => {
    setScores((prev) => ({ ...prev, [idx]: parseInt(value) }));
  };

  const handleCommentChange = (idx, text) => {
    setComments((prev) => ({ ...prev, [idx]: text }));
  };

  const handleSaveScore = async (id) => {
    const score = scores[id];
    const comment = comments[id];

    if (score !== undefined) {
        const scoreData = {
            item: id,
            value: score,
            note: comment || ""
        };

        try {
            const result = await store.dispatch(sendScoreWithAuth(scoreData));
            
            
            const scoreValue = result; 

            const updatedItems = selectedDetail.items.map((item) =>
              item.id === id ? { ...item, score: scoreValue } : item
            );
            console.log(updatedItems);
            
            setSelectedDetail((prev) => ({ ...prev, items: updatedItems }));

            // Можно также очистить введённые данные
            setScores((prev) => ({ ...prev, [id]: undefined }));
            setComments((prev) => ({ ...prev, [id]: "" }));
            

        } catch (error) {
            alert(error.message); // или setError(error.message)
        }
    }
    };


  const filteredApps = applications?.filter((app) =>
    app.student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const groupedByDay = filteredApps?.reduce((acc, app) => {
    const isoDate = new Date(app.submitted_at).toISOString().split("T")[0];
    if (!acc[isoDate]) acc[isoDate] = [];
    acc[isoDate].push(app);
    return acc;
  }, {});

  const totalPages = Math.ceil((paginationInfo?.count || 1) / 10);

  return (
    
    <div className="bg-gray-50 min-h-screen mx-10">
     
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">Arizalar</h2>
          <input
            type="text"
            placeholder="Ism bo‘yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded shadow-sm focus:outline-none w-64"
          />
        </div>

        {groupedByDay && Object.entries(groupedByDay).length > 0 ? (
          Object.entries(groupedByDay).map(([dayKey, apps]) => (
            <div key={dayKey} className="mb-2 ml-3 text-left">
              <h3 className="text-xl font-semibold   border-b pb-1">{dayKey}</h3>
              <div className="space-y-3 bg-[#f9fafe] p-4 rounded-lg shadow-sm">
                {apps.map((app) => (
                  <div key={app.id} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <img 
                        src="https://img.freepik.com/premium-psd/contact-icon-illustration-isolated_23-2151903357.jpg?semt=ais_hybrid&w=740"
                        className="w-[50px] rounded-full shadow-xl border-[1px]"/>
                        <div className="flex flex-col mx-3 ">
                          <p className="mx-2 text-[15px]">GPA: {app.student.gpa_records[0].gpa}</p>
                          <h4 className="font-bold text-green-600">JAMI: <span className="text-gray-700 ">{app.total_score}</span></h4>
                        </div>
                        

                      <div className="mx-auto text-center">
                        <p className="text-sm text-gray-500">{new Date(app.submitted_at).toISOString().split("T")[0]}</p>
                        <p className="font-medium text-gray-800">{app.student.full_name}</p>
                        <p className="text-xs text-gray-400">ID: {app.student.student_id_number}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                            {app.status === "accepted" && (
                                <span className="bg-green-100 text-green-700 text-sm rounded-full px-3 py-1 font-medium">
                                ✔ Tasdiqlandi
                                </span>
                            )}
                            {app.status === "pending" && (
                                <div className="flex items-center gap-2">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                    Ko‘rib chiqilmoqda
                                </span>
                                <button
                                    onClick={async () => {
                                    if (expandedAppId !== app.id) {
                                        const res = await store.dispatch(ApplicationDetail(app.id));
                                        if (res?.payload) {
                                        setSelectedDetail(res.payload);
                                        setExpandedAppId(app.id);
                                        }
                                    } else {
                                        setExpandedAppId(null);
                                        setSelectedDetail(null);
                                    }
                                    }}
                                    className="bg-purple-600 rounded px-3 py-1 text-white hover:bg-white hover:shadow-xl hover:text-black text-sm transition"
                                >
                                    Baholash {expandedAppId === app.id ? (<span>▼</span>) : '▶'}
                                </button>
                                </div>
                            )}
                            {app.status !== "pending" && app.status !== "accepted" && (
                                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                                Noma’lum
                                </span>
                            )}
                        </div>

                    </div>

                    {expandedAppId === app.id && selectedDetail?.items && (
                      <div className="p-5 bg-white border rounded-xl shadow-md space-y-4 mt-6 transition">
                        <div className="flex justify-between">
                          <h4 className="text-lg font-semibold text-gray-800">Yo‘nalishlar</h4>
                        </div>
                        

                        {selectedDetail.items.map((item, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                              <p className="text-lg font-medium text-gray-900">{item.direction_name}</p>
                              {item.files?.length > 0 ? (
                                <a
                                  href={item.files[0].file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-white rounded p-2 bg-blue-700 mt-1"
                                >
                                  Faylni ko‘rish ⬆️
                                </a>
                              ) : (
                                <span className="text-sm text-red-500 mt-1">Fayl yo‘q</span>
                              )}
                            </div>

                            <div className="mt-4">
                              {(item.direction_name === "Kitobxonlik madaniyati" || item.direction_name === "Talabaning akademik o‘zlashtirishi") ? (
                                <div className="text-sm text-gray-700 space-y-1">
                                  <p>
                                     <span className="font-medium text-purple-800">🤖Baholadi: <i className="text-gray-700">Tizim(avtomatik)</i></span>{" "}
                                    
                                  </p>
                                  {item.direction_name === "Talabaning akademik o‘zlashtirishi" ?(
                                    <p>
                                      🎓 <span className="font-medium text-gray-800">GPA:</span>{" "}
                                        {selectedDetail?.student.gpa_records[0].gpa ?? "0"}
                                    </p>
                                  ):(
                                    <div>
                                      <p>
                                        📊 <span className="font-medium text-gray-800">Test natijasi: </span>
                                        {item.test_result != null ? `${item.test_result}%` : "Noma’lum"}
                                      </p>
                                      <p>
                                        🧮 <span className="font-medium text-gray-800">Test ball:</span>{" "}
                                        {item.test_ball ?? "0"}
                                      </p>
                                    </div>
                                    
                                  )}
                                  
                                  
                                  {item.direction_name != "Kitobxonlik madaniyati" && (
                                     <p>
                                      🎓 <span className="font-medium text-gray-800">GPA (ball):</span>{" "}
                                      {item?.gpa_ball ?? "0"}
                                    </p>
                                  )}
                                 
                                </div>
                              ) : item.score === undefined || item.score === null ? (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-4">
                                    <select
                                      onChange={(e) => handleScoreChange(item.id, e.target.value)}
                                      defaultValue=""
                                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="" disabled>Bahoni tanlang</option>
                                      {Array.from(
                                        { length: Number(item.max_score) - Number(item.min_score) + 1 },
                                        (_, i) => Number(item.min_score) + i
                                      ).map((score) => (
                                        <option key={score} value={score}>
                                          {score}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {openCommentFields[item.id] ? (
                                    <textarea
                                      placeholder="Kommentariyani kiriting..."
                                      rows={3}
                                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                    ></textarea>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenComment(item.id)}
                                      className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white mr-3"
                                    >
                                      Izoh yo'zish
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleSaveScore(item.id)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                  >
                                    Saqlash
                                  </button>
                                </div>
                              ) : (
                                <span className="text-green-600 font-medium text-sm">
                                  <p className="text-red-700">
                                    👨‍🏫Baholadi: <span className="text-gray-700">{item.score.reviewer2}</span>
                                  </p>
                                  ✅ Baholangan: <span className="text-gray-700">{item.score.value}</span>
                                  <p className="text-gray-700">
                                    ✍️Izoh: <i>{item.score.note || "Izoh yo'zilmagan"}</i>
                                  </p>
                                </span>
                              )}
                            </div>
                          </div>

                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Arizalar topilmadi</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}