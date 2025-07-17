import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function CounselingBoardTeacher() {
  const [counselings, setCounselings] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchCounselings = async () => {
    const res = await axios.get(`${BASE_URL}/api/counselings/all`);
    setCounselings(res.data);
  };

  const handleAccept = async (id) => {
    await axios.post(`${BASE_URL}/api/counselings/${id}/accept`);
    fetchCounselings();
  };

  const handleReject = async (id) => {
    if (!reason.trim()) return alert("거절 사유를 입력하세요.");
    await axios.post(`${BASE_URL}/api/counselings/${id}/reject`, reason, {
      headers: { "Content-Type": "application/json" },
    });
    setRejectingId(null);
    setReason("");
    fetchCounselings();
  };

  useEffect(() => {
    fetchCounselings();
  }, []);

  return (
    <div className="space-y-4">
      {counselings.map((item) => (
        <div key={item.id} className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">
            [{item.category}] {item.applicant} -{" "}
            {dayjs(item.date).format("YYYY-MM-DD")}
          </p>
          <p className="mt-1">{item.content}</p>
          <p className="mt-2 text-sm font-semibold">
            상태: {item.status}
            {item.status === "거절됨" && (
              <span className="text-red-500"> - {item.rejectionReason}</span>
            )}
          </p>

          {item.status === "신청됨" && (
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
        </div>
      ))}
    </div>
  );
}
