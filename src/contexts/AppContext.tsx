import { createContext, useContext, useState, ReactNode } from 'react';

export interface CategoryWithColor {
  name: string;
  color: string;
}

interface AppContextType {
  // 카테고리 관리
  expenseCategories: CategoryWithColor[];
  incomeCategories: CategoryWithColor[];
  addExpenseCategory: (category: string, color: string) => void;
  removeExpenseCategory: (category: string) => void;
  addIncomeCategory: (category: string, color: string) => void;
  removeIncomeCategory: (category: string) => void;
  updateExpenseCategoryColor: (category: string, color: string) => void;
  updateIncomeCategoryColor: (category: string, color: string) => void;
  getCategoryColor: (category: string, type: 'expense' | 'income') => string;

  // 지불수단 관리
  expensePaymentMethods: string[];
  incomePaymentMethods: string[];
  addExpensePaymentMethod: (method: string) => void;
  removeExpensePaymentMethod: (method: string) => void;
  addIncomePaymentMethod: (method: string) => void;
  removeIncomePaymentMethod: (method: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // 지출 카테고리
  const [expenseCategories, setExpenseCategories] = useState<CategoryWithColor[]>([
    { name: '식비', color: '#ef4444' },
    { name: '교통', color: '#3b82f6' },
    { name: '쇼핑', color: '#a855f7' },
    { name: '문화생활', color: '#ec4899' },
    { name: '의료', color: '#10b981' },
    { name: '공과금', color: '#f59e0b' },
    { name: '보험', color: '#8b5cf6' },
    { name: '기타', color: '#6b7280' }
  ]);

  // 수입 카테고리
  const [incomeCategories, setIncomeCategories] = useState<CategoryWithColor[]>([
    { name: '급여', color: '#22c55e' },
    { name: '부수입', color: '#14b8a6' },
    { name: '투자수익', color: '#06b6d4' },
    { name: '기타수입', color: '#84cc16' }
  ]);

  // 지출 지불수단
  const [expensePaymentMethods, setExpensePaymentMethods] = useState<string[]>([
    'Cash', 'DebitCard', 'CreditCard', 'MobilePay', 'Other'
  ]);

  // 수입 지불수단
  const [incomePaymentMethods, setIncomePaymentMethods] = useState<string[]>([
    'BankTransfer', 'Cash', 'Other'
  ]);

  const addExpenseCategory = (category: string, color: string) => {
    if (!expenseCategories.find(c => c.name === category)) {
      setExpenseCategories([...expenseCategories, { name: category, color }]);
    }
  };

  const removeExpenseCategory = (category: string) => {
    setExpenseCategories(expenseCategories.filter(c => c.name !== category));
  };

  const addIncomeCategory = (category: string, color: string) => {
    if (!incomeCategories.find(c => c.name === category)) {
      setIncomeCategories([...incomeCategories, { name: category, color }]);
    }
  };

  const removeIncomeCategory = (category: string) => {
    setIncomeCategories(incomeCategories.filter(c => c.name !== category));
  };

  const updateExpenseCategoryColor = (category: string, color: string) => {
    setExpenseCategories(expenseCategories.map(c =>
      c.name === category ? { ...c, color } : c
    ));
  };

  const updateIncomeCategoryColor = (category: string, color: string) => {
    setIncomeCategories(incomeCategories.map(c =>
      c.name === category ? { ...c, color } : c
    ));
  };

  const getCategoryColor = (category: string, type: 'expense' | 'income'): string => {
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    const found = categories.find(c => c.name === category);
    return found?.color || '#6b7280';
  };

  const addExpensePaymentMethod = (method: string) => {
    if (!expensePaymentMethods.includes(method)) {
      setExpensePaymentMethods([...expensePaymentMethods, method]);
    }
  };

  const removeExpensePaymentMethod = (method: string) => {
    setExpensePaymentMethods(expensePaymentMethods.filter(m => m !== method));
  };

  const addIncomePaymentMethod = (method: string) => {
    if (!incomePaymentMethods.includes(method)) {
      setIncomePaymentMethods([...incomePaymentMethods, method]);
    }
  };

  const removeIncomePaymentMethod = (method: string) => {
    setIncomePaymentMethods(incomePaymentMethods.filter(m => m !== method));
  };

  return (
    <AppContext.Provider
      value={{
        expenseCategories,
        incomeCategories,
        addExpenseCategory,
        removeExpenseCategory,
        addIncomeCategory,
        removeIncomeCategory,
        updateExpenseCategoryColor,
        updateIncomeCategoryColor,
        getCategoryColor,
        expensePaymentMethods,
        incomePaymentMethods,
        addExpensePaymentMethod,
        removeExpensePaymentMethod,
        addIncomePaymentMethod,
        removeIncomePaymentMethod,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
