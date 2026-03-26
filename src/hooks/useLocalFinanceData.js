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

  const setSalary = async (salary) => {
    const normalizedSalary = Number(salary) || 0;
    await persist({
      ...dataRef.current,
      salary: normalizedSalary,
      monthlyBudgetMonth: formatMonth(new Date()),
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

  const addComment = async (comment) => {
    const nextComment = {
      id: crypto.randomUUID(),
      author: comment.author?.trim() || '익명',
      text: comment.text?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    if (!nextComment.text) {
      return;
    }

    await persist({
      ...dataRef.current,
      comments: [nextComment, ...(dataRef.current.comments || [])],
    });
  };

  const removeComment = async (commentId) => {
    await persist({
      ...dataRef.current,
      comments: (dataRef.current.comments || []).filter((comment) => comment.id !== commentId),
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
    const salary = data.salary || 0;
    const creditThreshold = salary * 0.25;
    const remainingSafeCredit = Math.max(creditThreshold - creditSpent, 0);
    const overage = Math.max(creditSpent - creditThreshold, 0);

    return {
      salary,
      creditSpent,
      debitSpent,
      cashSpent,
      totalSpent,
      creditThreshold,
      remainingSafeCredit,
      overage,
      creditUsageRate: salary > 0 ? creditSpent / salary : 0,
      totalUsageRate: salary > 0 ? totalSpent / salary : 0,
      shouldWarn: salary > 0 && creditSpent > creditThreshold,
    };
  }, [data]);

  return {
    data,
    summary,
    status,
    actions: {
      setSalary,
      addTransaction,
      removeTransaction,
      resetDemoData,
      addComment,
      removeComment,
      addWatchlist,
      removeWatchlist,
    },
  };
}
