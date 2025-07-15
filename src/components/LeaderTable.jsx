import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../store/store";
import { ApplicationList } from "../store/applications/applicationActions";


const leaders = [
  {
    id: 1,
    name: "Thomas L. Fletcher",
    profession: "Product Designer",
    score: 9.4,
    views: 4560,
    rating: 5.0,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jane Cooper",
    profession: "UI Designer",
    score: 9.2,
    views: 4480,
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Wade Warren",
    profession: "Medical Student",
    score: 9.1,
    views: 4380,
    rating: 4.8,
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Esther Howard",
    profession: "Product Owner",
    score: 8.9,
    views: 4210,
    rating: 4.7,
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Brooklyn Simmons",
    profession: "Marketing Coordinator",
    score: 8.8,
    views: 4050,
    rating: 4.6,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Courtney Henry",
    profession: "Medical Assistant",
    score: 8.7,
    views: 3980,
    rating: 4.5,
    image: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "Darrell Steward",
    profession: "Web Designer",
    score: 8.5,
    views: 3860,
    rating: 4.4,
    image: "https://i.pravatar.cc/150?img=7",
  },
];

export default function LeaderTable() {
  const applications = useSelector(a=>a.applicationsInfo.applications.results)
  console.log(applications);
  
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(leaders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleLeaders = leaders.slice(startIndex, startIndex + itemsPerPage);

  useEffect(()=>{
    store.dispatch(ApplicationList())
  },[])

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🏆 Yo‘nalish bo‘yicha liderlar
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Talaba</th>
              <th className="px-6 py-3">Kasbi</th>
              <th className="px-6 py-3">⭐ Baho</th>
              <th className="px-6 py-3">👁 Ko‘rishlar</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleLeaders.map((leader, index) => {
              const globalIndex = startIndex + index;
              const medal = getMedal(globalIndex);
              const isTopThree = globalIndex < 3;

              return (
                <tr
                  key={leader.id}
                  className={`transition-all ${isTopThree ? "bg-yellow-50" : ""}`}
                >
                  {/* # */}
                  <td className="px-6 py-4 text-center align-middle text-lg">
                    {medal || globalIndex + 1}
                  </td>

                  {/* Talaba */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span
                        className={`text-gray-800 ${
                          isTopThree ? "font-semibold text-lg" : "font-medium"
                        }`}
                      >
                        {leader.name}
                      </span>
                    </div>
                  </td>

                  {/* Kasbi */}
                  <td className="px-6 py-4 align-middle">{leader.profession}</td>

                  {/* Baho */}
                  <td className="px-6 py-4 align-middle font-semibold text-yellow-500 text-center">
                    {leader.rating.toFixed(1)}
                  </td>

                  {/* Ko‘rishlar */}
                  <td className="px-6 py-4 align-middle text-gray-600 text-center">
                    {leader.views.toLocaleString()} ta
                  </td>

                  {/* Button */}
                  <td className="px-6 py-4 align-middle text-center">
                    <button className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600">
                      Follow
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 pb-4">
        <div className="inline-flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-1 rounded border font-medium ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
