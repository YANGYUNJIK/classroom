import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

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

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const school = "푸른초등학교";
        const grade = 3;
        const classNum = 2;

        const response = await axios.get(
          "http://localhost:8080/evaluations/search",
          {
            params: { school, grade, classNum },
          }
        );

        setEvaluations(
          response.data.sort(
            (a, b) => new Date(a.endDate) - new Date(b.endDate)
          )
        );
      } catch (error) {
        console.error("평가 목록 불러오기 실패:", error);
      }
    };

    fetchEvaluations();
  }, []);

  const handleInputChange = (e) => {
    setNewEval({ ...newEval, [e.target.name]: e.target.value });
  };

  const handleAddEvaluation = async () => {
    try {
      const teacherInfo = {
        school: "푸른초등학교",
        grade: 3,
        classNum: 2,
      };

      const response = await axios.post("http://localhost:8080/evaluations", {
        ...newEval,
        ...teacherInfo,
      });

      const savedEval = response.data;

      setEvaluations((prev) =>
        [...prev, savedEval].sort(
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
    } catch (error) {
      console.error("평가 저장 실패:", error);
    }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md mx-auto p-6 rounded shadow-lg">
            <h4 className="font-semibold mb-4 text-lg">새 평가 등록</h4>
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
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleAddEvaluation}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 등록 버튼 */}
      {!formOpen && (
        <button
          onClick={() => setFormOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
        >
          + 등록
        </button>
      )}
    </div>
  );
}
