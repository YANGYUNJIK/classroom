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

// import { useState, useEffect } from "react";
// import axios from "axios";
// import dayjs from "dayjs";

// export default function LearningBoard() {
//   const [data, setData] = useState([]);
//   const [formOpen, setFormOpen] = useState(false);
//   const [newLearning, setNewLearning] = useState({
//     title: "",
//     subject: "",
//     goal: "",
//     range: "",
//     content: "",
//     deadline: "",
//   });

//   const teacherInfo = {
//     school: "푸른초등학교",
//     grade: 3,
//     classNum: 2,
//   };

//   const fetchLearnings = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/learnings/search", {
//         params: teacherInfo,
//       });
//       const sorted = res.data.sort((a, b) =>
//         dayjs(a.deadline).isAfter(dayjs(b.deadline)) ? 1 : -1
//       );
//       setData(sorted);
//     } catch (err) {
//       console.error("불러오기 실패:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLearnings();
//   }, []);

//   const handleInputChange = (e) => {
//     setNewLearning({ ...newLearning, [e.target.name]: e.target.value });
//   };

//   const handleAddLearning = async () => {
//   try {
//     const requestData = {
//       ...newLearning,
//       ...teacherInfo,
//       deadline: newLearning.deadline === "" ? null : newLearning.deadline,
//     };

//     const res = await axios.post("http://localhost:8080/learnings", requestData);

//     setData((prev) =>
//       [...prev, res.data].sort((a, b) =>
//         dayjs(a.deadline).isAfter(dayjs(b.deadline)) ? 1 : -1
//       )
//     );

//     setNewLearning({
//       title: "",
//       subject: "",
//       goal: "",
//       range: "",
//       content: "",
//       deadline: "",
//     });
//     setFormOpen(false);
//   } catch (err) {
//     console.error("등록 실패:", err);
//   }
// };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8080/learnings/${id}`);
//       setData((prev) => prev.filter((item) => item.id !== id));
//     } catch (err) {
//       console.error("삭제 실패:", err);
//     }
//   };

//   const handleEdit = (id) => {
//     const toEdit = data.find((item) => item.id === id);
//     setNewLearning(toEdit);
//     handleDelete(id);
//     setFormOpen(true);
//   };

//   return (
//     <div className="space-y-4 relative">
//       <h2 className="text-xl font-bold mb-4">📘 학습 관리 게시판</h2>

//       {data.map((item) => (
//         <div
//           key={item.id}
//           className="bg-white p-4 rounded shadow flex justify-between items-start"
//         >
//           <div>
//             <h3 className="text-lg font-semibold">{item.title}</h3>
//             <p className="text-sm text-gray-500">{item.subject}</p>
//             <p className="mt-1">
//               <strong>목표:</strong> {item.goal}
//             </p>
//             <p>
//               <strong>범위:</strong> {item.range}
//             </p>
//             <p>
//               <strong>내용:</strong> {item.content}
//             </p>
//             <p className="text-sm text-gray-600 mt-1">
//               마감일: {dayjs(item.deadline).format("YYYY-MM-DD")}
//             </p>
//           </div>
//           <div className="space-x-2">
//             <button
//               className="text-blue-500 hover:underline"
//               onClick={() => handleEdit(item.id)}
//             >
//               수정
//             </button>
//             <button
//               className="text-red-500 hover:underline"
//               onClick={() => handleDelete(item.id)}
//             >
//               삭제
//             </button>
//           </div>
//         </div>
//       ))}

//       {formOpen && (
//         <div className="mt-6 bg-white p-4 shadow rounded">
//           <h4 className="font-semibold mb-2">새 학습 등록</h4>
//           <div className="flex flex-col space-y-3">
//             <input
//               name="title"
//               value={newLearning.title}
//               onChange={handleInputChange}
//               placeholder="제목"
//               className="border p-2 rounded"
//             />
//             <input
//               name="subject"
//               value={newLearning.subject}
//               onChange={handleInputChange}
//               placeholder="과목"
//               className="border p-2 rounded"
//             />
//             <input
//               name="goal"
//               value={newLearning.goal}
//               onChange={handleInputChange}
//               placeholder="목표"
//               className="border p-2 rounded"
//             />
//             <input
//               name="range"
//               value={newLearning.range}
//               onChange={handleInputChange}
//               placeholder="범위"
//               className="border p-2 rounded"
//             />
//             <textarea
//               name="content"
//               value={newLearning.content}
//               onChange={handleInputChange}
//               placeholder="내용"
//               className="border p-2 rounded h-24"
//             />
//             <input
//               name="deadline"
//               type={newLearning.deadline ? "date" : "text"}
//               value={newLearning.deadline}
//               onChange={handleInputChange}
//               placeholder="마감일"
//               onFocus={(e) => (e.target.type = "date")}
//               onBlur={(e) => {
//                 if (!e.target.value) e.target.type = "text";
//               }}
//               className="border p-2 rounded"
//             />
//           </div>
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={handleAddLearning}
//           >
//             등록하기
//           </button>
//         </div>
//       )}

//       {!formOpen && (
//         <button
//           onClick={() => setFormOpen(true)}
//           className="fixed bottom-8 right-8 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
//         >
//           + 등록
//         </button>
//       )}
//     </div>
//   );
// }
