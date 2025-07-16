import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentLearningBoard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  // ✅ 로그인 시 저장한 studentInfo 불러오기
  const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/learnings/search", {
          params: studentInfo,
        });
        console.log("✅ 서버 응답:", res.data);
        const sorted = res.data.sort((a, b) =>
          dayjs(a.deadline).isAfter(dayjs(b.deadline)) ? 1 : -1
        );
        setData(sorted);
      } catch (err) {
        console.error("학습 불러오기 실패:", err);
      }
    };

    if (studentInfo) {
      fetchData();
    }
  }, [studentInfo]);

  const handleCardClick = (item) => {
    if (selected?.id === item.id) {
      setSelected(null);
    } else {
      setSelected(item);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">📚 학습 안내</h2>

      {/* 가로 스크롤 카드 영역 */}
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="min-w-[250px] bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.subject}</p>
            <p className="text-sm text-gray-500 mt-2">
              마감일: {dayjs(item.deadline).format("YYYY-MM-DD")}
            </p>
          </div>
        ))}
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
            <p className="mt-2">🎯 목표: {selected.goal}</p>
            <p className="mt-2">📌 범위: {selected.rangeText}</p>
            <p className="mt-2 text-gray-800">{selected.content}</p>
            <p className="text-sm text-gray-500 mt-4">
              마감일: {dayjs(selected.deadline).format("YYYY-MM-DD")}
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
