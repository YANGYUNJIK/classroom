// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function ClassStatus({ user }) {
//   const [students, setStudents] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({
//     name: "",
//     number: "",
//     phoneNumber: "",
//   });

//   useEffect(() => {
//     if (!user) return;
//     fetchStudents();
//   }, [user]);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:8080/api/users/students",
//         {
//           params: {
//             school: user.school,
//             grade: user.grade,
//             classNum: user.classNum,
//           },
//         }
//       );
//       setStudents(response.data);
//     } catch (error) {
//       console.error("학생 목록 불러오기 실패:", error);
//     }
//   };

//   const handleEditClick = (student) => {
//     setEditingId(student.id);
//     setEditData({
//       name: student.name,
//       number: student.number,
//       phoneNumber: student.phoneNumber,
//     });
//   };

//   const handleSaveClick = async () => {
//     try {
//       await axios.put(`http://localhost:8080/api/users/${editingId}`, editData);
//       setEditingId(null);
//       fetchStudents(); // 수정 후 목록 다시 불러오기
//     } catch (error) {
//       console.error("수정 실패:", error);
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-lg font-bold mb-2">📋 우리반 학생 목록</h2>
//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border px-4 py-2">번호</th>
//             <th className="border px-4 py-2">이름</th>
//             <th className="border px-4 py-2">전화번호</th>
//             <th className="border px-4 py-2">수정</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((s) => (
//             <tr key={s.id}>
//               <td className="border px-4 py-2 text-center">
//                 {editingId === s.id ? (
//                   <input
//                     type="number"
//                     value={editData.number}
//                     onChange={(e) =>
//                       setEditData({ ...editData, number: e.target.value })
//                     }
//                     className="border px-2 py-1 w-16"
//                   />
//                 ) : (
//                   s.number
//                 )}
//               </td>
//               <td className="border px-4 py-2">
//                 {editingId === s.id ? (
//                   <input
//                     type="text"
//                     value={editData.name}
//                     onChange={(e) =>
//                       setEditData({ ...editData, name: e.target.value })
//                     }
//                     className="border px-2 py-1"
//                   />
//                 ) : (
//                   s.name
//                 )}
//               </td>
//               <td className="border px-4 py-2">
//                 {editingId === s.id ? (
//                   <input
//                     type="text"
//                     value={editData.phoneNumber}
//                     onChange={(e) =>
//                       setEditData({ ...editData, phoneNumber: e.target.value })
//                     }
//                     className="border px-2 py-1"
//                   />
//                 ) : (
//                   s.phoneNumber
//                 )}
//               </td>
//               <td className="border px-4 py-2 text-center">
//                 {editingId === s.id ? (
//                   <button
//                     onClick={handleSaveClick}
//                     className="bg-green-500 text-white px-3 py-1 rounded"
//                   >
//                     저장
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleEditClick(s)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded"
//                   >
//                     수정
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ClassStatus({ user }) {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    number: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!user) return;
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/students`, {
        params: {
          school: user.school,
          grade: user.grade,
          classNum: user.classNum,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("학생 목록 불러오기 실패:", error);
    }
  };

  const handleEditClick = (student) => {
    setEditingId(student.id);
    setEditData({
      name: student.name,
      number: student.number,
      phoneNumber: student.phoneNumber,
    });
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`${BASE_URL}/api/users/${editingId}`, editData);
      setEditingId(null);
      fetchStudents(); // 수정 후 목록 다시 불러오기
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">📋 우리반 학생 목록</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">번호</th>
            <th className="border px-4 py-2">이름</th>
            <th className="border px-4 py-2">전화번호</th>
            <th className="border px-4 py-2">수정</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border px-4 py-2 text-center">
                {editingId === s.id ? (
                  <input
                    type="number"
                    value={editData.number}
                    onChange={(e) =>
                      setEditData({ ...editData, number: e.target.value })
                    }
                    className="border px-2 py-1 w-16"
                  />
                ) : (
                  s.number
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === s.id ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="border px-2 py-1"
                  />
                ) : (
                  s.name
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === s.id ? (
                  <input
                    type="text"
                    value={editData.phoneNumber}
                    onChange={(e) =>
                      setEditData({ ...editData, phoneNumber: e.target.value })
                    }
                    className="border px-2 py-1"
                  />
                ) : (
                  s.phoneNumber
                )}
              </td>
              <td className="border px-4 py-2 text-center">
                {editingId === s.id ? (
                  <button
                    onClick={handleSaveClick}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    저장
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(s)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    수정
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
