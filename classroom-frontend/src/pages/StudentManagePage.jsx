// src/pages/StudentManagePage.jsx
import { useNavigate } from "react-router-dom";
import StudentEvaluationBoard from "../component/StudentEvaluationBoard";
import StudentLearningBoard from "../component/StudentLearningBoard";

export default function StudentManagePage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-8 max-w-3xl mx-auto">
      {/* ← 아이콘 뒤로가기 */}
      <button
        onClick={() => navigate("/student/main")} // 명시적으로 경로 지정
        className="text-2xl mb-2 text-gray-600 hover:text-black"
        aria-label="뒤로가기"
      >
        ←
      </button>

      <h1 className="text-2xl font-bold text-center mb-4">
        📖 오늘의 학급 안내
      </h1>

      <StudentEvaluationBoard />
      <StudentLearningBoard />
    </div>
  );
}
