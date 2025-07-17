// src/pages/StudentManagePage.jsx
import { useNavigate } from "react-router-dom";
import StudentEvaluationBoard from "../component/StudentEvaluationBoard";
import StudentLearningBoard from "../component/StudentLearningBoard";
import CounselingBoardStudent from "../component/CounselingBoardStudent";

export default function StudentManagePage() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 space-y-8 max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* 제목 + 뒤로가기 아이콘 (한 줄) */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => navigate("/student/main")}
          className="text-xl text-gray-600 hover:text-black"
          aria-label="뒤로가기"
        >
          ←
        </button>

        <h1 className="text-xl font-bold text-blue-600">📖 학급 안내</h1>
      </div>

      <StudentEvaluationBoard />
      <StudentLearningBoard />
      <CounselingBoardStudent />
    </div>
  );
}
