// import { useEffect, useState } from "react";
// import axios from "axios";
// import dayjs from "dayjs";

// export default function AttendanceBoard() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [timeTable, setTimeTable] = useState([]);
//   const [attendanceData, setAttendanceData] = useState({});
//   const [selectedPeriod, setSelectedPeriod] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const today = dayjs().format("YYYY-MM-DD");
//   const todayDayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
//     dayjs().day()
//   ];

//   // ✅ 시간표 불러오기
//   useEffect(() => {
//     const fetchTimeTable = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:8080/api/timetable/${user.id}`
//         );

//         const todayRows = res.data.filter(
//           (row) => row.dayOfWeek === todayDayOfWeek
//         );

//         setTimeTable(todayRows);
//       } catch (err) {
//         console.error("⛔ 시간표 불러오기 실패:", err);
//       }
//     };

//     fetchTimeTable();
//   }, [user.id, todayDayOfWeek]);

//   // ✅ 교시별 출석 현황 불러오기
//   useEffect(() => {
//     const fetchAttendance = async () => {
//       const result = {};
//       for (let row of timeTable) {
//         try {
//           const res = await axios.get(
//             `http://localhost:8080/api/attendance/${user.id}/today`,
//             { params: { period: row.period } }
//           );
//           result[row.period] = res.data;
//         } catch (err) {
//           console.error(`⛔ ${row.period} 출석 데이터 불러오기 실패:`, err);
//         }
//       }
//       setAttendanceData(result);
//     };

//     if (timeTable.length > 0) {
//       fetchAttendance();
//     }
//   }, [timeTable, user.id]);

//   return (
//     <div className="p-4 space-y-6">
//       <h2 className="text-xl font-bold">
//         📋 {todayDayOfWeek}요일 ({today}) 출석 현황
//       </h2>

//       <div className="space-y-4">
//         {timeTable.length === 0 && (
//           <p className="text-gray-500">오늘 등록된 시간표가 없습니다.</p>
//         )}

//         {timeTable.map((row) => (
//           <div
//             key={row.period}
//             onClick={() => {
//               setSelectedPeriod(row.period);
//               setShowModal(true);
//             }}
//             className="bg-white border-l-4 border-green-500 p-4 shadow rounded transition transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
//           >
//             <h3 className="font-semibold text-lg mb-1">
//               {row.period} | {row.subject} ({row.start} ~ {row.end})
//             </h3>

//             <p className="text-sm text-gray-600">
//               출석 인원:{" "}
//               <b className="text-green-700">
//                 {
//                   (attendanceData[row.period] || []).filter(
//                     (a) => a.status === "출석"
//                   ).length
//                 }
//                 명
//               </b>{" "}
//               (클릭 시 보기)
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* ✅ 출석 명단 모달 */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
//             <h3 className="text-lg font-bold mb-4">
//               {selectedPeriod}교시 출석 명단
//             </h3>

//             <ul className="list-disc pl-5 space-y-1 max-h-60 overflow-y-auto">
//               {(attendanceData[selectedPeriod] || [])
//                 .filter((a) => a.status === "출석")
//                 .sort((a, b) => a.studentNumber - b.studentNumber)
//                 .map((a) => (
//                   <li key={a.studentId}>
//                     {a.studentNumber}번 {a.studentName} - {a.status}
//                   </li>
//                 ))}
//             </ul>

//             <button
//               onClick={() => setShowModal(false)}
//               className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AttendanceBoard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [timeTable, setTimeTable] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");
  const todayDayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
    dayjs().day()
  ];

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/timetable/${user.id}`);
        const todayRows = res.data.filter(
          (row) => row.dayOfWeek === todayDayOfWeek
        );
        setTimeTable(todayRows);
      } catch (err) {
        console.error("⛔ 시간표 불러오기 실패:", err);
      }
    };

    fetchTimeTable();
  }, [user.id, todayDayOfWeek]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const result = {};
      for (let row of timeTable) {
        try {
          const res = await axios.get(
            `${BASE_URL}/api/attendance/${user.id}/today`,
            { params: { period: row.period } }
          );
          result[row.period] = res.data;
        } catch (err) {
          console.error(`⛔ ${row.period} 출석 데이터 불러오기 실패:`, err);
        }
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
        {timeTable.length === 0 && (
          <p className="text-gray-500">오늘 등록된 시간표가 없습니다.</p>
        )}

        {timeTable.map((row) => (
          <div
            key={row.period}
            onClick={() => {
              setSelectedPeriod(row.period);
              setShowModal(true);
            }}
            className="bg-white border-l-4 border-green-500 p-4 shadow rounded transition transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          >
            <h3 className="font-semibold text-lg mb-1">
              {row.period} | {row.subject} ({row.start} ~ {row.end})
            </h3>
            <p className="text-sm text-gray-600">
              출석 인원:{" "}
              <b className="text-green-700">
                {
                  (attendanceData[row.period] || []).filter(
                    (a) => a.status === "출석"
                  ).length
                }
                명
              </b>{" "}
              (클릭 시 보기)
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {selectedPeriod}교시 출석 명단
            </h3>
            <ul className="list-disc pl-5 space-y-1 max-h-60 overflow-y-auto">
              {(attendanceData[selectedPeriod] || [])
                .filter((a) => a.status === "출석")
                .sort((a, b) => a.studentNumber - b.studentNumber)
                .map((a) => (
                  <li key={a.studentId}>
                    {a.studentNumber}번 {a.studentName} - {a.status}
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
