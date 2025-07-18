// import { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import axios from "axios";

// export default function LearningBoard() {
//   const [learnings, setLearnings] = useState([]);
//   const [formOpen, setFormOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [newLearning, setNewLearning] = useState({
//     title: "",
//     subject: "",
//     goal: "",
//     rangeText: "",
//     content: "",
//     deadline: "",
//   });

//   const [summaryMap, setSummaryMap] = useState({});
//   const [selectedSummary, setSelectedSummary] = useState(null);

//   const getTeacherInfo = () => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     return {
//       school: user.school,
//       grade: user.grade,
//       classNum: user.classNum,
//     };
//   };

//   const fetchLearningsWithSummary = async () => {
//     try {
//       const teacherInfo = getTeacherInfo();

//       const res = await axios.get("http://localhost:8080/learnings/search", {
//         params: teacherInfo,
//       });

//       const today = dayjs().startOf("day");

//       const sorted = res.data.sort((a, b) => {
//         const aDeadline = dayjs(a.deadline);
//         const bDeadline = dayjs(b.deadline);
//         const aPast = aDeadline.isBefore(today);
//         const bPast = bDeadline.isBefore(today);

//         if (aPast && !bPast) return 1;
//         if (!aPast && bPast) return -1;
//         return aDeadline.isAfter(bDeadline) ? 1 : -1;
//       });

//       setLearnings(sorted);

//       const summaryPromises = sorted.map((item) =>
//         axios
//           .get(`http://localhost:8080/api/learning-status/summary/${item.id}`)
//           .then((res) => ({ id: item.id, summary: res.data }))
//       );

//       const summaries = await Promise.all(summaryPromises);
//       const summaryObject = {};
//       summaries.forEach(({ id, summary }) => {
//         summaryObject[id] = summary;
//       });

//       setSummaryMap(summaryObject);
//     } catch (err) {
//       console.error("불러오기 실패:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLearningsWithSummary();
//   }, []);

//   const handleInputChange = (e) => {
//     setNewLearning({ ...newLearning, [e.target.name]: e.target.value });
//   };

//   const resetForm = () => {
//     setNewLearning({
//       title: "",
//       subject: "",
//       goal: "",
//       rangeText: "",
//       content: "",
//       deadline: "",
//     });
//     setFormOpen(false);
//     setEditMode(false);
//     setEditingId(null);
//   };

//   const handleAddLearning = async () => {
//     const today = dayjs().startOf("day");
//     const deadline = dayjs(newLearning.deadline);

//     if (deadline.isBefore(today)) {
//       alert("❗ 마감일은 오늘 이후여야 합니다.");
//       return;
//     }

//     try {
//       const teacherInfo = getTeacherInfo();

//       if (editMode) {
//         await axios.put(`http://localhost:8080/learnings/${editingId}`, {
//           ...newLearning,
//           ...teacherInfo,
//         });
//       } else {
//         await axios.post("http://localhost:8080/learnings", {
//           ...newLearning,
//           ...teacherInfo,
//         });
//       }

//       resetForm();
//       fetchLearningsWithSummary();
//     } catch (err) {
//       console.error("저장 실패:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm("정말 삭제하시겠습니까?");
//     if (!confirmed) return;

//     try {
//       await axios.delete(`http://localhost:8080/learnings/${id}`);
//       fetchLearningsWithSummary();
//     } catch (err) {
//       console.error("삭제 실패:", err);
//     }
//   };

//   const handleEdit = (id) => {
//     const toEdit = learnings.find((item) => item.id === id);
//     if (toEdit) {
//       setNewLearning({
//         title: toEdit.title || "",
//         subject: toEdit.subject || "",
//         goal: toEdit.goal || "",
//         rangeText: toEdit.rangeText || "",
//         content: toEdit.content || "",
//         deadline: toEdit.deadline || "",
//       });
//       setEditingId(id);
//       setEditMode(true);
//       setFormOpen(true);
//     }
//   };

//   return (
//     <div className="relative">
//       <h2 className="text-xl font-bold mb-4">📚 학습 관리 게시판</h2>
//       <ul className="space-y-4">
//         {learnings.map((item) => {
//           const isPast = dayjs(item.deadline).isBefore(dayjs().startOf("day"));

//           return (
//             <li
//               key={item.id}
//               className={`bg-white p-4 shadow rounded hover:shadow-lg transition-transform transform hover:-translate-y-1 flex justify-between ${
//                 isPast ? "opacity-50" : ""
//               }`}
//             >
//               <div>
//                 <h3 className="font-bold">{item.title}</h3>
//                 <p className="text-sm text-gray-600">{item.subject}</p>
//                 <p className="text-sm">목표: {item.goal}</p>
//                 <p className="text-sm">범위: {item.rangeText}</p>
//                 <p className="text-gray-700">{item.content}</p>
//                 <p className="text-sm text-gray-500">
//                   마감일: {dayjs(item.deadline).format("YYYY-MM-DD")}
//                 </p>

//                 {summaryMap[item.id] && (
//                   <p
//                     className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline"
//                     onClick={() => setSelectedSummary(summaryMap[item.id])}
//                   >
//                     완료 {summaryMap[item.id].completed.length} / 전체{" "}
//                     {summaryMap[item.id].completed.length +
//                       summaryMap[item.id].notCompleted.length}
//                   </p>
//                 )}
//               </div>

//               <div className="space-x-2 text-right">
//                 <button
//                   onClick={() => handleEdit(item.id)}
//                   className="text-blue-500 hover:underline"
//                 >
//                   수정
//                 </button>
//                 <button
//                   onClick={() => handleDelete(item.id)}
//                   className="text-red-500 hover:underline"
//                 >
//                   삭제
//                 </button>
//               </div>
//             </li>
//           );
//         })}
//       </ul>

//       {selectedSummary && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//           onClick={() => setSelectedSummary(null)}
//         >
//           <div
//             className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3 className="text-lg font-bold mb-2">✅ 완료한 학생</h3>
//             <ul className="text-sm mb-4">
//               {selectedSummary.completed.length === 0 ? (
//                 <li className="text-gray-500">아직 완료한 학생이 없습니다.</li>
//               ) : (
//                 selectedSummary.completed.map((s) => (
//                   <li key={s.loginId}>{s.name}</li>
//                 ))
//               )}
//             </ul>
//             <button
//               onClick={() => setSelectedSummary(null)}
//               className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       )}

//       {formOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md mx-auto p-6 rounded shadow-lg">
//             <h4 className="font-semibold mb-4 text-lg">
//               {editMode ? "학습 수정" : "새 학습 등록"}
//             </h4>
//             <div className="flex flex-col space-y-3">
//               <input
//                 name="title"
//                 value={newLearning.title}
//                 onChange={handleInputChange}
//                 placeholder="제목"
//                 className="border p-2 rounded"
//               />
//               <input
//                 name="subject"
//                 value={newLearning.subject}
//                 onChange={handleInputChange}
//                 placeholder="과목"
//                 className="border p-2 rounded"
//               />
//               <input
//                 name="goal"
//                 value={newLearning.goal}
//                 onChange={handleInputChange}
//                 placeholder="목표"
//                 className="border p-2 rounded"
//               />
//               <input
//                 name="rangeText"
//                 value={newLearning.rangeText}
//                 onChange={handleInputChange}
//                 placeholder="범위"
//                 className="border p-2 rounded"
//               />
//               <textarea
//                 name="content"
//                 value={newLearning.content}
//                 onChange={handleInputChange}
//                 placeholder="내용"
//                 className="border p-2 rounded h-24"
//               />
//               <input
//                 name="deadline"
//                 type="date"
//                 value={newLearning.deadline}
//                 onChange={handleInputChange}
//                 className="border p-2 rounded"
//               />
//             </div>
//             <div className="mt-4 flex justify-end space-x-2">
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 rounded bg-gray-300"
//               >
//                 취소
//               </button>
//               <button
//                 onClick={handleAddLearning}
//                 className="px-4 py-2 rounded bg-blue-500 text-white"
//               >
//                 {editMode ? "수정 완료" : "등록하기"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {!formOpen && (
//         <button
//           onClick={() => {
//             setFormOpen(true);
//             setEditMode(false);
//             setEditingId(null);
//           }}
//           className="fixed bottom-8 right-8 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
//         >
//           + 등록
//         </button>
//       )}
//     </div>
//   );
// }

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

  const [summaryMap, setSummaryMap] = useState({});
  const [selectedSummary, setSelectedSummary] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const getTeacherInfo = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      school: user.school,
      grade: user.grade,
      classNum: user.classNum,
    };
  };

  const fetchLearningsWithSummary = async () => {
    try {
      const teacherInfo = getTeacherInfo();

      const res = await axios.get(`${BASE_URL}/learnings/search`, {
        params: teacherInfo,
      });

      const today = dayjs().startOf("day");

      const sorted = res.data.sort((a, b) => {
        const aDeadline = dayjs(a.deadline);
        const bDeadline = dayjs(b.deadline);
        const aPast = aDeadline.isBefore(today);
        const bPast = bDeadline.isBefore(today);

        if (aPast && !bPast) return 1;
        if (!aPast && bPast) return -1;
        return aDeadline.isAfter(bDeadline) ? 1 : -1;
      });

      setLearnings(sorted);

      const summaryPromises = sorted.map((item) =>
        axios
          .get(`${BASE_URL}/api/learning-status/summary/${item.id}`)
          .then((res) => ({ id: item.id, summary: res.data }))
      );

      const summaries = await Promise.all(summaryPromises);
      const summaryObject = {};
      summaries.forEach(({ id, summary }) => {
        summaryObject[id] = summary;
      });

      setSummaryMap(summaryObject);
    } catch (err) {
      console.error("불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchLearningsWithSummary();
  }, []);

  const handleInputChange = (e) => {
    setNewLearning({ ...newLearning, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
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
  };

  const handleAddLearning = async () => {
    const today = dayjs().startOf("day");
    const deadline = dayjs(newLearning.deadline);

    if (deadline.isBefore(today)) {
      alert("❗ 마감일은 오늘 이후여야 합니다.");
      return;
    }

    try {
      const teacherInfo = getTeacherInfo();

      if (editMode) {
        await axios.put(`${BASE_URL}/learnings/${editingId}`, {
          ...newLearning,
          ...teacherInfo,
        });
      } else {
        await axios.post(`${BASE_URL}/learnings`, {
          ...newLearning,
          ...teacherInfo,
        });
      }

      resetForm();
      fetchLearningsWithSummary();
    } catch (err) {
      console.error("저장 실패:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/learnings/${id}`);
      fetchLearningsWithSummary();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const handleEdit = (id) => {
    const toEdit = learnings.find((item) => item.id === id);
    if (toEdit) {
      setNewLearning({
        title: toEdit.title || "",
        subject: toEdit.subject || "",
        goal: toEdit.goal || "",
        rangeText: toEdit.rangeText || "",
        content: toEdit.content || "",
        deadline: toEdit.deadline || "",
      });
      setEditingId(id);
      setEditMode(true);
      setFormOpen(true);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">📚 학습 관리 게시판</h2>
      <ul className="space-y-4">
        {learnings.map((item) => {
          const isPast = dayjs(item.deadline).isBefore(dayjs().startOf("day"));

          return (
            <li
              key={item.id}
              className={`bg-white p-4 shadow rounded hover:shadow-lg transition-transform transform hover:-translate-y-1 flex justify-between ${
                isPast ? "opacity-50" : ""
              }`}
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

                {summaryMap[item.id] && (
                  <p
                    className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline"
                    onClick={() => setSelectedSummary(summaryMap[item.id])}
                  >
                    완료 {summaryMap[item.id].completed.length} / 전체{" "}
                    {summaryMap[item.id].completed.length +
                      summaryMap[item.id].notCompleted.length}
                  </p>
                )}
              </div>

              <div className="space-x-2 text-right">
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
          );
        })}
      </ul>

      {selectedSummary && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setSelectedSummary(null)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">✅ 완료한 학생</h3>
            <ul className="text-sm mb-4">
              {selectedSummary.completed.length === 0 ? (
                <li className="text-gray-500">아직 완료한 학생이 없습니다.</li>
              ) : (
                selectedSummary.completed.map((s) => (
                  <li key={s.loginId}>{s.name}</li>
                ))
              )}
            </ul>
            <button
              onClick={() => setSelectedSummary(null)}
              className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              닫기
            </button>
          </div>
        </div>
      )}

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
                type="date"
                value={newLearning.deadline}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={resetForm}
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
            setEditMode(false);
            setEditingId(null);
          }}
          className="fixed bottom-8 right-8 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
        >
          + 등록
        </button>
      )}
    </div>
  );
}
