// components/GpaLeaders.jsx
import { FixedSizeList as List } from "react-window";
import dayjs from "dayjs";
import "dayjs/locale/ru";

export default function GpaLeaders({ leaders }) {
  const Row = ({ index, style }) => {
    const leader = leaders[index];
    const user = leader?.student;

    return (
      <div
        style={style}
        className={`grid grid-cols-5 border-b px-4 py-2 items-center ${
          index % 2 === 0 ? "bg-gray-100" : "bg-white"
        }`}
      >
        <span className="truncate">{user?.full_name}</span>
        <span className="truncate">{user?.university?.name}</span>
        <span className="truncate">{user?.faculty?.name}</span>
        <span className="truncate">{user?.course}</span>
        <span className="truncate">{leader?.gpa}</span>
      </div>
    );
  };

  return (
    <div className="border rounded">
      <div className="grid grid-cols-5 bg-gray-200 px-4 py-2 font-bold">
        <span>F.I.SH</span>
        <span>OTM</span>
        <span>Fakultet</span>
        <span>Kurs</span>
        <span>GPA</span>
      </div>
      <List
        height={600}
        itemCount={leaders.length}
        itemSize={50}
        width={"100%"}
      >
        {Row}
      </List>
    </div>
  );
}
