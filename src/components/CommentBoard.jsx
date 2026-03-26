function formatCommentDate(isoDate) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function CommentBoard({ comments, onAddComment, onRemoveComment }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const author = String(formData.get('author') || '').trim();
    const text = String(formData.get('text') || '').trim();

    if (!text) {
      return;
    }

    await onAddComment({
      author,
      text,
    });

    event.currentTarget.reset();
  };

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-card lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Comment
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">메모 / 댓글</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          로컬 저장
        </span>
      </div>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          name="author"
          placeholder="작성자"
        />
        <textarea
          className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          name="text"
          placeholder="남길 메모나 댓글을 입력하세요."
        />
        <button
          className="rounded-2xl bg-slate-950 px-4 py-4 text-base font-semibold text-white"
          type="submit"
        >
          댓글 저장
        </button>
      </form>

      <div className="mt-5 grid gap-3">
        {comments.map((comment) => (
          <article
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            key={comment.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{comment.author}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {formatCommentDate(comment.createdAt)}
                </p>
              </div>
              <button
                className="text-sm font-semibold text-slate-400 transition hover:text-red-500"
                onClick={() => onRemoveComment(comment.id)}
                type="button"
              >
                삭제
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
              {comment.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
