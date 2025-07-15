import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function TimeTableInput() {
  const [rows, setRows] = useState([
    { period: "1교시", start: "", end: "", subject: "", dayOfWeek: "월" },
  ]);
  const [allRows, setAllRows] = useState([]);
  const [selectedDay, setSelectedDay] = useState("월");
  const [hasTimeTable, setHasTimeTable] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ 요일 클릭 시 해당 요일 시간표만 표시
  const handleDayClick = (day) => {
    setSelectedDay(day);
    const filtered = allRows.filter((r) => r.dayOfWeek === day);
    setRows(filtered);
  };

  // ✅ 시간표 불러오기 (전체 요일 포함)
  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/timetable/${user.id}`
        );
        const data = res.data;

        setAllRows(data);
        setHasTimeTable(data.length > 0);

        const filtered = data.filter((r) => r.dayOfWeek === selectedDay);
        setRows(filtered);
      } catch (err) {
        console.error("⛔ 시간표 불러오기 실패", err);
      }
    };

    fetchTimeTable();
  }, [user.id]);

  // ✅ 교시 추가
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

  // ✅ 셀 수정
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);

    // 정확히 현재 selectedDay에 해당하는 index 위치를 찾아 allRows도 수정
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

  // ✅ 시간표 저장 (등록 or 수정 모두 포함)
  const handleSubmit = async () => {
    try {
      // id나 teacherId 없이 전송
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

      console.log("📦 전송할 시간표 payload:", payload);

      await axios.post("http://localhost:8080/api/timetable", payload);
      alert(hasTimeTable ? "✅ 시간표 수정 완료!" : "✅ 시간표 등록 완료!");
    } catch (err) {
      console.error("시간표 저장 실패:", err);
      alert("시간표 저장 실패");
    }
  };

  // ✅ 엑셀 업로드
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

      // 전체 시간표 구조화
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
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">🗓 시간표</h2>

      {/* 요일 선택 */}
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

      {/* 시간표 테이블 */}
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border px-4 py-2">교시</th>
            <th className="border px-4 py-2">시작 시간</th>
            <th className="border px-4 py-2">끝 시간</th>
            <th className="border px-4 py-2">과목</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{row.period}</td>
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
                  onChange={(e) => handleChange(idx, "subject", e.target.value)}
                  className="w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 버튼들 */}
      <div className="flex space-x-4">
        <button
          onClick={addRow}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ 교시 추가
        </button>
        <button
          onClick={handleSubmit}
          className={`${
            hasTimeTable
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white px-4 py-2 rounded`}
        >
          {hasTimeTable ? "✏️ 수정" : "✅ 제출"}
        </button>
        <label className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer">
          📥 엑셀 업로드
          <input
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
}
