import { useEffect, useState } from 'react';
import { formatCurrency } from '../lib/format';

const initialForm = {
  type: 'credit',
  merchant: '',
  amount: '',
  category: '',
};

export function SpendingForm({ onAddTransaction, onSetSalary, defaultSalary }) {
  const [salaryInput, setSalaryInput] = useState(defaultSalary);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setSalaryInput(defaultSalary);
  }, [defaultSalary]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onAddTransaction(form);
    setForm(initialForm);
  };

  const handleSalarySubmit = async (event) => {
    event.preventDefault();
    await onSetSalary(salaryInput);
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
            value={salaryInput}
            onChange={(event) => setSalaryInput(event.target.value)}
            placeholder="3200000"
          />
        </label>
        <p className="mt-3 text-sm text-slate-500">
          현재 기준선 {formatCurrency(Number(salaryInput) || 0)}
        </p>

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
            value={form.amount}
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
