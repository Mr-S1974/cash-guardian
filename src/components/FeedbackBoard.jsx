import { useState } from 'react';

function formatFeedbackDate(isoDate) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function FeedbackBoard({
  feedbacks,
  onAddFeedback,
  onRemoveFeedback,
  contactEndpoint = '',
  deliveryMethod = 'local',
  contactEmail = '',
}) {
  const [draftText, setDraftText] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const text = String(formData.get('text') || '').trim();

    if (!text) {
      return;
    }

    setSubmitState('submitting');
    setSubmitMessage('');
    let shouldResetForm = true;

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

        if (!response.ok) {
          throw new Error(`Contact delivery failed with status ${response.status}`);
        }

        const result = await response.json();
        await onAddFeedback({
          text,
          deliveryStatus: 'delivered',
          deliveredAt: result.submittedAt || new Date().toISOString(),
        });
        setSubmitState('success');
        setSubmitMessage('의견이 전달되었습니다. 로컬에도 백업으로 보관했습니다.');
      } catch (error) {
        await onAddFeedback({
          text,
          deliveryStatus: 'failed',
        });
        setSubmitState('error');
        setSubmitMessage('전달에 실패했습니다. 내용은 로컬에 백업되었고 나중에 다시 시도할 수 있습니다.');
        shouldResetForm = false;
      }
    } else if (deliveryMethod === 'email' && contactEmail) {
      await onAddFeedback({
        text,
        deliveryStatus: 'email_draft',
      });
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
        '[Cash Guardian] Contact Us',
      )}&body=${encodeURIComponent(text)}`;
      setSubmitState('success');
      setSubmitMessage('이메일 초안을 열었습니다. 내용은 로컬에도 백업으로 보관했습니다.');
    } else {
      await onAddFeedback({
        text,
        deliveryStatus: 'local_only',
      });
      setSubmitState('success');
      setSubmitMessage('전달 경로가 아직 설정되지 않아 브라우저에만 보관했습니다.');
    }

    if (shouldResetForm) {
      setDraftText('');
      event.currentTarget.reset();
    }
  };

  const statusLabel =
    deliveryMethod === 'endpoint' && contactEndpoint
      ? '실시간 전달 연결됨'
      : deliveryMethod === 'email' && contactEmail
        ? `이메일 초안 연결: ${contactEmail}`
        : '브라우저에 임시 저장';

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Contact Us
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">운영팀에 의견 보내기</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            이름이나 부서 없이 개발자에게 전달할 의견만 남기는 공간입니다. 전송 실패에 대비해
            내용은 브라우저에도 같이 보관합니다.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          {statusLabel}
        </span>
      </div>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        <textarea
          className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          name="text"
          placeholder="개선 요청, 오류 제보, 개발자에게 전달할 내용을 입력하세요."
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
        />
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
            type="submit"
            disabled={submitState === 'submitting'}
          >
            {submitState === 'submitting' ? '전달 중...' : '의견 남기기'}
          </button>
          {deliveryMethod === 'email' && contactEmail ? (
            <a
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              href={`mailto:${contactEmail}?subject=${encodeURIComponent('[Cash Guardian] Contact Us')}&body=${encodeURIComponent(draftText)}`}
            >
              이메일 앱 열기
            </a>
          ) : null}
        </div>
        {submitMessage ? (
          <p
            className={`text-sm ${
              submitState === 'error' ? 'text-red-600' : 'text-teal-700'
            }`}
          >
            {submitMessage}
          </p>
        ) : null}
      </form>

      <div className="mt-5 grid gap-3">
        {feedbacks.map((feedback) => (
          <article
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            key={feedback.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {formatFeedbackDate(feedback.createdAt)}
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
              상태: {formatDeliveryStatus(feedback.deliveryStatus)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDeliveryStatus(status) {
  if (status === 'delivered') {
    return '전달 완료 + 로컬 보관';
  }

  if (status === 'failed') {
    return '전달 실패 + 로컬 보관';
  }

  if (status === 'email_draft') {
    return '이메일 초안 + 로컬 보관';
  }

  return '로컬 보관';
}
