import { useEffect, useState } from 'react';
import {
  formatCurrency,
  formatNumericInput,
  parseNumericInput,
} from '../lib/format';

const initialForm = {
  type: 'credit',
  merchant: '',
  amount: '',
  category: '',
  memo: '',
  receiptImage: '',
  receiptName: '',
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
  onSetSalary,
  defaultSalary,
  defaultSalaryMemo,
}) {
  const [salaryInput, setSalaryInput] = useState(defaultSalary);
  const [salaryMemoInput, setSalaryMemoInput] = useState(defaultSalaryMemo || '');
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setSalaryInput(defaultSalary);
  }, [defaultSalary]);

  useEffect(() => {
    setSalaryMemoInput(defaultSalaryMemo || '');
  }, [defaultSalaryMemo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onAddTransaction(form);
    setForm(initialForm);
  };

  const handleSalarySubmit = async (event) => {
    event.preventDefault();
    await onSetSalary({
      salary: parseNumericInput(salaryInput),
      memo: salaryMemoInput,
    });
  };

  const handleReceiptChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setForm((current) => ({
        ...current,
        receiptImage: '',
        receiptName: '',
      }));
      return;
    }

    const receiptImage = await readFileAsDataUrl(file);
    setForm((current) => ({
      ...current,
      receiptImage,
      receiptName: file.name,
    }));
  };

  return (
    <div className="grid gap-4">
      <form
        className="rounded-[28px] bg-white p-5 shadow-card"
        onSubmit={handleSalarySubmit}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Zero-Knowledge Local Storage
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">월급 기준선 설정</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            기기 내 로컬 저장소
          </span>
        </div>

        <label className="mt-5 block text-sm font-semibold text-slate-700">
          이번 달 실수령 월급
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg font-semibold text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            inputMode="numeric"
            value={formatNumericInput(salaryInput)}
            onChange={(event) => setSalaryInput(event.target.value)}
            placeholder="3200000"
          />
        </label>
        <p className="mt-3 text-sm text-slate-500">
          현재 기준선 {formatCurrency(parseNumericInput(salaryInput))}
        </p>
        <label className="mt-4 block text-sm font-semibold text-slate-700">
          수입 메모
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            value={salaryMemoInput}
            onChange={(event) => setSalaryMemoInput(event.target.value)}
            placeholder="예: 기본급 + 식대 + 고정 수당 포함"
          />
        </label>

        <button
          className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-4 text-base font-semibold text-white"
          type="submit"
        >
          월급 저장
        </button>
      </form>

      <form className="rounded-[28px] bg-white p-5 shadow-card lg:p-6" onSubmit={handleSubmit}>
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
