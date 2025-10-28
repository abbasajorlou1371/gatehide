'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Badge, Table, TableColumn, Pagination } from '../../components/ui';
import ContentArea from '../../components/ContentArea';
import { usePageTitle, PAGE_TITLES } from '../../hooks/usePageTitle';

interface Transaction extends Record<string, unknown> {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'refund';
  category: string;
  description: string;
  amount: number;
  gamenetName?: string;
  paymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  reference?: string;
}

function TransactionsPageContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Set page title
  usePageTitle(PAGE_TITLES.transactions.title, PAGE_TITLES.transactions.description);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        category: 'اشتراک',
        description: 'دریافت پرداخت اشتراک ماهانه',
        amount: 50000,
        gamenetName: 'گیم نت آریا',
        paymentId: 'PAY-001',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00',
        completedAt: '2024-01-15T10:35:00',
        reference: 'TXN-2024-001'
      },
      {
        id: '2',
        type: 'income',
        category: 'اشتراک',
        description: 'دریافت پرداخت اشتراک 3 ماهه',
        amount: 75000,
        gamenetName: 'گیم نت پارس',
        paymentId: 'PAY-002',
        status: 'completed',
        createdAt: '2024-01-16T14:20:00',
        completedAt: '2024-01-16T14:25:00',
        reference: 'TXN-2024-002'
      },
      {
        id: '3',
        type: 'expense',
        category: 'هزینه سرور',
        description: 'پرداخت هزینه سرور ماهانه',
        amount: -200000,
        status: 'completed',
        createdAt: '2024-01-17T09:15:00',
        completedAt: '2024-01-17T09:20:00',
        reference: 'TXN-2024-003'
      },
      {
        id: '4',
        type: 'expense',
        category: 'پشتیبانی',
        description: 'پرداخت هزینه پشتیبانی فنی',
        amount: -50000,
        status: 'pending',
        createdAt: '2024-01-18T16:45:00',
        reference: 'TXN-2024-004'
      },
      {
        id: '5',
        type: 'refund',
        category: 'برگشت',
        description: 'برگشت پرداخت اشتراک روزانه',
        amount: -25000,
        gamenetName: 'گیم نت هخامنش',
        paymentId: 'PAY-005',
        status: 'completed',
        createdAt: '2024-01-19T11:30:00',
        completedAt: '2024-01-19T11:35:00',
        reference: 'TXN-2024-005'
      },
      {
        id: '6',
        type: 'transfer',
        category: 'انتقال',
        description: 'انتقال وجه به حساب بانکی',
        amount: -1000000,
        status: 'completed',
        createdAt: '2024-01-20T13:00:00',
        completedAt: '2024-01-20T13:05:00',
        reference: 'TXN-2024-006'
      }
    ];

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Table columns configuration
  const columns: TableColumn<Transaction>[] = [
    {
      key: 'id',
      label: 'شناسه تراکنش',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">📈</span>
          <div>
            <div className="font-mono text-sm text-gray-300">#{String(value)}</div>
            {item.reference && (
              <div className="text-xs text-gray-500">{item.reference}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'نوع',
      render: (value) => {
        const typeConfig = {
          income: { label: 'درآمد', variant: 'success' as const, icon: '📈' },
          expense: { label: 'هزینه', variant: 'danger' as const, icon: '📉' },
          transfer: { label: 'انتقال', variant: 'secondary' as const, icon: '🔄' },
          refund: { label: 'برگشت', variant: 'warning' as const, icon: '↩️' }
        };
        const config = typeConfig[value as keyof typeof typeConfig];
        return (
          <Badge variant={config.variant}>
            <span className="ml-1">{config.icon}</span>
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'category',
      label: 'دسته‌بندی',
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'description',
      label: 'توضیحات',
      render: (value, item) => (
        <div>
          <div className="text-white">{String(value)}</div>
          {item.gamenetName && (
            <div className="text-gray-400 text-sm">گیم نت: {String(item.gamenetName)}</div>
          )}
        </div>
      )
    },
    {
      key: 'amount',
      label: 'مبلغ',
      render: (value) => {
        const isPositive = Number(value) >= 0;
        return (
          <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{Number(value).toLocaleString('fa-IR')} تومان
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (value) => {
        const statusConfig = {
          pending: { label: 'در انتظار', variant: 'warning' as const, icon: '⏳' },
          completed: { label: 'تکمیل شده', variant: 'success' as const, icon: '✅' },
          failed: { label: 'ناموفق', variant: 'danger' as const, icon: '❌' },
          cancelled: { label: 'لغو شده', variant: 'secondary' as const, icon: '🚫' }
        };
        const config = statusConfig[String(value) as keyof typeof statusConfig];
        return (
          <Badge variant={config.variant}>
            <span className="ml-1">{config.icon}</span>
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (value) => (
        <span className="text-gray-400 text-sm">
          {new Date(String(value)).toLocaleDateString('fa-IR')}
        </span>
      )
    }
  ];

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.gamenetName && transaction.gamenetName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.reference && transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate data
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => (t.type === 'expense' || t.type === 'refund') && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <ContentArea className="space-y-4 sm:space-y-6" overflow="hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text">مدیریت تراکنش‌ها</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">مدیریت و نظارت بر تمام تراکنش‌های مالی</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <div className="text-sm text-gray-400">کل درآمد</div>
              <div className="text-lg font-semibold text-green-400">
                {totalIncome.toLocaleString('fa-IR')} تومان
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📉</span>
            <div>
              <div className="text-sm text-gray-400">کل هزینه</div>
              <div className="text-lg font-semibold text-red-400">
                {totalExpense.toLocaleString('fa-IR')} تومان
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-sm text-gray-400">سود خالص</div>
              <div className={`text-lg font-semibold ${(totalIncome - totalExpense) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(totalIncome - totalExpense).toLocaleString('fa-IR')} تومان
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <div className="text-sm text-gray-400">کل تراکنش‌ها</div>
              <div className="text-lg font-semibold text-white">
                {transactions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجو در تراکنش‌ها..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Transactions Table */}
      <Table
        data={paginatedTransactions}
        columns={columns}
        searchable={false}
        loading={isLoading}
        emptyMessage="هیچ تراکنشی یافت نشد"
        className="gx-neon"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTransactions.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </ContentArea>
  );
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <TransactionsPageContent />
    </ProtectedRoute>
  );
}