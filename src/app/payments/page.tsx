'use client';

import { useState, useEffect } from 'react';
import { Badge, Table, TableColumn, Pagination } from '../../components/ui';
import ContentArea from '../../components/ContentArea';

interface Payment extends Record<string, unknown> {
  id: string;
  gamenetName: string;
  customerName: string;
  customerMobile: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'online' | 'crypto';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  createdAt: string;
  completedAt?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;


  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPayments: Payment[] = [
      {
        id: '1',
        gamenetName: 'گیم نت آریا',
        customerName: 'علی احمدی',
        customerMobile: '09123456789',
        amount: 50000,
        paymentMethod: 'cash',
        status: 'completed',
        description: 'پرداخت اشتراک ماهانه',
        createdAt: '2024-01-15T10:30:00',
        completedAt: '2024-01-15T10:35:00'
      },
      {
        id: '2',
        gamenetName: 'گیم نت پارس',
        customerName: 'محمد رضایی',
        customerMobile: '09187654321',
        amount: 75000,
        paymentMethod: 'card',
        status: 'completed',
        description: 'پرداخت اشتراک 3 ماهه',
        createdAt: '2024-01-16T14:20:00',
        completedAt: '2024-01-16T14:25:00'
      },
      {
        id: '3',
        gamenetName: 'گیم نت کوروش',
        customerName: 'حسن محمدی',
        customerMobile: '09111111111',
        amount: 30000,
        paymentMethod: 'online',
        status: 'pending',
        description: 'پرداخت اشتراک هفتگی',
        createdAt: '2024-01-17T09:15:00'
      },
      {
        id: '4',
        gamenetName: 'گیم نت آتنا',
        customerName: 'فاطمه کریمی',
        customerMobile: '09222222222',
        amount: 100000,
        paymentMethod: 'crypto',
        status: 'failed',
        description: 'پرداخت اشتراک سالانه',
        createdAt: '2024-01-18T16:45:00'
      },
      {
        id: '5',
        gamenetName: 'گیم نت هخامنش',
        customerName: 'رضا نوری',
        customerMobile: '09333333333',
        amount: 25000,
        paymentMethod: 'cash',
        status: 'refunded',
        description: 'پرداخت اشتراک روزانه',
        createdAt: '2024-01-19T11:30:00',
        completedAt: '2024-01-19T11:35:00'
      },
      {
        id: '6',
        gamenetName: 'گیم نت زاگرس',
        customerName: 'امیر حسینی',
        customerMobile: '09444444444',
        amount: 120000,
        paymentMethod: 'card',
        status: 'completed',
        description: 'پرداخت اشتراک 6 ماهه',
        createdAt: '2024-01-20T08:45:00',
        completedAt: '2024-01-20T08:50:00'
      },
      {
        id: '7',
        gamenetName: 'گیم نت البرز',
        customerName: 'سارا احمدی',
        customerMobile: '09555555555',
        amount: 45000,
        paymentMethod: 'online',
        status: 'completed',
        description: 'پرداخت اشتراک ماهانه',
        createdAt: '2024-01-21T13:20:00',
        completedAt: '2024-01-21T13:25:00'
      },
      {
        id: '8',
        gamenetName: 'گیم نت دماوند',
        customerName: 'حسین رضایی',
        customerMobile: '09666666666',
        amount: 80000,
        paymentMethod: 'cash',
        status: 'pending',
        description: 'پرداخت اشتراک 2 ماهه',
        createdAt: '2024-01-22T16:10:00'
      },
      {
        id: '9',
        gamenetName: 'گیم نت تبریز',
        customerName: 'مریم کریمی',
        customerMobile: '09777777777',
        amount: 150000,
        paymentMethod: 'crypto',
        status: 'completed',
        description: 'پرداخت اشتراک سالانه',
        createdAt: '2024-01-23T11:30:00',
        completedAt: '2024-01-23T11:35:00'
      },
      {
        id: '10',
        gamenetName: 'گیم نت اصفهان',
        customerName: 'علی نوری',
        customerMobile: '09888888888',
        amount: 35000,
        paymentMethod: 'card',
        status: 'failed',
        description: 'پرداخت اشتراک هفتگی',
        createdAt: '2024-01-24T14:45:00'
      },
      {
        id: '11',
        gamenetName: 'گیم نت شیراز',
        customerName: 'فاطمه محمدی',
        customerMobile: '09999999999',
        amount: 90000,
        paymentMethod: 'online',
        status: 'completed',
        description: 'پرداخت اشتراک 3 ماهه',
        createdAt: '2024-01-25T09:15:00',
        completedAt: '2024-01-25T09:20:00'
      },
      {
        id: '12',
        gamenetName: 'گیم نت مشهد',
        customerName: 'محمد احمدی',
        customerMobile: '09111111112',
        amount: 55000,
        paymentMethod: 'cash',
        status: 'refunded',
        description: 'پرداخت اشتراک ماهانه',
        createdAt: '2024-01-26T12:00:00',
        completedAt: '2024-01-26T12:05:00'
      },
      {
        id: '13',
        gamenetName: 'گیم نت کرمان',
        customerName: 'زهرا رضایی',
        customerMobile: '09222222223',
        amount: 70000,
        paymentMethod: 'card',
        status: 'pending',
        description: 'پرداخت اشتراک 2 ماهه',
        createdAt: '2024-01-27T15:30:00'
      },
      {
        id: '14',
        gamenetName: 'گیم نت یزد',
        customerName: 'حسن کریمی',
        customerMobile: '09333333334',
        amount: 40000,
        paymentMethod: 'online',
        status: 'completed',
        description: 'پرداخت اشتراک ماهانه',
        createdAt: '2024-01-28T10:20:00',
        completedAt: '2024-01-28T10:25:00'
      },
      {
        id: '15',
        gamenetName: 'گیم نت اهواز',
        customerName: 'علی نوری',
        customerMobile: '09444444445',
        amount: 110000,
        paymentMethod: 'crypto',
        status: 'completed',
        description: 'پرداخت اشتراک 6 ماهه',
        createdAt: '2024-01-29T17:45:00',
        completedAt: '2024-01-29T17:50:00'
      },
      {
        id: '16',
        gamenetName: 'گیم نت رشت',
        customerName: 'سارا محمدی',
        customerMobile: '09555555556',
        amount: 60000,
        paymentMethod: 'cash',
        status: 'failed',
        description: 'پرداخت اشتراک 2 ماهه',
        createdAt: '2024-01-30T13:10:00'
      },
      {
        id: '17',
        gamenetName: 'گیم نت کرج',
        customerName: 'امیر احمدی',
        customerMobile: '09666666667',
        amount: 85000,
        paymentMethod: 'card',
        status: 'completed',
        description: 'پرداخت اشتراک 3 ماهه',
        createdAt: '2024-01-31T11:30:00',
        completedAt: '2024-01-31T11:35:00'
      },
      {
        id: '18',
        gamenetName: 'گیم نت قم',
        customerName: 'مریم رضایی',
        customerMobile: '09777777778',
        amount: 30000,
        paymentMethod: 'online',
        status: 'pending',
        description: 'پرداخت اشتراک هفتگی',
        createdAt: '2024-02-01T14:20:00'
      },
      {
        id: '19',
        gamenetName: 'گیم نت همدان',
        customerName: 'حسین کریمی',
        customerMobile: '09888888889',
        amount: 95000,
        paymentMethod: 'cash',
        status: 'completed',
        description: 'پرداخت اشتراک 3 ماهه',
        createdAt: '2024-02-02T16:45:00',
        completedAt: '2024-02-02T16:50:00'
      },
      {
        id: '20',
        gamenetName: 'گیم نت زنجان',
        customerName: 'فاطمه نوری',
        customerMobile: '09999999990',
        amount: 50000,
        paymentMethod: 'card',
        status: 'refunded',
        description: 'پرداخت اشتراک ماهانه',
        createdAt: '2024-02-03T09:15:00',
        completedAt: '2024-02-03T09:20:00'
      },
      {
        id: '21',
        gamenetName: 'گیم نت ارومیه',
        customerName: 'محمد محمدی',
        customerMobile: '09111111113',
        amount: 75000,
        paymentMethod: 'online',
        status: 'completed',
        description: 'پرداخت اشتراک 2 ماهه',
        createdAt: '2024-02-04T12:30:00',
        completedAt: '2024-02-04T12:35:00'
      },
      {
        id: '22',
        gamenetName: 'گیم نت بندرعباس',
        customerName: 'زهرا احمدی',
        customerMobile: '09222222224',
        amount: 120000,
        paymentMethod: 'crypto',
        status: 'pending',
        description: 'پرداخت اشتراک 6 ماهه',
        createdAt: '2024-02-05T15:20:00'
      },
      {
        id: '23',
        gamenetName: 'گیم نت گرگان',
        customerName: 'حسن رضایی',
        customerMobile: '09333333335',
        amount: 45000,
        paymentMethod: 'cash',
        status: 'completed',
        description: 'پرداخت اشتراک ماهانه',
        createdAt: '2024-02-06T10:45:00',
        completedAt: '2024-02-06T10:50:00'
      },
      {
        id: '24',
        gamenetName: 'گیم نت ساری',
        customerName: 'علی کریمی',
        customerMobile: '09444444446',
        amount: 80000,
        paymentMethod: 'card',
        status: 'failed',
        description: 'پرداخت اشتراک 2 ماهه',
        createdAt: '2024-02-07T13:15:00'
      },
      {
        id: '25',
        gamenetName: 'گیم نت بابل',
        customerName: 'سارا نوری',
        customerMobile: '09555555557',
        amount: 65000,
        paymentMethod: 'online',
        status: 'completed',
        description: 'پرداخت اشتراک 2 ماهه',
        createdAt: '2024-02-08T17:30:00',
        completedAt: '2024-02-08T17:35:00'
      }
    ];

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setPayments(mockPayments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Table columns configuration
  const columns: TableColumn<Payment>[] = [
    {
      key: 'id',
      label: 'شناسه پرداخت',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">💳</span>
          <span className="font-mono text-sm text-gray-300">#{String(value)}</span>
        </div>
      )
    },
    {
      key: 'gamenetName',
      label: 'گیم نت',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'customerName',
      label: 'مشتری',
      sortable: true,
      render: (value, item) => (
        <div>
          <div className="text-white font-medium">{String(value)}</div>
          <div className="text-gray-400 text-sm">{String(item.customerMobile)}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'مبلغ',
      sortable: true,
      render: (value) => (
        <span className="text-green-400 font-semibold">
          {Number(value).toLocaleString('fa-IR')} تومان
        </span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'روش پرداخت',
      sortable: true,
      render: (value) => {
        const methodLabels: Record<string, string> = {
          cash: 'نقدی',
          card: 'کارت',
          online: 'آنلاین',
          crypto: 'کریپتو'
        };
        const methodIcons: Record<string, string> = {
          cash: '💵',
          card: '💳',
          online: '🌐',
          crypto: '₿'
        };
        return (
          <div className="flex items-center gap-2">
            <span>{methodIcons[String(value)] || '❓'}</span>
            <span className="text-gray-300">{methodLabels[String(value)] || String(value)}</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      render: (value) => {
        const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' | 'secondary'; icon: string }> = {
          pending: { label: 'در انتظار', variant: 'warning', icon: '⏳' },
          completed: { label: 'تکمیل شده', variant: 'success', icon: '✅' },
          failed: { label: 'ناموفق', variant: 'danger', icon: '❌' },
          refunded: { label: 'برگشت', variant: 'secondary', icon: '↩️' }
        };
        const config = statusConfig[String(value)] || { label: String(value), variant: 'secondary' as const, icon: '❓' };
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
      label: 'تاریخ ایجاد',
      sortable: true,
      render: (value) => (
        <span className="text-gray-400 text-sm">
          {new Date(String(value)).toLocaleDateString('fa-IR')}
        </span>
      )
    }
  ];

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment =>
    payment.gamenetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customerMobile.includes(searchTerm) ||
    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate data
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <ContentArea className="space-y-4 sm:space-y-6" overflow="hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text">مدیریت پرداخت‌ها</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">مدیریت و نظارت بر پرداخت‌های دریافتی</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <Badge variant="primary" size="md">
          💳 {payments.length} پرداخت
        </Badge>
        <Badge variant="success" size="md">
          ✅ {payments.filter(p => p.status === 'completed').length} تکمیل شده
        </Badge>
        <Badge variant="warning" size="md">
          ⏳ {payments.filter(p => p.status === 'pending').length} در انتظار
        </Badge>
        <Badge variant="danger" size="md">
          ❌ {payments.filter(p => p.status === 'failed').length} ناموفق
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجو در پرداخت‌ها..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Payments Table */}
      <Table
        data={paginatedPayments}
        columns={columns}
        searchable={false}
        loading={isLoading}
        emptyMessage="هیچ پرداختی یافت نشد"
        className="gx-neon"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredPayments.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />  
    </ContentArea>
  );
}
