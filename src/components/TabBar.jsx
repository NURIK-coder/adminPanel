import { useEffect, useState } from "react";
import LeaderTable from "./LeaderTable";
import GpaLeaders from "./GpaLeaders";
import { CurrentUser } from "../store/user/userActions";
import { store } from "../store/store";
import { useSelector } from "react-redux";
import Mandad from "./Mandad";


export default function TabBar() {
  const user = useSelector((state) => state.userInfo.user);
  const [activeTab, setActiveTab] = useState(user.role !== 'dekan' && user.role !== 'kichik_admin' ? "faollik_indexi" : user.role !== 'kichik_admin'? "gpa": "mandad");
  
  

  const tabs = [,
    ...( user.role !== 'kichik_admin'
    ? [{ id: "faollik_indexi", label: "Ijtimoi faollik indexi" }]
    : []),
    ...(user.role === 'dekan' || user.role === 'kichik_admin'
    ? [{ id: "gpa", label: "GPA bo'yicha" }]
    : []),
    ...(user.role === 'dekan' || user.role === 'kichik_admin'
    ? [{ id: "mandad", label: "Mandad" }]
    : []),
  ];
  useEffect(() => {
    store.dispatch(CurrentUser())
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-around space-x-2 border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === tab?.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "faollik_indexi" && user.role !== 'kichik_admin'? (
        <LeaderTable />
      ) : (activeTab === "gpa" && user.role === 'dekan' || user.role === 'kichik_admin') ? (
        <GpaLeaders  />
      ): (activeTab === "mandad" && user.role === 'dekan' || user.role === 'kichik_admin') ?(
        <Mandad/>
      ) : null}
    </div>
  );
}
