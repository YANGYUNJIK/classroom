import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // const fetchCurrentPeriod = async () => {
  //   const nowTime = dayjs().format("HH:mm");
  //   const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][dayjs().day()];

  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/timetable/current`, {
  //       params: {
  //         school: user.school,
  //         grade: user.grade,
  //         classNum: user.classNum,
  //         dayOfWeek,
  //         time: nowTime,
  //       },
  //     });

  //     setCurrentPeriod(res.data);
  //     setCurrentSubject(res.data.subject || null);
  //     checkAttendance(); // ✅ 현재 교시 확인 후 출석 상태 체크
  //   } catch (err) {
  //     console.error("현재 교시 불러오기 실패", err);
  //   }
  // };

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
      checkAttendance(res.data); // ✅ currentPeriod 바로 전달
    } catch (err) {
      console.error("현재 교시 불러오기 실패", err);
    }
  };

  // const checkAttendance = async () => {
  //   if (!currentPeriod) return;

  //   const loginId = localStorage.getItem("loginId");
  //   const periodNumber = currentPeriod.period.replace(/[^0-9]/g, ""); // "4교시" → "4"

  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/attendance/check`, {
  //       params: {
  //         studentLoginId: loginId,
  //         teacherId: currentPeriod.teacherId,
  //         period: periodNumber,
  //         // dayOfWeek: dayjs().format("ddd"),
  //         dayOfWeek: ["일", "월", "화", "수", "목", "금", "토"][dayjs().day()],
  //         date: dayjs().format("YYYY-MM-DD"),
  //       },
  //     });

  //     if (res.data.status && res.data.status !== "미출석") {
  //       setChecked(true);
  //     }
  //   } catch (err) {
  //     console.error("✅ 출석 상태 확인 실패:", err);
  //   }
  // };

  const checkAttendance = async (periodData) => {
    if (!periodData) return;

    const loginId = localStorage.getItem("loginId");
    const periodNumber = periodData.period.replace(/[^0-9]/g, "");

    try {
      const res = await axios.get(`${BASE_URL}/api/attendance/check`, {
        params: {
          studentLoginId: loginId,
          teacherId: periodData.teacherId,
          period: periodNumber,
          dayOfWeek: ["일", "월", "화", "수", "목", "금", "토"][dayjs().day()],
          date: dayjs().format("YYYY-MM-DD"),
        },
      });

      if (res.data.status && res.data.status !== "미출석") {
        setChecked(true); // ✅ 새로고침해도 출석 상태 유지
      }
    } catch (err) {
      console.error("✅ 출석 상태 확인 실패:", err);
    }
  };

  // const handleAttendance = async () => {
  //   const loginId = localStorage.getItem("loginId");

  //   console.log("🧪 loginId from localStorage:", loginId);

  //   if (!currentPeriod) {
  //     alert("현재 수업 시간이 아닙니다.");
  //     return;
  //   }

  //   try {
  //     const requestData = {
  //       studentLoginId: loginId,
  //       teacherId: currentPeriod.teacherId,
  //       period: currentPeriod.period,
  //       // dayOfWeek: dayjs().format("ddd"),
  //       dayOfWeek: ["일", "월", "화", "수", "목", "금", "토"][dayjs().day()],
  //       date: dayjs().format("YYYY-MM-DD"),
  //       status: "출석",
  //     };

  //     await axios.post(`${BASE_URL}/api/attendance`, requestData);
  //     setChecked(true);
  //     alert("출석 체크 완료!");
  //   } catch (err) {
  //     console.error("출석 체크 실패", err);

  //     if (
  //       err.response &&
  //       err.response.data &&
  //       err.response.data.message?.includes("이미 출석")
  //     ) {
  //       alert("이미 출석 체크하셨습니다!");
  //       setChecked(true);
  //     } else {
  //       alert("출석 체크에 실패했습니다.");
  //     }
  //   }
  // };

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
        dayOfWeek: ["일", "월", "화", "수", "목", "금", "토"][dayjs().day()],
        date: dayjs().format("YYYY-MM-DD"),
        status: "출석",
      };

      await axios.post(`${BASE_URL}/api/attendance`, requestData);
      setChecked(true);
      alert("출석 체크 완료!");
    } catch (err) {
      console.error("출석 체크 실패", err);

      const errorMessage = err.response?.data?.message || "";

      // ✅ 서버 메시지가 "이미 출석 처리되었습니다"인 경우
      if (errorMessage.includes("이미 출석")) {
        alert("이미 출석 체크하셨습니다!");
        setChecked(true);
      } else {
        // ✅ 그 외 오류에 대해서만 실패 메시지
        alert(`출석 체크에 실패했습니다.\n(${errorMessage})`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-6 bg-gray-50">
      {/* 상단 인삿말 */}
      <div className="relative">
        {/* 우측 상단 회원정보 수정 버튼 */}
        <button
          onClick={() => navigate("/student/edit")}
          className="absolute top-2 right-2 text-xs text-blue-600 underline hover:text-blue-800"
        >
          회원정보 수정
        </button>

        <h1 className="text-2xl font-bold mb-2 text-blue-600">
          🎓 학생 메인 페이지
        </h1>

        {/* 날짜 표시 */}
        <p className="text-sm text-gray-500 mb-2">
          📅 {dayjs().format("YYYY년 MM월 DD일 (dd)")}
        </p>

        {/* 학생 정보 박스 */}
        <div className="bg-white shadow p-4 rounded-lg mb-4">
          <p className="text-base mb-1">
            안녕하세요,{" "}
            <span className="font-semibold text-gray-800">{user?.name}</span>님!
          </p>
          <p className="text-sm text-gray-600">
            학교: <b>{user?.school}</b> / 학년: <b>{user?.grade}</b> / 반:{" "}
            <b>{user?.classNum}</b> / 번호: <b>{user?.number}</b>
          </p>
        </div>

        {/* 현재 수업 안내 박스 */}
        <div className="bg-white border-l-4 border-green-500 shadow p-3 rounded-md text-sm flex justify-between items-center">
          {currentPeriod ? (
            <>
              <p className="text-green-700 font-medium">
                현재 수업: <b>{currentPeriod.period}</b> (
                {currentSubject || "쉬는 시간"})
              </p>
              {checked && (
                <span className="text-green-600 font-semibold text-sm flex items-center">
                  ✅ 출석 완료
                </span>
              )}
            </>
          ) : (
            <p className="text-gray-500">
              현재 수업 중인 교시가 없습니다. 다음 수업을 기다려주세요!
            </p>
          )}
        </div>

        {/* GPT 학습 코칭 박스 */}
        {aiAdvice && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md shadow text-sm">
            <p className="font-semibold text-yellow-900">🤖📚 AI 학습 코칭</p>

            {/* 평가 정보 */}
            <div className="mt-2 space-y-1 text-gray-700">
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

            {loadingAdvice ? (
              <p className="mt-3 text-gray-500">코칭 메시지를 생성 중...</p>
            ) : (
              <p className="mt-3 text-gray-800 whitespace-pre-line">
                {aiAdvice.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="mt-10 flex flex-col space-y-4">
        <button
          className={`w-full py-3 text-sm font-semibold rounded ${
            checked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
          onClick={handleAttendance}
          disabled={checked}
        >
          {checked ? "출석 완료" : "출석하기"}
        </button>

        <button
          className="w-full py-3 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          onClick={() => {
            navigate("/student/manage");
          }}
        >
          📖 들어가기 (평가·학습 안내)
        </button>

        <button
          className="w-full py-3 text-sm rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
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
