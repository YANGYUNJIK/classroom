import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        null,
        {
          params: {
            phoneNumber,
            password,
          },
        }
      );

      const user = response.data;

      // ✅ loginId 따로 저장 (출석 체크용)
      localStorage.setItem("loginId", user.loginId);

      // ✅ 전체 user 객체 저장
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ studentInfo 별도 저장 (school, grade, classNum)
      localStorage.setItem(
        "studentInfo",
        JSON.stringify({
          school: user.school,
          grade: user.grade,
          classNum: user.classNum,
        })
      );

      // ✅ 역할에 따라 페이지 이동
      if (user.role === "student") {
        navigate("/student/main");
      } else if (user.role === "teacher") {
        navigate("/teacher/manage");
      } else {
        alert("역할 정보가 올바르지 않습니다.");
      }
    } catch (error) {
      alert("로그인 실패: 전화번호 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

        {/* 전화번호 입력 */}
        <input
          type="text"
          placeholder="전화번호"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        {/* 오류 메시지 */}
        {error && <div className="text-red-500 mb-3 text-center">{error}</div>}

        {/* 로그인 버튼 */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded mb-2 hover:bg-blue-600"
          onClick={handleLogin}
        >
          로그인
        </button>

        <p className="text-center text-sm text-gray-600">
          아직 회원이 아니신가요?{" "}
          <a href="/signup" className="text-blue-500 underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
