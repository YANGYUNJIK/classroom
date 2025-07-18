import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TimeTableInput() {
  const getTodayDay = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date().getDay(); // 0~6
    return days[today] || "월";
  };

  const [rows, setRows] = useState([
    { period: "1교시", start: "", end: "", subject: "", dayOfWeek: "월" },
  ]);
  const [allRows, setAllRows] = useState([]);
  const [selectedDay, setSelectedDay] = useState(getTodayDay());
  const [hasTimeTable, setHasTimeTable] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false); // ✅ 추가

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDayClick = (day) => {
    setSelectedDay(day);
    const filtered = allRows.filter((r) => r.dayOfWeek === day);
    setRows(filtered);
  };

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/timetable/${user.id}`);

        const data = res.data;
        setAllRows(data);

        console.log("백엔드 응답:", response.data);

        setHasTimeTable(data.length > 0);

        const filtered = data.filter((r) => r.dayOfWeek === selectedDay);
        setRows(filtered);
      } catch (err) {
        console.error("⛔ 시간표 불러오기 실패", err);
      }
    };

    fetchTimeTable();
  }, [user.id]);

  const addRow = () => {
    const currentDayRows = allRows.filter((r) => r.dayOfWeek === selectedDay);
    const nextPeriod = `${currentDayRows.length + 1}교시`;

    const newRow = {
      period: nextPeriod,
      start: "",
      end: "",
      subject: "",
      dayOfWeek: selectedDay,
    };

    const updated = [...currentDayRows, newRow];
    const newAllRows = allRows
      .filter((r) => r.dayOfWeek !== selectedDay)
      .concat(updated);

    setAllRows(newAllRows);
    setRows(updated);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);

    const updatedAllRows = [...allRows];
    let count = 0;

    for (let i = 0; i < updatedAllRows.length; i++) {
      if (updatedAllRows[i].dayOfWeek === selectedDay) {
        if (count === index) {
          updatedAllRows[i] = {
            ...updatedAllRows[i],
            [field]: value,
          };
          break;
        }
        count++;
      }
    }

    setAllRows(updatedAllRows);
  };

  const removeRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);

    let globalIndex = -1;
    let matchedCount = 0;
    for (let i = 0; i < allRows.length; i++) {
      if (allRows[i].dayOfWeek === selectedDay) {
        if (matchedCount === index) {
          globalIndex = i;
          break;
        }
        matchedCount++;
      }
    }

    if (globalIndex !== -1) {
      const newAllRows = [...allRows];
      newAllRows.splice(globalIndex, 1);

      const reordered = newAllRows.map((row, idx, arr) => {
        if (row.dayOfWeek === selectedDay) {
          const dayRows = arr.filter((r) => r.dayOfWeek === selectedDay);
          let count = 1;
          return arr.map((r) => {
            if (r.dayOfWeek === selectedDay) {
              return { ...r, period: `${count++}교시` };
            }
            return r;
          });
        } else {
          return arr;
        }
      })[0];

      const finalAllRows = Array.isArray(reordered) ? reordered : newAllRows;
      setAllRows(finalAllRows);
      const filtered = finalAllRows.filter((r) => r.dayOfWeek === selectedDay);
      setRows(filtered);
    }
  };

  const handleSubmit = async () => {
    try {
      const cleaned = allRows.map(
        ({ period, subject, start, end, dayOfWeek }) => ({
          period,
          subject,
          start,
          end,
          dayOfWeek,
        })
      );

      const payload = {
        teacherId: user.id,
        timetable: cleaned,
      };

      await axios.post(`${BASE_URL}/api/timetable`, payload);
      alert(hasTimeTable ? "✅ 시간표 수정 완료!" : "✅ 시간표 등록 완료!");
    } catch (err) {
      console.error("시간표 저장 실패:", err);
      alert("시간표 저장 실패");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const dayMap = { 월: [], 화: [], 수: [], 목: [], 금: [] };

      parsed.forEach((row) => {
        const start = row["시작 시간"];
        const end = row["끝 시간"];
        ["월", "화", "수", "목", "금"].forEach((day) => {
          if (row[day]) {
            dayMap[day].push({
              subject: row[day],
              start,
              end,
            });
          }
        });
      });

      const all = Object.entries(dayMap).flatMap(([day, lessons]) =>
        lessons.map((lesson, idx) => ({
          period: `${idx + 1}교시`,
          start: lesson.start,
          end: lesson.end,
          subject: lesson.subject,
          dayOfWeek: day,
        }))
      );

      setAllRows(all);
      setHasTimeTable(all.length > 0);
      const filtered = all.filter((r) => r.dayOfWeek === selectedDay);
      setRows(filtered);
    };

    reader.readAsArrayBuffer(file);
    setShowExcelModal(false); // ✅ 모달 닫기
  };

  const handleExcelClick = () => {
    setShowExcelModal(true);
  };

  return (
    <div className="space-y-4 px-2 sm:px-4">
      <h2 className="text-xl font-bold mb-2">🗓 시간표</h2>

      <div className="flex items-center space-x-2 mb-2">
        {["월", "화", "수", "목", "금"].map((day) => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className={`px-3 py-1 rounded border ${
              selectedDay === day
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto sm:overflow-visible">
        <table className="min-w-[560px] w-full table-auto border">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border px-4 py-2">교시</th>
              <th className="border px-4 py-2">시작 시간</th>
              <th className="border px-4 py-2">끝 시간</th>
              <th className="border px-4 py-2">과목</th>
              <th className="border px-4 py-2">삭제</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-4 py-2 whitespace-nowrap">
                  {row.period}
                </td>
                <td className="border px-2 py-2">
                  <input
                    type="time"
                    value={row.start}
                    onChange={(e) => handleChange(idx, "start", e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="border px-2 py-2">
                  <input
                    type="time"
                    value={row.end}
                    onChange={(e) => handleChange(idx, "end", e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="border px-2 py-2">
                  <input
                    type="text"
                    value={row.subject}
                    onChange={(e) =>
                      handleChange(idx, "subject", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="border px-2 py-2">
                  <button
                    onClick={() => removeRow(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-4 gap-2 mt-4 w-full">
        <button
          onClick={addRow}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-blue-600"
        >
          ➕ 교시 추가
        </button>
        <button
          onClick={handleSubmit}
          className={`w-full sm:w-auto text-white px-4 py-2 rounded text-sm sm:text-base ${
            hasTimeTable
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {hasTimeTable ? "✏️ 수정" : "✅ 제출"}
        </button>
        <button
          onClick={handleExcelClick}
          className="w-full sm:w-auto bg-gray-300 text-black px-4 py-2 rounded text-sm sm:text-base hover:bg-gray-400 text-center"
        >
          📥 엑셀 업로드
        </button>
      </div>

      {showExcelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow space-y-4 w-72">
            <h3 className="text-lg font-semibold">엑셀 등록</h3>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="w-full border px-2 py-1"
            />
            <a
              href="/timetable_example.xlsx"
              download
              className="block text-blue-600 underline text-sm"
            >
              예시 파일 다운로드
            </a>
            <button
              onClick={() => setShowExcelModal(false)}
              className="mt-2 text-gray-600 hover:text-black text-sm"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
