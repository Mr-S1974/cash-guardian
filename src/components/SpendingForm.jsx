import { useEffect, useState } from 'react';
import {
  formatCurrency,
  formatNumericInput,
  parseNumericInput,
} from '../lib/format';

const initialForm = {
  type: 'card',
  merchant: '',
  amount: '',
  category: '',
  memo: '',
  spentAt: '',
};

export function SpendingForm({
  onAddTransaction,
  onSetIncomeSources,
  incomeSources,
  showIncomeSection = true,
  showExpenseSection = true,
  incomeSectionId,
  expenseSectionId,
}) {
  const [incomeForm, setIncomeForm] = useState(incomeSources);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setIncomeForm(incomeSources);
  }, [incomeSources]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onAddTransaction(form);
    setForm(initialForm);
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

  return (
    <div className="grid gap-4">
      {showIncomeSection ? (
        <form
          className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card"
          id={incomeSectionId}
          onSubmit={handleIncomeSubmit}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Monthly Income
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">수입 항목 설정</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                이번 달 기준 수입원을 먼저 정리한 뒤 지출 판단 기준을 맞춥니다.
              </p>
            </div>
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
      ) : null}

      {showExpenseSection ? (
        <form
          className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6"
          id={expenseSectionId}
          onSubmit={handleSubmit}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Expense Entry
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">지출 기록</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              초안 완성에 집중할 수 있도록 사용처, 금액, 카테고리, 메모만 간단히 남깁니다.
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                  form.type === 'card'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
                type="button"
                onClick={() => setForm((current) => ({ ...current, type: 'card' }))}
              >
                카드
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
          </div>

          <button
            className="mt-4 w-full rounded-2xl bg-teal-600 px-4 py-4 text-base font-semibold text-white"
            type="submit"
          >
            지출 저장
          </button>
        </form>
      ) : null}
    </div>
  );
}
