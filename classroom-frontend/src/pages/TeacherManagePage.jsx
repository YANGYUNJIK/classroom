import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeTableInput from "../component/TimeTableInput";
import EvaluationBoard from "../component/EvaluationBoard";
import LearningBoard from "../component/LearningBoard";
import SchoolScheduleCard from "../component/SchoolScheduleCard";

export default function TeacherManagePage() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("시간표 등록");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      alert("접근 권한이 없습니다.");
      navigate("/login");
    }
  }, [navigate, user]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "우리반 현황":
        return <div>✅ 우리반 현황이 여기에 들어옵니다.</div>;
      case "시간표 등록":
        return <TimeTableInput />;
      case "출석 현황":
        return <div>✅ 출석 확인 기능이 여기에 들어옵니다.</div>;
      case "평가 관리":
        return <EvaluationBoard />;
      case "학습 관리":
        return <LearningBoard />;
      case "일정 관리":
        return <SchoolScheduleCard />;
      default:
        return <div>메뉴를 선택하세요.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 상단: 교사 정보 */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">교사 관리 페이지</h2>
          <p className="text-sm text-gray-600">
            {user?.school} / {user?.name} ({user?.subject})
          </p>
        </div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1">
        {/* 왼쪽 탭 */}
        <div className="w-48 bg-white shadow-md p-4">
          {[
            "우리반 현황",
            "시간표 등록",
            "출석 현황",
            "평가 관리",
            "학습 관리",
            "일정 관리",
          ].map((menu) => (
            <button
              key={menu}
              className={`block w-full text-left px-3 py-2 rounded mb-2 ${
                selectedMenu === menu
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedMenu(menu)}
            >
              {menu}
            </button>
          ))}
        </div>

        {/* 오른쪽 콘텐츠 */}
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
