import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentLearningBoard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [completedMap, setCompletedMap] = useState({});

  const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
  const loginId = localStorage.getItem("loginId"); // ✅ loginId 별도 가져오기

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/learnings/search", {
          params: {
            school: studentInfo.school,
            grade: studentInfo.grade,
            classNum: studentInfo.classNum,
          },
        });

        const sorted = res.data.sort((a, b) =>
          dayjs(a.deadline).isAfter(dayjs(b.deadline)) ? 1 : -1
        );
        setData(sorted);

        // ✅ 완료 상태 불러오기
        const statusRes = await axios.get(
          `http://localhost:8080/api/learning-status/completed/${loginId}`
        );
        const completedIds = statusRes.data;

        const map = {};
        sorted.forEach((item) => {
          map[item.id] = completedIds.includes(item.id);
        });
        setCompletedMap(map);
      } catch (err) {
        console.error("학습 불러오기 실패:", err);
      }
    };

    if (studentInfo && loginId) {
      fetchData();
    }
  }, [studentInfo, loginId]);

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
            className="relative min-w-[250px] bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition"
          >
            {/* 완료 상태 배지 */}
            <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-blue-100/80 text-blue-800 shadow-sm backdrop-blur-sm">
              {completedMap[item.id] ? "완료" : "미완료"}
            </div>

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

            {/* 학습 완료 버튼 */}
            {!completedMap[selected.id] && (
              <button
                onClick={async () => {
                  try {
                    await axios.post(
                      "http://localhost:8080/api/learning-status/mark",
                      {
                        loginId: loginId,
                        learningId: selected.id,
                      }
                    );
                    setCompletedMap((prev) => ({
                      ...prev,
                      [selected.id]: true,
                    }));
                    alert("✅ 완료로 표시했습니다!");
                    setSelected(null);
                  } catch (err) {
                    console.error("완료 처리 실패:", err);
                    alert("❌ 완료 처리에 실패했습니다.");
                  }
                }}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                학습 완료
              </button>
            )}

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
