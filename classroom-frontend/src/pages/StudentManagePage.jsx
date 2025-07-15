// src/pages/StudentManagePage.jsx
import StudentEvaluationBoard from "../component/StudentEvaluationBoard";
import StudentLearningBoard from "../component/StudentLearningBoard";

export default function StudentManagePage() {
  return (
    <div className="p-4 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        📖 오늘의 학급 안내
      </h1>
      <StudentEvaluationBoard />
      <StudentLearningBoard />
    </div>
  );
}
