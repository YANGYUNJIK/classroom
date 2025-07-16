import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentLearningBoard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null); // 모달로 보여줄 항목

  const studentInfo = {
    school: "푸른초등학교",
    grade: 3,
    classNum: 2,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/learnings/search", {
          params: studentInfo,
        });

        const sorted = res.data.sort((a, b) =>
          dayjs(a.deadline).isAfter(dayjs(b.deadline)) ? 1 : -1
        );
        setData(sorted);
      } catch (err) {
        console.error("학습 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (item) => {
    if (selected?.id === item.id) {
      setSelected(null); // 같은 카드 누르면 닫기
    } else {
      setSelected(item); // 새로 선택
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">📘 학습 안내</h2>

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
              마감일:{" "}
              {item.deadline
                ? dayjs(item.deadline).format("YYYY-MM-DD")
                : "없음"}
            </p>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setSelected(null)} // 바깥 클릭 시 닫힘
        >
          <div
            className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // 모달 안쪽 클릭 방지
          >
            <h3 className="text-xl font-bold mb-2">{selected.title}</h3>
            <p className="text-sm text-gray-600">{selected.subject}</p>
            <p className="mt-2">🎯 목표: {selected.goal}</p>
            <p className="mt-2">📌 범위: {selected.rangeText}</p>
            <p className="mt-2 text-gray-800">{selected.content}</p>
            <p className="text-sm text-gray-500 mt-4">
              마감일:{" "}
              {selected.deadline
                ? dayjs(selected.deadline).format("YYYY-MM-DD")
                : "없음"}
            </p>

            {/* 닫기 버튼 */}
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
