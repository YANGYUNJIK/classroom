import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function TimeTableInput() {
  const [rows, setRows] = useState([
    { period: "1교시", start: "", end: "", subject: "" },
  ]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ 시간표 불러오기
  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/timetable/${user.id}`
        );
        const data = res.data;

        const formatted = data.map((item) => ({
          period: item.period,
          subject: item.subject,
          start: item.start || "",
          end: item.end || "",
        }));

        setRows(formatted);
      } catch (err) {
        console.error("⛔ 시간표 불러오기 실패", err);
      }
    };

    fetchTimeTable();
  }, [user.id]);

  const addRow = () => {
    const nextPeriod = `${rows.length + 1}교시`;
    setRows([...rows, { period: nextPeriod, start: "", end: "", subject: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        teacherId: user.id,
        timetable: rows.map((row) => ({
          period: row.period,
          subject: row.subject,
          start: row.start,
          end: row.end,
        })),
      };

      await axios.post("http://localhost:8080/api/timetable", payload);
      alert("✅ 시간표 등록 성공!");
    } catch (err) {
      console.error("시간표 등록 실패:", err);
      alert("시간표 등록 실패");
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
      const parsed = XLSX.utils.sheet_to_json(ws);

      const newRows = parsed.map((row, idx) => ({
        period: row["교시"] || `${idx + 1}교시`,
        start: row["시작 시간"] || "",
        end: row["끝 시간"] || "",
        subject: row["과목"] || "",
      }));
      setRows(newRows);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">🗓 시간표 직접 입력</h2>
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

      <div className="flex space-x-4">
        <button
          onClick={addRow}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ 교시 추가
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ✅ 제출
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
