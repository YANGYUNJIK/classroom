import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentLearningBoard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  // ✅ 학생 정보
  const studentInfo = {
    school: "경북소마",
    grade: 1,
    classNum: 1,
  };

  // ✅ 학습 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/learnings/search", {
          params: studentInfo,
        });

        console.log("🔍 받은 학습 데이터:", res.data); // 🔍 로그 확인

        const sorted = res.data
          .filter((item) => !!item.deadline) // 날짜 null 제외
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setData(sorted);
      } catch (err) {
        console.error("❌ 학습 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ 카드 클릭 시 모달 열기
  const handleCardClick = (item) => {
    setSelected(selected?.id === item.id ? null : item);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">📘 학습 안내</h2>

      {/* 🧭 데이터가 없을 때 메시지 */}
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 학습이 없습니다.</p>
      ) : (
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
                마감일:{" "}
                {item.deadline
                  ? dayjs(item.deadline).format("YYYY-MM-DD")
                  : "없음"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 📦 모달 */}
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
            <p className="mt-2 text-gray-800 whitespace-pre-line">
              {selected.content}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              마감일:{" "}
              {selected.deadline
                ? dayjs(selected.deadline).format("YYYY-MM-DD")
                : "없음"}
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
