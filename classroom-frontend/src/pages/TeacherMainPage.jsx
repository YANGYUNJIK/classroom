import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentMainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold mb-4">교사 메인 페이지</h1>
        <p className="text-lg">
          안녕하세요, <b>{user?.name}</b>님!
        </p>
        <p className="text-sm mt-2 text-gray-700">
          학교: {user?.school} <br />
          학년: {user?.grade} / 반: {user?.classNum} / 번호: {user?.number}
        </p>
      </div>

      <div className="w-full flex justify-center mt-8">
        <button
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
