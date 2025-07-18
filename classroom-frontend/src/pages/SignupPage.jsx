// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function SignupPage() {
//   const [role, setRole] = useState("student");
//   const [form, setForm] = useState({
//     school: "",
//     grade: "",
//     classNum: "",
//     number: "",
//     name: "",
//     subject: "",
//     isHomeroom: false,
//     password: "",
//     phoneNumber: "", // ✅ 전화번호 필드 추가
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         ...form,
//         role: role,
//         grade:
//           role === "student" || form.isHomeroom ? parseInt(form.grade) : null,
//         classNum:
//           role === "student" || form.isHomeroom
//             ? parseInt(form.classNum)
//             : null,
//         number: role === "student" ? parseInt(form.number) : null,
//         subject: role === "teacher" ? form.subject : null,
//         isHomeroom: role === "teacher" ? form.isHomeroom : null,
//       };

//       await axios.post("http://localhost:8080/api/users/signup", payload);
//       alert("회원가입 성공!");
//       navigate("/login");
//     } catch (err) {
//       alert("회원가입 실패: " + err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-lg bg-white p-8 rounded shadow">
//         <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

//         <div className="flex justify-center mb-4 space-x-4">
//           <button
//             className={`px-4 py-2 rounded ${
//               role === "student" ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setRole("student")}
//           >
//             학생
//           </button>
//           <button
//             className={`px-4 py-2 rounded ${
//               role === "teacher" ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setRole("teacher")}
//           >
//             교사
//           </button>
//         </div>

//         <input
//           type="text"
//           name="school"
//           placeholder="학교명"
//           value={form.school}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded mb-3"
//         />

//         <input
//           type="text"
//           name="name"
//           placeholder="이름"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded mb-3"
//         />

//         {/* ✅ 전화번호 입력 필드 */}
//         <input
//           type="text"
//           name="phoneNumber"
//           placeholder="전화번호"
//           value={form.phoneNumber}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded mb-3"
//         />

//         {/* 학생일 경우 or 교사 + 담임일 경우에만 학년/반 입력 */}
//         {(role === "student" || (role === "teacher" && form.isHomeroom)) && (
//           <>
//             <input
//               type="number"
//               name="grade"
//               placeholder="학년"
//               value={form.grade}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded mb-3"
//             />
//             <input
//               type="number"
//               name="classNum"
//               placeholder="반"
//               value={form.classNum}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded mb-3"
//             />
//           </>
//         )}

//         {/* 학생 전용 필드 */}
//         {role === "student" && (
//           <input
//             type="number"
//             name="number"
//             placeholder="번호"
//             value={form.number}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded mb-3"
//           />
//         )}

//         {/* 교사 전용 필드 */}
//         {role === "teacher" && (
//           <>
//             <input
//               type="text"
//               name="subject"
//               placeholder="과목"
//               value={form.subject}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded mb-3"
//             />
//             <label className="block mb-3">
//               <input
//                 type="checkbox"
//                 name="isHomeroom"
//                 checked={form.isHomeroom}
//                 onChange={handleChange}
//                 className="mr-2"
//               />
//               담임 여부
//             </label>
//           </>
//         )}

//         <input
//           type="password"
//           name="password"
//           placeholder="비밀번호"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded mb-6"
//         />

//         <button
//           className="w-full bg-green-500 text-white py-2 rounded"
//           onClick={handleSubmit}
//         >
//           회원가입
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SignupPage() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    school: "",
    grade: "",
    classNum: "",
    number: "",
    name: "",
    subject: "",
    isHomeroom: false,
    password: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        role: role,
        grade:
          role === "student" || form.isHomeroom ? parseInt(form.grade) : null,
        classNum:
          role === "student" || form.isHomeroom
            ? parseInt(form.classNum)
            : null,
        number: role === "student" ? parseInt(form.number) : null,
        subject: role === "teacher" ? form.subject : null,
        isHomeroom: role === "teacher" ? form.isHomeroom : null,
      };

      await axios.post(`${BASE_URL}/api/users/signup`, payload);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      alert("회원가입 실패: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

        <div className="flex justify-center mb-4 space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              role === "student" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setRole("student")}
          >
            학생
          </button>
          <button
            className={`px-4 py-2 rounded ${
              role === "teacher" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setRole("teacher")}
          >
            교사
          </button>
        </div>

        <input
          type="text"
          name="school"
          placeholder="학교명"
          value={form.school}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="전화번호"
          value={form.phoneNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        {(role === "student" || (role === "teacher" && form.isHomeroom)) && (
          <>
            <input
              type="number"
              name="grade"
              placeholder="학년"
              value={form.grade}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded mb-3"
            />
            <input
              type="number"
              name="classNum"
              placeholder="반"
              value={form.classNum}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded mb-3"
            />
          </>
        )}

        {role === "student" && (
          <input
            type="number"
            name="number"
            placeholder="번호"
            value={form.number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded mb-3"
          />
        )}

        {role === "teacher" && (
          <>
            <input
              type="text"
              name="subject"
              placeholder="과목"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded mb-3"
            />
            <label className="block mb-3">
              <input
                type="checkbox"
                name="isHomeroom"
                checked={form.isHomeroom}
                onChange={handleChange}
                className="mr-2"
              />
              담임 여부
            </label>
          </>
        )}

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded mb-6"
        />

        <button
          className="w-full bg-green-500 text-white py-2 rounded"
          onClick={handleSubmit}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
