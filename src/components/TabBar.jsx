import { useEffect, useState } from "react";
import LeaderTable from "./LeaderTable";
import GpaLeaders from "./GpaLeaders";


export default function TabBar() {
  const [activeTab, setActiveTab] = useState("faollik_indexi");

  

  const tabs = [
    { id: "faollik_indexi", label: "Ijtimoi faollik indexi" },
    { id: "gpa", label: "GPA bo'yicha" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-around space-x-2 border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "faollik_indexi" ? (
        <LeaderTable />
      ) :  (
        <GpaLeaders  />
      ) }
    </div>
  );
}
