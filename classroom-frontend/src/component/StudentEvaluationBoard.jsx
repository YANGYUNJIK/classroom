import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentEvaluationBoard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null); // 모달 내용
  const [filter, setFilter] = useState("all"); // 필터 상태 추가

  const studentInfo = JSON.parse(localStorage.getItem("studentInfo") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/evaluations/search`,
          { params: studentInfo }
        );
        const sorted = res.data.sort((a, b) =>
          dayjs(a.endDate).isAfter(dayjs(b.endDate)) ? 1 : -1
        );
        setData(sorted);
      } catch (err) {
        console.error("평가 불러오기 실패:", err);
      }
    };

    if (studentInfo.school && studentInfo.grade && studentInfo.classNum) {
      fetchData();
    }
  }, []);

  const handleCardClick = (item) => {
    if (selected?.id === item.id) {
      setSelected(null);
    } else {
      setSelected(item);
    }
  };

  const getDDayText = (endDate) => {
    const today = dayjs().startOf("day");
    const end = dayjs(endDate).startOf("day");
    const diff = end.diff(today, "day");

    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-Day";
    return "마감";
  };

  const filteredData = data
    .filter((item) => {
      const today = dayjs().startOf("day");
      const end = dayjs(item.endDate).startOf("day");

      if (filter === "upcoming")
        return end.isSame(today, "day") || end.isAfter(today);
      if (filter === "past") return end.isBefore(today);
      return true;
    })
    .sort((a, b) => {
      const now = dayjs();
      const aOver = dayjs(a.endDate).isBefore(now);
      const bOver = dayjs(b.endDate).isBefore(now);
      if (aOver && !bOver) return 1;
      if (!aOver && bOver) return -1;
      return 0;
    });

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">📈 평가 안내</h2>

      {/* 필터 버튼 */}
      <div className="flex overflow-x-auto space-x-2 mb-3 pb-1">
        <button
          className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          전체
        </button>
        <button
          className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
            filter === "upcoming" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("upcoming")}
        >
          다가올 평가
        </button>
        <button
          className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
            filter === "past" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("past")}
        >
          지난 평가
        </button>
      </div>

      {/* 평가 카드 리스트 */}
      <div
        className="flex overflow-x-auto space-x-3 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredData.map((item) => {
          const isOverdue = dayjs(item.endDate).isBefore(
            dayjs().startOf("day")
          );
          const dDayText = getDDayText(item.endDate);

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`relative min-w-[47%] p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md transition text-sm ${
                isOverdue ? "bg-gray-100 text-gray-500" : "bg-white"
              }`}
            >
              <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-full bg-blue-100/80 text-blue-800 shadow-sm">
                {dDayText}
              </div>

              <h3 className="font-semibold text-sm truncate">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.subject}</p>
              <p className="text-xs text-gray-500 mt-1">
                마감: {dayjs(item.endDate).format("MM-DD")}
              </p>
            </div>
          );
        })}
      </div>

      {/* 모달 */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg p-5 w-[90%] max-w-sm shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">{selected.title}</h3>
            <p className="text-sm text-gray-600">{selected.subject}</p>
            <p className="mt-2 text-sm">📌 범위: {selected.scope}</p>
            <p className="mt-2 text-sm text-gray-800 whitespace-pre-line">
              {selected.content}
            </p>
            <p className="text-xs text-gray-500 mt-4">
              마감일: {dayjs(selected.endDate).format("YYYY-MM-DD")}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
