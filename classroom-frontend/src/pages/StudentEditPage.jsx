import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function StudentEditPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    school: "",
    grade: "",
    classNum: "",
    number: "",
    password: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    setUserData({
      name: user.name,
      school: user.school,
      grade: user.grade,
      classNum: user.classNum,
      number: user.number,
      password: "", // 수정용 비밀번호 필드 추가
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginId = localStorage.getItem("loginId");
    try {
      await axios.put(`${BASE_URL}/api/users/update`, {
        loginId,
        ...userData,
      });

      // 수정된 정보로 localStorage 업데이트
      localStorage.setItem("user", JSON.stringify({ ...userData, loginId }));

      alert("회원정보가 수정되었습니다.");
      navigate("/student/main");
    } catch (err) {
      console.error("회원정보 수정 실패", err);
      alert("회원정보 수정에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          회원정보 수정
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="이름"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
          <InputField
            label="학교"
            name="school"
            value={userData.school}
            onChange={handleChange}
            //disabled
          />
          <InputField
            label="학년"
            name="grade"
            value={userData.grade}
            onChange={handleChange}
            //disabled
          />
          <InputField
            label="반"
            name="classNum"
            value={userData.classNum}
            onChange={handleChange}
            //disabled
          />
          <InputField
            label="번호"
            name="number"
            value={userData.number}
            onChange={handleChange}
          />
          <InputField
            label="비밀번호"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
          >
            저장하기
          </button>
        </form>
        <button
          onClick={() => navigate("/student/main")}
          className="w-full mt-4 text-sm text-gray-600 underline"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border ${
          disabled ? "bg-gray-100 text-gray-500" : "bg-white"
        } rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300`}
      />
    </div>
  );
}
