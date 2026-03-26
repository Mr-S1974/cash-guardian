import { useEffect, useState } from 'react';
import {
  formatCurrency,
  formatNumericInput,
  parseNumericInput,
} from '../lib/format';
import { parseReceiptText } from '../lib/receiptOcr';

const initialForm = {
  type: 'credit',
  merchant: '',
  amount: '',
  category: '',
  memo: '',
  receiptImage: '',
  receiptName: '',
  spentAt: '',
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function SpendingForm({
  onAddTransaction,
  onSetIncomeSources,
  incomeSources,
}) {
  const [incomeForm, setIncomeForm] = useState(incomeSources);
  const [form, setForm] = useState(initialForm);
  const [ocrStatus, setOcrStatus] = useState('idle');
  const [ocrMessage, setOcrMessage] = useState('');

  useEffect(() => {
    setIncomeForm(incomeSources);
  }, [incomeSources]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onAddTransaction(form);
    setForm(initialForm);
    setOcrStatus('idle');
    setOcrMessage('');
  };

  const handleIncomeSubmit = async (event) => {
    event.preventDefault();
    await onSetIncomeSources(
      incomeForm.map((incomeSource) => ({
        ...incomeSource,
        amount: parseNumericInput(incomeSource.amount),
        memo: incomeSource.memo?.trim() || '',
      })),
    );
  };

  const handleReceiptChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setOcrStatus('idle');
      setOcrMessage('');
      setForm((current) => ({
        ...current,
        receiptImage: '',
        receiptName: '',
        spentAt: '',
      }));
      return;
    }

    const receiptImage = await readFileAsDataUrl(file);
    setForm((current) => ({
      ...current,
      receiptImage,
      receiptName: file.name,
    }));

    setOcrStatus('running');
    setOcrMessage('영수증 텍스트를 분석하는 중입니다.');

    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('kor+eng', 1, {
        logger: (message) => {
          if (message.status === 'recognizing text' && typeof message.progress === 'number') {
            setOcrMessage(`영수증 분석 중 ${Math.round(message.progress * 100)}%`);
          }
        },
      });
      const result = await worker.recognize(file);
      await worker.terminate();

      const parsedReceipt = parseReceiptText(result.data.text || '');

      setForm((current) => ({
        ...current,
        receiptImage,
        receiptName: file.name,
        merchant: parsedReceipt.merchant || current.merchant,
        amount: parsedReceipt.amount ? String(parsedReceipt.amount) : current.amount,
        category: parsedReceipt.category || current.category,
        spentAt: parsedReceipt.spentAt || current.spentAt,
        memo: current.memo
          ? current.memo
          : parsedReceipt.rawText
            ? `OCR 메모\n${parsedReceipt.rawText.slice(0, 300)}`
            : '',
      }));

      setOcrStatus('done');
      setOcrMessage('영수증 분석이 완료되었습니다. 자동 입력된 내용을 확인하세요.');
    } catch {
      setOcrStatus('error');
      setOcrMessage('영수증 자동입력에 실패했습니다. 사진은 저장되며 항목은 직접 수정할 수 있습니다.');
    }
  };

  return (
    <div className="grid gap-4">
      <form
        className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card"
        onSubmit={handleIncomeSubmit}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Monthly Income
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">수입 항목 설정</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            기기 내 로컬 저장소
          </span>
        </div>

        <div className="mt-5 grid gap-4">
          {incomeForm.map((incomeSource, index) => (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={incomeSource.id}>
              <p className="text-sm font-semibold text-slate-950">{incomeSource.label}</p>
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg font-semibold text-slate-950 outline-none transition focus:border-teal-500"
                inputMode="numeric"
                value={formatNumericInput(incomeSource.amount)}
                onChange={(event) =>
                  setIncomeForm((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, amount: event.target.value } : item,
                    ),
                  )
                }
                placeholder={`${incomeSource.label} 금액`}
              />
              <textarea
                className="mt-3 min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500"
                value={incomeSource.memo}
                onChange={(event) =>
                  setIncomeForm((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, memo: event.target.value } : item,
                    ),
                  )
                }
                placeholder={`${incomeSource.label} 메모`}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          현재 총수입{' '}
          {formatCurrency(
            incomeForm.reduce((sum, incomeSource) => sum + parseNumericInput(incomeSource.amount), 0),
          )}
        </p>

        <button
          className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-4 text-base font-semibold text-white"
          type="submit"
        >
          수입 항목 저장
        </button>
      </form>

      <form
        className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Quick Capture
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">지출 바로 입력</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            모바일에서는 영수증 촬영 버튼으로 카메라를 바로 열어 지출과 함께 저장할 수 있습니다.
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="grid grid-cols-3 gap-3">
            <button
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                form.type === 'credit'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
              type="button"
              onClick={() => setForm((current) => ({ ...current, type: 'credit' }))}
            >
              신용카드
            </button>
            <button
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                form.type === 'debit'
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
              type="button"
              onClick={() => setForm((current) => ({ ...current, type: 'debit' }))}
            >
              체크카드
            </button>
            <button
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                form.type === 'cash'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
              type="button"
              onClick={() => setForm((current) => ({ ...current, type: 'cash' }))}
            >
              현금
            </button>
          </div>

          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            value={form.merchant}
            onChange={(event) =>
              setForm((current) => ({ ...current, merchant: event.target.value }))
            }
            placeholder="사용처"
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            inputMode="numeric"
            value={formatNumericInput(form.amount)}
            onChange={(event) =>
              setForm((current) => ({ ...current, amount: event.target.value }))
            }
            placeholder="금액"
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
            placeholder="카테고리"
          />
          <textarea
            className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            value={form.memo}
            onChange={(event) =>
              setForm((current) => ({ ...current, memo: event.target.value }))
            }
            placeholder="지출 메모"
          />
          <label className="block text-sm font-semibold text-slate-700">
            영수증 촬영 / 첨부
            <input
              accept="image/*"
              capture="environment"
              className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500"
              onChange={handleReceiptChange}
              type="file"
            />
          </label>
          {ocrStatus !== 'idle' ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                ocrStatus === 'error'
                  ? 'bg-rose-50 text-rose-700'
                  : ocrStatus === 'done'
                    ? 'bg-teal-50 text-teal-700'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              {ocrMessage}
            </div>
          ) : null}
          {form.receiptImage ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">
                  첨부됨: {form.receiptName || 'receipt-image'}
                </p>
                <button
                  className="text-sm font-semibold text-slate-400 transition hover:text-red-500"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      receiptImage: '',
                      receiptName: '',
                      spentAt: '',
                    }))
                  }
                  type="button"
                >
                  제거
                </button>
              </div>
              <img
                alt="영수증 미리보기"
                className="mt-3 max-h-56 w-full rounded-2xl object-cover"
                src={form.receiptImage}
              />
            </div>
          ) : null}
        </div>

        <button
          className="mt-4 w-full rounded-2xl bg-teal-600 px-4 py-4 text-base font-semibold text-white"
          type="submit"
        >
          로컬 저장소에 저장
        </button>
      </form>
    </div>
  );
}
