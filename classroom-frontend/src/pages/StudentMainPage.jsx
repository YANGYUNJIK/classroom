import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

export default function StudentMainPage() {
  const navigate = useNavigate();
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [checked, setChecked] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    // 최초 1회
    fetchCurrentPeriod();

    // 1분마다 현재 교시 정보 업데이트
    const interval = setInterval(() => {
      fetchCurrentPeriod();
    }, 180000); // 1분 = 60,000ms

    // 페이지 벗어날 때 interval 제거
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentPeriod = async () => {
    try {
      const todayDayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
        dayjs().day()
      ];
      const now = dayjs().format("HH:mm");

      const res = await axios.get(
        `http://localhost:8080/api/timetable/period`,
        {
          params: {
            school: user.school,
            grade: Number(user.grade), // 👈 꼭 숫자 변환
            classNum: Number(user.classNum), // 👈 꼭 숫자 변환
            dayOfWeek: todayDayOfWeek,
            nowTime: now,
          },
        }
      );

      setCurrentPeriod(res.data);
    } catch (err) {
      console.error("현재 교시 불러오기 실패", err);
    }
  };

  const handleAttendance = async () => {
    if (!currentPeriod) {
      alert("현재 수업 시간이 아닙니다.");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/attendance`, {
        studentLoginId: user.loginId,
        teacherId: currentPeriod.teacherId,
        period: currentPeriod.period,
        dayOfWeek: dayjs().format("ddd"), // 월, 화, 수 등
        date: dayjs().format("YYYY-MM-DD"),
      });
      setChecked(true);
      alert("출석 체크 완료!");
    } catch (err) {
      console.error("출석 체크 실패", err);
      alert("출석 체크에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold mb-4">학생 메인 페이지</h1>
        <p className="text-lg">
          안녕하세요, <b>{user?.name}</b>님!
        </p>
        <p className="text-sm mt-2 text-gray-700">
          학교: {user?.school} <br />
          학년: {user?.grade} / 반: {user?.classNum} / 번호: {user?.number}
        </p>

        {currentPeriod ? (
          <div className="mt-4 text-green-700 font-semibold">
            현재 수업: {currentPeriod.period}교시 ({currentPeriod.subject})
          </div>
        ) : (
          <div className="mt-4 text-gray-500">
            현재 수업 중인 교시가 없습니다.
          </div>
        )}
      </div>

      <div className="w-full flex justify-center mt-8 space-x-4">
        <button
          className={`px-6 py-2 rounded text-white ${
            checked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={handleAttendance}
          disabled={checked}
        >
          {checked ? "출석 완료" : "출석하기"}
        </button>

        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/student/manage"); // ✅ 절대 경로로 수정
          }}
        >
          들어가기
        </button>

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
