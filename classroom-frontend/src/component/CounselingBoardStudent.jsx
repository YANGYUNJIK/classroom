import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function CounselingBoardStudent() {
  const [counselings, setCounselings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    category: "학교생활",
    content: "",
    hopeTime: "", // 상담 희망 시간
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

  const fetchCounselings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/counselings/student`, {
        params: { applicant: user?.loginId },
      });

      if (Array.isArray(res.data)) {
        // hopeTime 기준 정렬 (오름차순)
        const sorted = [...res.data].sort((a, b) => {
          return dayjs(a.hopeTime).isAfter(dayjs(b.hopeTime)) ? 1 : -1;
        });
        setCounselings(sorted);
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

      alert("상담 신청이 완료되었습니다!");

      // 초기화
      setForm({
        category: "학교생활",
        content: "",
        hopeTime: "",
      });
      setModalOpen(false);
      fetchCounselings();
    } catch (err) {
      console.error("❌ 상담 신청 실패", err);
      alert("상담 신청 중 문제가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/counselings/${id}`);
      fetchCounselings();
    } catch (err) {
      console.error("❌ 상담 삭제 실패", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchCounselings();
  }, []);

  return (
    <div>
      {/* 상담 신청 버튼 */}
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
          <div
            key={item.id}
            className={`p-4 rounded shadow ${
              item.hopeTime && dayjs(item.hopeTime).isBefore(dayjs())
                ? "bg-gray-100 text-gray-500"
                : "bg-white"
            }`}
          >
            <p className="text-sm text-gray-500">
              [{item.category}] {dayjs(item.date).format("YYYY-MM-DD")}
            </p>
            <p className="mt-1">{item.content}</p>
            <p className="text-sm text-gray-600">
              희망 시간:{" "}
              {item.hopeTime
                ? dayjs(item.hopeTime).format("YYYY-MM-DD HH:mm")
                : "없음"}
            </p>
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

            {/* 삭제 버튼 */}
            <div className="mt-2 flex justify-end">
              <button
                className="text-sm text-red-500 underline"
                onClick={() => handleDelete(item.id)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 상담 신청 모달 */}
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

            <label className="block mb-2 text-sm">상담 희망 시간</label>
            <input
              type="datetime-local"
              className="w-full border px-3 py-2 rounded mb-4"
              value={form.hopeTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, hopeTime: e.target.value }))
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
