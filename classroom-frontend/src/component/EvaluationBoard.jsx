import { useState } from "react";
import dayjs from "dayjs";

export default function EvaluationBoard() {
  const [evaluations, setEvaluations] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [newEval, setNewEval] = useState({
    title: "",
    subject: "",
    scope: "",
    content: "",
    endDate: "",
  });

  const handleInputChange = (e) => {
    setNewEval({ ...newEval, [e.target.name]: e.target.value });
  };

  const handleAddEvaluation = () => {
    const newEntry = {
      ...newEval,
      id: Date.now(),
    };
    setEvaluations((prev) =>
      [...prev, newEntry].sort(
        (a, b) => new Date(a.endDate) - new Date(b.endDate)
      )
    );
    setNewEval({
      title: "",
      subject: "",
      scope: "",
      content: "",
      endDate: "",
    });
    setFormOpen(false);
  };

  const handleDelete = (id) => {
    setEvaluations((prev) => prev.filter((evalItem) => evalItem.id !== id));
  };

  const handleEdit = (id) => {
    const toEdit = evaluations.find((item) => item.id === id);
    setNewEval(toEdit);
    setFormOpen(true);
    handleDelete(id);
  };

  return (
    <div className="relative">
      {/* 평가 목록 */}
      <h2 className="text-xl font-bold mb-4">📈 평가 관리 게시판</h2>
      <ul className="space-y-4">
        {evaluations.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 shadow rounded flex justify-between"
          >
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.subject}</p>
              <p className="text-sm">범위: {item.scope}</p>
              <p className="text-gray-700">{item.content}</p>
              <p className="text-sm text-gray-500">
                마감일: {dayjs(item.endDate).format("YYYY-MM-DD")}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(item.id)}
                className="text-blue-500"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 등록 폼 */}
      {formOpen && (
        <div className="mt-6 bg-white p-4 shadow rounded">
          <h4 className="font-semibold mb-2">새 평가 등록</h4>
          <div className="flex flex-col space-y-3">
            <input
              name="title"
              value={newEval.title}
              onChange={handleInputChange}
              placeholder="제목"
              className="border p-2 rounded"
            />
            <input
              name="subject"
              value={newEval.subject}
              onChange={handleInputChange}
              placeholder="과목"
              className="border p-2 rounded"
            />
            <input
              name="scope"
              value={newEval.scope}
              onChange={handleInputChange}
              placeholder="범위 (간단히)"
              className="border p-2 rounded"
            />
            <textarea
              name="content"
              value={newEval.content}
              onChange={handleInputChange}
              placeholder="내용 (상세하게)"
              className="border p-2 rounded h-24"
            />
            <input
              name="endDate"
              type={newEval.endDate ? "date" : "text"}
              value={newEval.endDate}
              onChange={handleInputChange}
              placeholder="마감(실시) 일자"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              className="border p-2 rounded"
            />
          </div>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddEvaluation}
          >
            등록하기
          </button>
        </div>
      )}

      {/* 등록 버튼 */}
      {!formOpen && (
        <button
          onClick={() => setFormOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        >
          + 등록
        </button>
      )}
    </div>
  );
}
