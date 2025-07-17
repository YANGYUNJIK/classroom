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
  const [aiAdvice, setAiAdvice] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loadingAdvice, setLoadingAdvice] = useState(true);

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

  // ✅ GPT 메시지 받아오기
  useEffect(() => {
    const fetchAiAdvice = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/evaluations/coaching`, {
          params: {
            school: user.school,
            grade: user.grade,
            classNum: user.classNum,
          },
        });

        setAiAdvice(res.data);
      } catch (err) {
        console.error("GPT 호출 중 오류 발생", err);
        setAiAdvice({ message: "AI 코칭 메시지를 불러오는 데 실패했습니다." });
      } finally {
        setLoadingAdvice(false);
      }
    };

    fetchAiAdvice();
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
    <div className="min-h-screen flex flex-col justify-between px-6 py-10 bg-gray-50">
      {/* 상단 인삿말 */}
      <div className="relative">
        {/* 우측 상단 회원정보 수정 버튼 */}
        <button
          onClick={() => navigate("/student/edit")}
          className="absolute top-0 right-0 text-sm text-blue-600 underline hover:text-blue-800"
        >
          회원정보 수정
        </button>

        <h1 className="text-3xl font-bold mb-2 text-blue-600">
          🎓 학생 메인 페이지
        </h1>
        <p className="text-lg mb-2">
          안녕하세요,{" "}
          <span className="font-semibold text-gray-800">{user?.name}</span>님!
        </p>
        <div className="text-sm text-gray-600 mb-4">
          학교: <b>{user?.school}</b> / 학년: <b>{user?.grade}</b> / 반:{" "}
          <b>{user?.classNum}</b> / 번호: <b>{user?.number}</b>
        </div>

        {/* 현재 수업 안내 박스 */}
        <div className="bg-white border-l-4 border-green-500 shadow p-4 rounded">
          {currentPeriod ? (
            <p className="text-green-700 font-medium">
              현재 수업: <b>{currentPeriod.period}</b> (
              {currentSubject || "쉬는 시간"})
            </p>
          ) : (
            <p className="text-gray-500">현재 수업 중인 교시가 없습니다.</p>
          )}
        </div>

        {/* ✅ GPT 학습 코칭 박스 */}
        {loadingAdvice ? (
          <div className="mt-4 text-sm text-gray-500">
            AI 코칭 메시지를 불러오는 중...
          </div>
        ) : (
          aiAdvice && (
            <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
              <p className="font-semibold text-yellow-800">📚 AI 학습 코칭</p>

              {/* 📌 평가 정보 출력 */}
              <div className="text-sm text-gray-700 mt-2 space-y-1">
                {aiAdvice.title && (
                  <p>
                    <b>제목:</b> {aiAdvice.title}
                  </p>
                )}
                {aiAdvice.subject && (
                  <p>
                    <b>과목:</b> {aiAdvice.subject}
                  </p>
                )}
                {aiAdvice.scope && (
                  <p>
                    <b>범위:</b> {aiAdvice.scope}
                  </p>
                )}
                {aiAdvice.content && (
                  <p>
                    <b>내용:</b> {aiAdvice.content}
                  </p>
                )}
              </div>

              {/* ✨ GPT 메시지 */}
              <p className="text-sm text-gray-800 mt-3 whitespace-pre-line">
                {aiAdvice.message}
              </p>
            </div>
          )
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="mt-10 flex flex-col space-y-4">
        <button
          className={`w-full py-3 rounded text-white font-semibold ${
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
          className="w-full py-3 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          onClick={() => {
            navigate("/student/manage");
          }}
        >
          들어가기 (평가·학습 안내)
        </button>

        <button
          className="w-full py-3 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
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
