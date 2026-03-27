import { useEffect, useState } from 'react';

function formatFeedbackDate(isoDate) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

function formatDeliveryStatus(status) {
  if (status === 'delivered') {
    return 'Telegram 전달 완료';
  }

  if (status === 'failed') {
    return '서버 저장 완료, Telegram 전달 실패';
  }

  return '서버 처리 중';
}

function isJsonResponse(response) {
  return (response.headers.get('content-type') || '').includes('application/json');
}

export function FeedbackBoard({ contactEndpoint = '', deliveryMethod = 'local', contactEmail = '' }) {
  const [draftText, setDraftText] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [threads, setThreads] = useState([]);
  const [loadState, setLoadState] = useState(contactEndpoint ? 'loading' : 'idle');

  useEffect(() => {
    if (!contactEndpoint || deliveryMethod !== 'endpoint') {
      setThreads([]);
      setLoadState('idle');
      return undefined;
    }

    let active = true;

    const loadThreads = async (isInitial = false) => {
      if (isInitial) {
        setLoadState('loading');
      }

      try {
        const response = await fetch(contactEndpoint, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok || !isJsonResponse(response)) {
          throw new Error(`Contact fetch failed with status ${response.status}`);
        }

        const result = await response.json();

        if (!active) {
          return;
        }

        setThreads(Array.isArray(result.threads) ? result.threads : []);
        setLoadState('ready');
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadState('error');
      }
    };

    loadThreads(true);
    const intervalId = window.setInterval(() => loadThreads(false), 15000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [contactEndpoint, deliveryMethod]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const text = String(formData.get('text') || '').trim();

    if (!text) {
      return;
    }

    setSubmitState('submitting');
    setSubmitMessage('');

    if (deliveryMethod === 'endpoint' && contactEndpoint) {
      try {
        const response = await fetch(contactEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            message: text,
          }),
        });

        if (!isJsonResponse(response)) {
          throw new Error('contact_endpoint_not_deployed');
        }

        const result = await response.json();

        if (result.thread) {
          setThreads((current) => [result.thread, ...current.filter((item) => item.id !== result.thread.id)]);
        }

        setSubmitState(response.ok && result.ok ? 'success' : 'error');
        setSubmitMessage(
          response.ok && result.ok
            ? '문의가 저장되고 Telegram으로 전달되었습니다.'
            : '문의는 서버에 저장되었지만 Telegram 전달에 실패했습니다. 설정을 확인해 주세요.',
        );

        setDraftText('');
        event.currentTarget.reset();
      } catch (error) {
        setSubmitState('error');
        setSubmitMessage('문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }

      return;
    }

    if (deliveryMethod === 'email' && contactEmail) {
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
        '[Cash Guardian] Contact Us',
      )}&body=${encodeURIComponent(text)}`;
      setSubmitState('success');
      setSubmitMessage('이메일 초안을 열었습니다. 이 경로에서는 앱 내 자동 회신 동기화가 지원되지 않습니다.');
      return;
    }

    setSubmitState('error');
    setSubmitMessage('Contact Us 서버 경로가 설정되지 않았습니다. 문의 내용은 로컬에 저장되지 않습니다.');
  };

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Contact Us
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">운영팀에 의견 보내기</h2>
      </div>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        <textarea
          className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          name="text"
          placeholder="질문, 개선 요청, 오류 제보 등 답변이 필요한 내용을 입력하세요."
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
        />
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
            type="submit"
            disabled={submitState === 'submitting'}
          >
            {submitState === 'submitting' ? '전달 중...' : '문의 보내기'}
          </button>
        </div>
        {submitMessage ? (
          <p className={`text-sm ${submitState === 'error' ? 'text-red-600' : 'text-teal-700'}`}>
            {submitMessage}
          </p>
        ) : null}
      </form>

      <div className="mt-5 grid gap-3">
        {loadState === 'loading' ? (
          <p className="text-sm text-slate-400">문의 내역을 불러오는 중입니다.</p>
        ) : null}
        {loadState === 'ready' && threads.length === 0 ? (
          <p className="text-sm text-slate-400">아직 등록된 문의가 없습니다.</p>
        ) : null}
        {threads.map((feedback) => (
          <article
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            key={feedback.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {formatFeedbackDate(feedback.createdAt)}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Ticket {feedback.id}
                </p>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
              {feedback.text}
            </p>
            <div className="mt-3 w-fit rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              상태: {formatDeliveryStatus(feedback.deliveryStatus)}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Replies
              </p>
              <div className="mt-3 grid gap-3">
                {(feedback.replies || []).length > 0 ? (
                  (feedback.replies || []).map((reply) => (
                    <div
                      className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm"
                      key={reply.id}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                        {reply.author ? `${reply.author} reply` : 'Telegram reply'}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap break-words">{reply.text}</p>
                      <p className="mt-2 text-xs font-medium text-slate-400">
                        {formatFeedbackDate(reply.createdAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    아직 Telegram에서 수신된 회신이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
