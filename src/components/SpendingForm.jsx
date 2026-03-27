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

const COMMON_CATEGORIES = ['식비', '교통', '생필품', '쇼핑', '카페·간식', '의료', '교육', '취미'];

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
              <h2 className="mt-2 text-xl font-bold text-slate-950">수입 관리</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                월급, 용돈, 장학금, 알바비처럼 이번 달 들어오는 돈을 먼저 정리합니다.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {incomeForm.map((incomeSource, index) => (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={incomeSource.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950">{incomeSource.label}</p>
                  {incomeSource.id === 'income-salary' ? (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                      실수령액
                    </span>
                  ) : null}
                </div>
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
                  placeholder={
                    incomeSource.id === 'income-salary'
                      ? '월급 또는 용돈 금액'
                      : `${incomeSource.label} 금액`
                  }
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
            현재 수입 합계{' '}
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
            <h2 className="mt-2 text-xl font-bold text-slate-950">지출 관리</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              밥값, 교통비, 쇼핑처럼 오늘 쓴 돈을 빠르게 기록합니다.
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
                카드·간편결제
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
              placeholder="어디에 썼나요?"
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
              inputMode="numeric"
              value={formatNumericInput(form.amount)}
              onChange={(event) =>
                setForm((current) => ({ ...current, amount: event.target.value }))
              }
              placeholder="얼마를 썼나요?"
            />
            <input
              list="spending-category-options"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              placeholder="어떤 지출인가요?"
            />
            <datalist id="spending-category-options">
              {COMMON_CATEGORIES.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <textarea
              className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
              value={form.memo}
              onChange={(event) =>
                setForm((current) => ({ ...current, memo: event.target.value }))
              }
              placeholder="메모가 있으면 남겨주세요"
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
