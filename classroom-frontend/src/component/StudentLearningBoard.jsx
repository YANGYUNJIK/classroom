import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentLearningBoard() {
  const [data, setData] = useState([]);

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

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">📘 학습 안내</h2>
      {data.map((item) => (
        <div key={item.id} className="bg-white p-4 mb-4 rounded shadow">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.subject}</p>
          <p>🎯 목표: {item.goal}</p>
          <p>📌 범위: {item.range}</p>
          <p className="mt-1 text-gray-800">{item.content}</p>
          <p className="text-sm text-gray-500 mt-2">
            마감일:{" "}
            {item.deadline ? dayjs(item.deadline).format("YYYY-MM-DD") : "없음"}
          </p>
        </div>
      ))}
    </div>
  );
}
