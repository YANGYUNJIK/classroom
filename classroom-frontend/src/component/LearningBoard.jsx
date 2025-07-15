// src/component/LearningBoard.jsx
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const dummyData = [
  {
    id: 1,
    title: "중간고사 대비 계획",
    subject: "국어",
    goal: "중간고사 대비 학습 완성",
    range: "1~5단원",
    content: "요점 정리 및 문제 풀이 중심으로 학습",
    deadline: "2025-07-20",
  },
  {
    id: 2,
    title: "소단원 마무리 학습",
    subject: "수학",
    goal: "소단원 개념 정리",
    range: "3단원 전체",
    content: "개념 복습 후 유사문제 풀이",
    deadline: "2025-07-17",
  },
];

export default function LearningBoard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 추후 백엔드에서 데이터 받아올 예정
    const sorted = [...dummyData].sort((a, b) =>
      dayjs(a.deadline).isAfter(dayjs(b.deadline)) ? 1 : -1
    );
    setData(sorted);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">📘 학습 관리 게시판</h2>
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded shadow flex justify-between items-start"
        >
          <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.subject}</p>
            <p className="mt-1">
              <strong>목표:</strong> {item.goal}
            </p>
            <p>
              <strong>범위:</strong> {item.range}
            </p>
            <p>
              <strong>내용:</strong> {item.content}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              마감일: {dayjs(item.deadline).format("YYYY-MM-DD")}
            </p>
          </div>
          <div className="space-x-2">
            <button className="text-blue-500 hover:underline">수정</button>
            <button className="text-red-500 hover:underline">삭제</button>
          </div>
        </div>
      ))}
    </div>
  );
}
