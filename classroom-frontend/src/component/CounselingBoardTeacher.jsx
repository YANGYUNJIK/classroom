import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function CounselingBoardTeacher() {
  const [counselings, setCounselings] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");
  const [filter, setFilter] = useState("전체");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCounselings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/counselings/teacher`, {
        params: {
          school: user.school,
          grade: user.grade,
          classNum: user.classNum,
        },
      });

      const sorted = res.data.sort((a, b) => {
        if (!a.hopeTime) return 1;
        if (!b.hopeTime) return -1;
        return new Date(a.hopeTime) - new Date(b.hopeTime);
      });

      setCounselings(sorted);
    } catch (err) {
      console.error("상담 데이터 불러오기 실패", err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/counselings/${id}`, {
        status: "허락됨",
      });
      fetchCounselings();
    } catch (err) {
      console.error("허락 실패", err);
    }
  };

  const handleReject = async (id) => {
    if (!reason.trim()) return alert("거절 사유를 입력하세요.");
    try {
      await axios.put(`${BASE_URL}/api/counselings/${id}`, {
        status: "거절됨",
        rejectionReason: reason,
      });
      setRejectingId(null);
      setReason("");
      fetchCounselings();
    } catch (err) {
      console.error("거절 실패", err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/counselings/${id}`, {
        status: "완료됨",
      });
      fetchCounselings();
    } catch (err) {
      console.error("상담 완료 처리 실패", err);
    }
  };

  useEffect(() => {
    fetchCounselings();
  }, []);

  const today = dayjs().format("YYYY-MM-DD");
  const filtered = counselings.filter((c) =>
    filter === "전체" ? true : dayjs(c.hopeTime).format("YYYY-MM-DD") === today
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("전체")}
          className={`px-3 py-1 rounded ${
            filter === "전체" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("오늘")}
          className={`px-3 py-1 rounded ${
            filter === "오늘" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          오늘
        </button>
      </div>

      {filtered.map((item) => (
        <div key={item.id} className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">
            [{item.category}] {item.applicantName} -{" "}
            {dayjs(item.date).format("YYYY-MM-DD")}
          </p>
          <p className="mt-1">{item.content}</p>
          <p className="text-sm text-gray-600 mt-1">
            상담 희망 시간:{" "}
            {item.hopeTime
              ? dayjs(item.hopeTime).format("YYYY-MM-DD HH:mm")
              : "없음"}
          </p>
          <p className="mt-2 text-sm font-semibold">
            상태: {item.status}
            {item.status === "거절됨" && (
              <span className="text-red-500"> - {item.rejectionReason}</span>
            )}
          </p>

          {item.status === "대기중" && (
            <div className="mt-2 flex flex-col gap-2">
              {rejectingId === item.id ? (
                <>
                  <input
                    type="text"
                    placeholder="거절 사유 입력"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="border px-3 py-1 rounded w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleReject(item.id)}
                    >
                      거절 확정
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-300 rounded"
                      onClick={() => setRejectingId(null)}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded"
                    onClick={() => handleAccept(item.id)}
                  >
                    허락
                  </button>
                  <button
                    className="px-3 py-1 bg-red-400 text-white rounded"
                    onClick={() => setRejectingId(item.id)}
                  >
                    거절
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ✅ 허락됨 상태일 때 상담 완료 버튼 */}
          {item.status === "허락됨" && (
            <button
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => handleComplete(item.id)}
            >
              상담 완료
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
