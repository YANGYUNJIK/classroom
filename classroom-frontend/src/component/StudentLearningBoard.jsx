import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentLearningBoard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [completedMap, setCompletedMap] = useState({});
  const [filter, setFilter] = useState("all"); // all | done | undone

  const studentInfo = JSON.parse(localStorage.getItem("studentInfo") || "{}");
  const loginId = localStorage.getItem("loginId") || "";

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

        const sorted = res.data.sort((a, b) => {
          const now = dayjs();
          const aOverdue = dayjs(a.deadline).isBefore(now);
          const bOverdue = dayjs(b.deadline).isBefore(now);

          if (aOverdue && !bOverdue) return 1;
          if (!aOverdue && bOverdue) return -1;

          return dayjs(a.deadline).isAfter(dayjs(b.deadline)) ? 1 : -1;
        });

        setData(sorted);

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
      } catch (err) {
        console.error("❌ 학습 불러오기 실패:", err);
      }
    };

    if (studentInfo.school && loginId) {
      fetchData();
    }
  }, []);

  const handleCardClick = (item) => {
    setSelected(selected?.id === item.id ? null : item);
  };

  const toggleComplete = async (id) => {
    try {
      await axios.post(`http://localhost:8080/api/learning-status/mark`, {
        loginId,
        learningId: id,
      });

      setCompletedMap((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));

      alert(`✅ ${completedMap[id] ? "미완료로 변경됨" : "완료로 표시됨"}`);
      setSelected(null);
    } catch (err) {
      console.error("❌ 상태 토글 실패:", err);
    }
  };

  const filteredData = data.filter((item) => {
    if (filter === "done") return completedMap[item.id];
    if (filter === "undone") return !completedMap[item.id];
    return true;
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">📚 학습 안내</h2>

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
            filter === "done" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("done")}
        >
          완료
        </button>
        <button
          className={`px-3 py-1 rounded ${
            filter === "undone" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("undone")}
        >
          미완료
        </button>
      </div>

      {/* 카드 목록 */}
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {filteredData.map((item) => {
          const isOverdue = dayjs(item.deadline).isBefore(dayjs());
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`relative min-w-[250px] p-4 rounded shadow cursor-pointer hover:shadow-md transition ${
                isOverdue ? "bg-gray-200" : "bg-white"
              }`}
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
            <p className="mt-2">🎯 목표: {selected.goal}</p>
            <p className="mt-2">📌 범위: {selected.rangeText}</p>
            <p className="mt-2 text-gray-800">{selected.content}</p>
            <p className="text-sm text-gray-500 mt-4">
              마감일: {dayjs(selected.deadline).format("YYYY-MM-DD")}
            </p>

            <button
              onClick={() => toggleComplete(selected.id)}
              className={`mt-4 px-4 py-2 rounded text-white ${
                completedMap[selected.id] ? "bg-yellow-500" : "bg-green-500"
              }`}
            >
              {completedMap[selected.id] ? "완료 취소" : "학습 완료"}
            </button>

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
