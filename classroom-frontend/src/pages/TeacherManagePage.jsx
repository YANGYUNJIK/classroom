import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeTableInput from "../component/TimeTableInput";
import EvaluationBoard from "../component/EvaluationBoard";
import LearningBoard from "../component/LearningBoard";
import AttendanceBoard from "../component/AttendanceBoard";
import ClassStatus from "../component/ClassStatus";
import CounselingBoardTeacher from "../component/CounselingBoardTeacher";

export default function TeacherManagePage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ localStorage에서 선택된 메뉴 불러오기
  const savedMenu = localStorage.getItem("selectedMenu") || "시간표 등록";
  const [selectedMenu, setSelectedMenu] = useState(savedMenu);

  const [tab, setTab] = useState("status");

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      alert("접근 권한이 없습니다.");
      navigate("/login");
    }
  }, [navigate, user]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "우리반 현황":
        return <ClassStatus user={user} />;
      case "시간표 등록":
        return <TimeTableInput user={user} />;
      case "출석 현황":
        return <AttendanceBoard user={user} />;
      case "평가 관리":
        return <EvaluationBoard user={user} />;
      case "학습 관리":
        return <LearningBoard user={user} />;
      case "상담 관리":
        return <CounselingBoardTeacher user={user} />;
      default:
        return <div>메뉴를 선택하세요.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 상단: 교사 정보 */}
      <div className="bg-white shadow p-4">
        {/* 제목 + 로그아웃 버튼을 같은 줄, 중앙 정렬 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">교사 관리 페이지</h2>
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

        {/* 교사 정보는 제목 아래에 */}
        <p className="text-sm text-gray-600 mt-1">
          {user?.school} / {user?.name} (
          {user?.grade && user?.classNum
            ? `${user.grade}학년 ${user.classNum}반 / ${user.subject}`
            : user?.subject}
          )
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* 메뉴: 모바일 상단 / 데스크톱 좌측 */}
        <div className="md:w-48 bg-white shadow-md p-2 md:p-4 flex md:flex-col overflow-x-auto md:overflow-visible whitespace-nowrap">
          {[
            "우리반 현황",
            "시간표 등록",
            "출석 현황",
            "평가 관리",
            "학습 관리",
            "상담 관리",
          ].map((menu) => (
            <button
              key={menu}
              className={`px-3 py-2 rounded mb-2 md:mb-2 mr-2 md:mr-0 text-sm ${
                selectedMenu === menu
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => {
                setSelectedMenu(menu);
                localStorage.setItem("selectedMenu", menu);
              }}
            >
              {menu}
            </button>
          ))}
        </div>

        {/* 오른쪽 콘텐츠 */}
        <div className="flex-1 p-4 md:p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
