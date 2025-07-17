import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function CounselingBoardStudent() {
  const [counselings, setCounselings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ category: "학교생활", content: "" });

  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

  const fetchCounselings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/counselings/student`, {
        params: { applicant: user?.loginId },
      });

      if (Array.isArray(res.data)) {
        setCounselings(res.data);
      } else {
        console.error("상담 데이터가 배열이 아닙니다:", res.data);
        setCounselings([]);
      }
    } catch (err) {
      console.error("❌ 상담 데이터 불러오기 실패", err);
    }
  };

  const handleSubmit = async () => {
    if (!form.content.trim()) return alert("내용을 입력하세요.");

    try {
      await axios.post(`${BASE_URL}/api/counselings`, {
        ...form,
        applicant: user?.loginId,
      });

      alert("상담 신청이 완료되었습니다!"); // ✅ 여기 추가

      setForm({ category: "학교생활", content: "" });
      setModalOpen(false);
      fetchCounselings();
    } catch (err) {
      console.error("❌ 상담 신청 실패", err);
      alert("상담 신청 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchCounselings();
  }, []);

  return (
    <div>
      {/* 버튼 */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          상담 신청
        </button>
      </div>

      {/* 상담 카드 목록 */}
      <div className="space-y-3">
        {counselings.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">
              [{item.category}] {dayjs(item.date).format("YYYY-MM-DD")}
            </p>
            <p className="mt-1">{item.content}</p>
            <p className="mt-2 text-sm font-semibold">
              상태:{" "}
              {item.status === "거절됨" ? (
                <span className="text-red-500">
                  거절됨 - {item.rejectionReason}
                </span>
              ) : (
                item.status
              )}
            </p>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">상담 신청</h2>
            <label className="block mb-2 text-sm">카테고리</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option>학교생활</option>
              <option>학습</option>
              <option>평가</option>
            </select>

            <label className="block mb-2 text-sm">상담 내용</label>
            <textarea
              rows={4}
              className="w-full border px-3 py-2 rounded mb-4"
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setModalOpen(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSubmit}
              >
                제출
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
