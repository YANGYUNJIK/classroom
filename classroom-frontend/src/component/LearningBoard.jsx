import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

export default function LearningBoard() {
  const [learnings, setLearnings] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newLearning, setNewLearning] = useState({
    title: "",
    subject: "",
    goal: "",
    rangeText: "",
    content: "",
    deadline: "",
  });

  useEffect(() => {
    const fetchLearnings = async () => {
      try {
        const school = "경북소마";
        const grade = 1;
        const classNum = 1;

        const response = await axios.get(
          "http://localhost:8080/learnings/search",
          {
            params: { school, grade, classNum },
          }
        );

        setLearnings(
          response.data.sort(
            (a, b) => new Date(a.deadline) - new Date(b.deadline)
          )
        );
      } catch (error) {
        console.error("학습 목록 불러오기 실패:", error);
      }
    };

    fetchLearnings();
  }, []);

  const handleInputChange = (e) => {
    setNewLearning({ ...newLearning, [e.target.name]: e.target.value });
  };

  const handleAddLearning = async () => {
    try {
      const teacherInfo = {
        school: "경북소마",
        grade: 1,
        classNum: 1,
      };

      console.log("제출 데이터:", { ...newLearning, ...teacherInfo });

      if (editMode) {
        await axios.put(`http://localhost:8080/learnings/${editingId}`, {
          ...newLearning,
          ...teacherInfo,
        });
        setLearnings((prev) =>
          prev
            .map((item) =>
              item.id === editingId ? { ...item, ...newLearning } : item
            )
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        );
      } else {
        const response = await axios.post("http://localhost:8080/learnings", {
          ...newLearning,
          ...teacherInfo,
        });
        const savedLearning = response.data;

        setLearnings((prev) =>
          [...prev, savedLearning].sort(
            (a, b) => new Date(a.deadline) - new Date(b.deadline)
          )
        );
      }

      // 초기화
      setNewLearning({
        title: "",
        subject: "",
        goal: "",
        rangeText: "",
        content: "",
        deadline: "",
      });
      setFormOpen(false);
      setEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error("학습 저장 실패:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/learnings/${id}`);
      setLearnings((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("학습 삭제 실패:", error);
    }
  };

  const handleEdit = (id) => {
    const toEdit = learnings.find((item) => item.id === id);
    setNewLearning({
      title: toEdit.title || "",
      subject: toEdit.subject || "",
      goal: toEdit.goal || "",
      rangeText: toEdit.rangeText || "",
      content: toEdit.content || "",
      deadline: toEdit.deadline || "",
    });
    setEditMode(true);
    setEditingId(id);
    setFormOpen(true);
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">📘 학습 관리 게시판</h2>
      <ul className="space-y-4">
        {learnings.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 shadow rounded flex justify-between"
          >
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.subject}</p>
              <p className="text-sm">목표: {item.goal}</p>
              <p className="text-sm">범위: {item.rangeText}</p>
              <p className="text-gray-700">{item.content}</p>
              <p className="text-sm text-gray-500">
                마감일: {dayjs(item.deadline).format("YYYY-MM-DD")}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(item.id)}
                className="text-blue-500 hover:underline"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:underline"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md mx-auto p-6 rounded shadow-lg">
            <h4 className="font-semibold mb-4 text-lg">
              {editMode ? "학습 수정" : "새 학습 등록"}
            </h4>
            <div className="flex flex-col space-y-3">
              <input
                name="title"
                value={newLearning.title}
                onChange={handleInputChange}
                placeholder="제목"
                className="border p-2 rounded"
              />
              <input
                name="subject"
                value={newLearning.subject}
                onChange={handleInputChange}
                placeholder="과목"
                className="border p-2 rounded"
              />
              <input
                name="goal"
                value={newLearning.goal}
                onChange={handleInputChange}
                placeholder="목표"
                className="border p-2 rounded"
              />
              <input
                name="rangeText"
                value={newLearning.rangeText}
                onChange={handleInputChange}
                placeholder="범위"
                className="border p-2 rounded"
              />
              <textarea
                name="content"
                value={newLearning.content}
                onChange={handleInputChange}
                placeholder="내용"
                className="border p-2 rounded h-24"
              />
              <input
                name="deadline"
                type={newLearning.deadline ? "date" : "text"}
                value={newLearning.deadline}
                onChange={handleInputChange}
                placeholder="마감일"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                className="border p-2 rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditMode(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleAddLearning}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                {editMode ? "수정 완료" : "등록하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!formOpen && (
        <button
          onClick={() => {
            setFormOpen(true);
            setNewLearning({
              title: "",
              subject: "",
              goal: "",
              rangeText: "",
              content: "",
              deadline: "",
            });
          }}
          className="fixed bottom-8 right-8 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
        >
          + 등록
        </button>
      )}
    </div>
  );
}
