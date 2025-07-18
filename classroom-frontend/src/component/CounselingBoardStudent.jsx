import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function CounselingBoardStudent() {
  const [counselings, setCounselings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    category: "학교생활",
    content: "",
    hopeTime: "",
  });
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const MAX_VISIBLE = 3;

  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchCounselings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/counselings/student`, {
        params: { applicant: user?.loginId },
      });

      if (Array.isArray(res.data)) {
        const sorted = [...res.data].sort((a, b) =>
          dayjs(a.hopeTime).isAfter(dayjs(b.hopeTime)) ? 1 : -1
        );
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
      setForm({ category: "학교생활", content: "", hopeTime: "" });
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

  // 필터링 + 더보기 적용
  const filtered = counselings.filter((c) =>
    filter === "all" ? true : c.status === filter
  );
  const visible = showAll ? filtered : filtered.slice(0, MAX_VISIBLE);

  return (
    <div className="mt-10">
      {/* 제목 + 버튼 */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">🫂 상담 목록</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white text-sm px-3 py-1.5 rounded"
        >
          상담 신청
        </button>
      </div>

      {/* 필터 버튼 */}
      <div className="flex overflow-x-auto space-x-2 mb-3 pb-1">
        {["all", "허락됨", "거절됨", "완료됨"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setShowAll(false);
            }}
            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
              filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {status === "all" ? "전체" : status}
          </button>
        ))}
      </div>

      {/* 상담 카드 리스트 */}
      <div className="flex flex-col space-y-3">
        {visible.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl shadow-sm border transition ${
              item.hopeTime && dayjs(item.hopeTime).isBefore(dayjs())
                ? "bg-gray-100 text-gray-400"
                : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                [{item.category}] {dayjs(item.date).format("YYYY-MM-DD")}
              </p>
              <span className="text-xs font-semibold">
                {item.status === "허락됨" && (
                  <span className="text-green-600">✅ 허락됨</span>
                )}
                {item.status === "거절됨" && (
                  <span className="text-red-500">
                    ❌ 거절됨{" "}
                    {item.rejectionReason && `- ${item.rejectionReason}`}
                  </span>
                )}
                {item.status === "완료됨" && (
                  <span className="text-gray-500">✔️ 완료됨</span>
                )}
                {!["허락됨", "거절됨", "완료됨"].includes(item.status) && (
                  <span className="text-blue-500">🕐 {item.status}</span>
                )}
              </span>
            </div>

            <p className="mt-2 text-sm whitespace-pre-wrap">{item.content}</p>

            {item.hopeTime && (
              <div className="mt-2 text-sm text-gray-600">
                상담 희망 시간:{" "}
                {dayjs(item.hopeTime).format("YYYY-MM-DD HH:mm")}
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                className="text-xs text-red-500 underline"
                onClick={() => handleDelete(item.id)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 / 접기 버튼 */}
      {filtered.length > MAX_VISIBLE && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm text-blue-500 underline"
          >
            {showAll ? "접기" : "더보기"}
          </button>
        </div>
      )}

      {/* 모달은 그대로 유지 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-[90%] max-w-sm">
            <h2 className="text-lg font-bold mb-4">상담 신청</h2>

            <label className="block mb-2 text-sm">카테고리</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded mb-4 text-sm"
            >
              <option>학교생활</option>
              <option>학습</option>
              <option>평가</option>
            </select>

            <label className="block mb-2 text-sm">상담 내용</label>
            <textarea
              rows={4}
              className="w-full border px-3 py-2 rounded mb-4 text-sm"
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
            />

            <label className="block mb-2 text-sm">상담 희망 시간</label>
            <input
              type="datetime-local"
              className="w-full border px-3 py-2 rounded mb-4 text-sm"
              value={form.hopeTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, hopeTime: e.target.value }))
              }
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded text-sm"
                onClick={() => setModalOpen(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
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
