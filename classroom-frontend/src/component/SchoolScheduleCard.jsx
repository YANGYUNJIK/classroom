import { useEffect, useState } from "react";
import axios from "axios";

const dummyData = [
  { id: 1, title: "학사일정 1", date: "2025-07-20" },
  { id: 2, title: "학사일정 2", date: "2025-07-25" },
];

export default function SchoolScheduleCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 백엔드 작업이 끝날 때까지 dummyData 사용
    setSchedule(dummyData);

    // 백엔드 API 호출 예시 (추후 활성화 예정)
    // axios
    //   .get(`/school-schedule?school=${user.school}`)
    //   .then((res) => {
    //     setSchedule(res.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error("API 요청 오류:", err);
    //     setLoading(false);
    //   });
  }, [user.school]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">📅 학사일정</h2>
      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : schedule.length === 0 ? (
        <p className="text-gray-500">등록된 일정이 없습니다.</p>
      ) : (
        schedule.map((item, idx) => (
          <div
            key={idx}
            className="border rounded p-3 mb-3 bg-gray-50 flex justify-between"
          >
            <span className="font-medium">{item.title}</span>
            <span className="text-sm text-gray-600">{item.date}</span>
          </div>
        ))
      )}
    </div>
  );
}
