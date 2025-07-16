import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = "http://localhost:8080";

export default function StudentMainPage() {
  const navigate = useNavigate();
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [checked, setChecked] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    fetchCurrentPeriod();

    const interval = setInterval(() => {
      fetchCurrentPeriod();
    }, 180000); // 3분마다 갱신

    return () => clearInterval(interval);
  }, []);

  const fetchCurrentPeriod = async () => {
    const nowTime = dayjs().format("HH:mm");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][dayjs().day()];

    try {
      const res = await axios.get(`${BASE_URL}/api/timetable/current`, {
        params: {
          school: user.school,
          grade: user.grade,
          classNum: user.classNum,
          dayOfWeek,
          time: nowTime,
        },
      });

      setCurrentPeriod(res.data);
      setCurrentSubject(res.data.subject || null);
      checkAttendance(); // ✅ 현재 교시 확인 후 출석 상태 체크
    } catch (err) {
      console.error("현재 교시 불러오기 실패", err);
    }
  };

  const checkAttendance = async () => {
    if (!currentPeriod) return;

    const loginId = localStorage.getItem("loginId");
    const periodNumber = currentPeriod.period.replace(/[^0-9]/g, ""); // "4교시" → "4"

    try {
      const res = await axios.get(`${BASE_URL}/api/attendance/check`, {
        params: {
          studentLoginId: loginId,
          teacherId: currentPeriod.teacherId,
          period: periodNumber,
          dayOfWeek: dayjs().format("ddd"),
          date: dayjs().format("YYYY-MM-DD"),
        },
      });

      if (res.data.status && res.data.status !== "미출석") {
        setChecked(true);
      }
    } catch (err) {
      console.error("✅ 출석 상태 확인 실패:", err);
    }
  };

  const handleAttendance = async () => {
    const loginId = localStorage.getItem("loginId");

    if (!currentPeriod) {
      alert("현재 수업 시간이 아닙니다.");
      return;
    }

    try {
      const requestData = {
        studentLoginId: loginId,
        teacherId: currentPeriod.teacherId,
        period: currentPeriod.period,
        dayOfWeek: dayjs().format("ddd"),
        date: dayjs().format("YYYY-MM-DD"),
        status: "출석",
      };

      await axios.post(`${BASE_URL}/api/attendance`, requestData);
      setChecked(true);
      alert("출석 체크 완료!");
    } catch (err) {
      console.error("출석 체크 실패", err);

      if (
        err.response &&
        err.response.data &&
        err.response.data.message?.includes("이미 출석")
      ) {
        alert("이미 출석 체크하셨습니다!");
        setChecked(true);
      } else {
        alert("출석 체크에 실패했습니다.");
      }
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
            현재 수업: {currentPeriod.period} ({currentSubject})
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
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/student/manage");
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
