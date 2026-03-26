function formatFeedbackDate(isoDate) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function FeedbackBoard({ feedbacks, onAddFeedback, onRemoveFeedback }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const author = String(formData.get('author') || '').trim();
    const department = String(formData.get('department') || '').trim();
    const text = String(formData.get('text') || '').trim();

    if (!text) {
      return;
    }

    await onAddFeedback({
      author,
      department,
      text,
    });

    event.currentTarget.reset();
  };

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-card lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Feedback
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">본사 전달 의견함</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          전달 대기 보관
        </span>
      </div>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          name="author"
          placeholder="작성자"
        />
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          name="department"
          placeholder="부서 또는 소속"
        />
        <textarea
          className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          name="text"
          placeholder="본사에 전달할 의견이나 개선 요청을 입력하세요."
        />
        <button
          className="rounded-2xl bg-slate-950 px-4 py-4 text-base font-semibold text-white"
          type="submit"
        >
          본사 전달함에 저장
        </button>
      </form>

      <div className="mt-5 grid gap-3">
        {feedbacks.map((feedback) => (
          <article
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            key={feedback.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{feedback.author}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {feedback.department} · {formatFeedbackDate(feedback.createdAt)}
                </p>
              </div>
              <button
                className="text-sm font-semibold text-slate-400 transition hover:text-red-500"
                onClick={() => onRemoveFeedback(feedback.id)}
                type="button"
              >
                삭제
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
              {feedback.text}
            </p>
            <div className="mt-3 w-fit rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              상태: 전달 대기
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
