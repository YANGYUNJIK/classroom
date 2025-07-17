import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentEvaluationBoard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null); // 모달 내용
  const [filter, setFilter] = useState("all"); // 필터 상태 추가

  const studentInfo = {
    school: "푸른초등학교",
    grade: 3,
    classNum: 2,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/evaluations/search",
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

    fetchData();
  }, []);

  const handleCardClick = (item) => {
    if (selected?.id === item.id) {
      setSelected(null);
    } else {
      setSelected(item);
    }
  };

  // ✅ 필터링 로직
  const filteredData = data.filter((item) => {
    const now = dayjs();
    const end = dayjs(item.endDate);
    if (filter === "upcoming") return end.isAfter(now);
    if (filter === "past") return end.isBefore(now);
    return true;
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">📈 평가 안내</h2>

      {/* 필터 버튼 */}
      <div className="flex space-x-2 mb-2">
        <button
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          전체
        </button>
        <button
          className={`px-3 py-1 rounded ${
            filter === "upcoming" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("upcoming")}
        >
          다가올 평가
        </button>
        <button
          className={`px-3 py-1 rounded ${
            filter === "past" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("past")}
        >
          지난 평가
        </button>
      </div>

      {/* 가로 스크롤 카드 영역 */}
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {filteredData.map((item) => {
          const isOverdue = dayjs(item.endDate).isBefore(dayjs());
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`min-w-[250px] p-4 rounded shadow cursor-pointer hover:shadow-md transition ${
                isOverdue ? "bg-gray-200" : "bg-white"
              }`}
            >
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.subject}</p>
              <p className="text-sm text-gray-500 mt-2">
                마감일: {dayjs(item.endDate).format("YYYY-MM-DD")}
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
            className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">{selected.title}</h3>
            <p className="text-sm text-gray-600">{selected.subject}</p>
            <p className="mt-2">📌 범위: {selected.scope}</p>
            <p className="mt-2 text-gray-800">{selected.content}</p>
            <p className="text-sm text-gray-500 mt-4">
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
