import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function AttendanceBoard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [timeTable, setTimeTable] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const today = dayjs().format("YYYY-MM-DD");
  const todayDayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
    dayjs().day()
  ];

  // ✅ 시간표 불러오기
  useEffect(() => {
    const fetchTimeTable = async () => {
      const res = await axios.get(
        `http://localhost:8080/api/timetable/${user.id}`
      );
      const todayRows = res.data.filter(
        (row) => row.dayOfWeek === todayDayOfWeek
      );
      setTimeTable(todayRows);
    };

    fetchTimeTable();
  }, [user.id, todayDayOfWeek]);

  // ✅ 교시별 출석 현황 불러오기
  useEffect(() => {
    const fetchAttendance = async () => {
      const result = {};
      for (let row of timeTable) {
        const res = await axios.get(
          `http://localhost:8080/api/attendance/${user.id}/today`,
          { params: { period: row.period } }
        );
        result[row.period] = res.data;
      }
      setAttendanceData(result);
    };

    if (timeTable.length > 0) {
      fetchAttendance();
    }
  }, [timeTable, user.id]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">
        📋 {todayDayOfWeek}요일 ({today}) 출석 현황
      </h2>

      <div className="space-y-4">
        {timeTable.map((row) => (
          <div key={row.period} className="border p-4 rounded shadow">
            <h3 className="font-semibold">
              {row.period} | {row.subject} ({row.start} ~ {row.end})
            </h3>

            <p className="text-sm text-gray-600">
              출석 인원:{" "}
              {
                (attendanceData[row.period] || []).filter(
                  (a) => a.status === "출석"
                ).length
              }
              명
            </p>

            <ul className="list-disc ml-5 mt-2">
              {(attendanceData[row.period] || []).map((a) => (
                <li key={a.studentId}>
                  {a.studentName} - {a.status}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
