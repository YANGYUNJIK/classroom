import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentLearningBoard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [completedMap, setCompletedMap] = useState({});
  const [isLoaded, setIsLoaded] = useState(false); // ✅ 최초 로딩 플래그 추가

  useEffect(() => {
    const studentInfo = JSON.parse(localStorage.getItem("studentInfo") || "{}");
    const loginId = localStorage.getItem("loginId") || "";

    // 필수 정보가 없으면 중단
    if (
      !studentInfo.school ||
      !studentInfo.grade ||
      !studentInfo.classNum ||
      !loginId
    ) {
      console.warn("❗ studentInfo 또는 loginId가 없습니다.");
      return;
    }

    const fetchData = async () => {
      try {
        // 학습 목록 불러오기
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

        // 완료 상태 불러오기
        const statusRes = await axios.get(
          `http://localhost:8080/api/learning-status/completed/${loginId}`
        );

        const completedIds = Array.isArray(statusRes.data)
          ? statusRes.data
          : [];

        const map = {};
        sorted.forEach((item) => {
          map[item.id] = completedIds.includes(item.id);
        });
        setCompletedMap(map);
        setIsLoaded(true); // ✅ 로딩 완료
      } catch (err) {
        console.error("❌ 학습 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (item) => {
    setSelected(selected?.id === item.id ? null : item);
  };

  const handleComplete = async (itemId) => {
    const loginId = localStorage.getItem("loginId") || "";
    try {
      await axios.post("http://localhost:8080/api/learning-status/mark", {
        loginId,
        learningId: itemId,
      });
      setCompletedMap((prev) => ({
        ...prev,
        [itemId]: true,
      }));
      alert("✅ 완료로 표시했습니다!");
      setSelected(null);
    } catch (err) {
      console.error("❌ 완료 처리 실패:", err);
      alert("❌ 완료 처리에 실패했습니다.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">📚 학습 안내</h2>

      {!isLoaded ? (
        <p className="text-gray-500">불러오는 중...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">표시할 학습이 없습니다.</p>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="relative min-w-[250px] bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition"
            >
              <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-blue-100/80 text-blue-800 shadow-sm">
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
      )}

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

            {!completedMap[selected.id] && (
              <button
                onClick={() => handleComplete(selected.id)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                학습 완료
              </button>
            )}

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
