import { useEffect, useMemo, useRef, useState } from 'react';
import {
  defaultFinanceData,
  getFinanceSnapshot,
  saveFinanceSnapshot,
} from '../lib/localFinanceDb';
import { parseNumericInput } from '../lib/format';

function formatMonth(date) {
  return date.toISOString().slice(0, 7);
}

function isCurrentMonth(isoDate) {
  return formatMonth(new Date(isoDate)) === formatMonth(new Date());
}

export function useLocalFinanceData() {
  const [data, setData] = useState(defaultFinanceData);
  const [status, setStatus] = useState('loading');
  const dataRef = useRef(defaultFinanceData);

  useEffect(() => {
    let active = true;

    getFinanceSnapshot()
      .then((snapshot) => {
        if (!active) {
          return;
        }

        setData(snapshot);
        dataRef.current = snapshot;
        setStatus('ready');
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const persist = async (nextData) => {
    setData(nextData);
    dataRef.current = nextData;
    await saveFinanceSnapshot(nextData);
  };

  const setIncomeSources = async (incomeSources) => {
    await persist({
      ...dataRef.current,
      incomeSources,
      monthlyBudgetMonth: formatMonth(new Date()),
    });
  };

  const setMonthlyGuidelines = async (guidelines) => {
    await persist({
      ...dataRef.current,
      monthlyGuidelines: {
        ...dataRef.current.monthlyGuidelines,
        total: parseNumericInput(guidelines.total),
        card: parseNumericInput(guidelines.card),
        cash: parseNumericInput(guidelines.cash),
        memo: guidelines.memo?.trim() || '',
      },
    });
  };

  const addTransaction = async (transaction) => {
    const nextTransaction = {
      id: crypto.randomUUID(),
      merchant: transaction.merchant?.trim() || '직접 입력',
      category: transaction.category?.trim() || '기타',
      type:
        transaction.type === 'debit'
          ? 'debit'
          : transaction.type === 'cash'
            ? 'cash'
            : 'credit',
      amount: parseNumericInput(transaction.amount),
      memo: transaction.memo?.trim() || '',
      receiptImage: transaction.receiptImage || '',
      receiptName: transaction.receiptName || '',
      spentAt: transaction.spentAt || new Date().toISOString(),
    };

    await persist({
      ...dataRef.current,
      transactions: [nextTransaction, ...dataRef.current.transactions],
    });
  };

  const removeTransaction = async (transactionId) => {
    await persist({
      ...dataRef.current,
      transactions: dataRef.current.transactions.filter(
        (transaction) => transaction.id !== transactionId,
      ),
    });
  };

  const resetDemoData = async () => {
    await persist({
      ...defaultFinanceData,
      monthlyBudgetMonth: formatMonth(new Date()),
    });
  };

  const addFeedback = async (feedback) => {
    const nextFeedback = {
      id: crypto.randomUUID(),
      author: feedback.author?.trim() || '익명',
      department: feedback.department?.trim() || '미분류',
      text: feedback.text?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    if (!nextFeedback.text) {
      return;
    }

    await persist({
      ...dataRef.current,
      feedbacks: [nextFeedback, ...(dataRef.current.feedbacks || [])],
    });
  };

  const removeFeedback = async (feedbackId) => {
    await persist({
      ...dataRef.current,
      feedbacks: (dataRef.current.feedbacks || []).filter(
        (feedback) => feedback.id !== feedbackId,
      ),
    });
  };

  const addWatchlist = async (query) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    const alreadyExists = (dataRef.current.watchlist || []).some(
      (item) => item.query.toLowerCase() === normalizedQuery.toLowerCase(),
    );

    if (alreadyExists) {
      return;
    }

    const nextItem = {
      id: crypto.randomUUID(),
      query: normalizedQuery,
      label: normalizedQuery.toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    await persist({
      ...dataRef.current,
      watchlist: [nextItem, ...(dataRef.current.watchlist || [])],
    });
  };

  const removeWatchlist = async (watchlistId) => {
    await persist({
      ...dataRef.current,
      watchlist: (dataRef.current.watchlist || []).filter((item) => item.id !== watchlistId),
    });
  };

  const summary = useMemo(() => {
    const currentTransactions = data.transactions.filter((transaction) =>
      isCurrentMonth(transaction.spentAt),
    );

    const creditSpent = currentTransactions
      .filter((transaction) => transaction.type === 'credit')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const debitSpent = currentTransactions
      .filter((transaction) => transaction.type === 'debit')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const cashSpent = currentTransactions
      .filter((transaction) => transaction.type === 'cash')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalSpent = creditSpent + debitSpent + cashSpent;
    const cardSpent = creditSpent + debitSpent;
    const totalIncome = (data.incomeSources || []).reduce(
      (sum, incomeSource) => sum + (Number(incomeSource.amount) || 0),
      0,
    );
    const guidelineTotal = data.monthlyGuidelines?.total || 0;
    const guidelineCard = data.monthlyGuidelines?.card || 0;
    const guidelineCash = data.monthlyGuidelines?.cash || 0;

    return {
      totalIncome,
      creditSpent,
      debitSpent,
      cardSpent,
      cashSpent,
      totalSpent,
      guidelineTotal,
      guidelineCard,
      guidelineCash,
      totalUsageRate: totalIncome > 0 ? totalSpent / totalIncome : 0,
      cardUsageRate: totalIncome > 0 ? cardSpent / totalIncome : 0,
    };
  }, [data]);

  return {
    data,
    summary,
    status,
    actions: {
      setIncomeSources,
      setMonthlyGuidelines,
      addTransaction,
      removeTransaction,
      resetDemoData,
      addFeedback,
      removeFeedback,
      addWatchlist,
      removeWatchlist,
    },
  };
}
