'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Badge, Table, TableColumn, TableAction, Pagination } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import ContentArea from '../../components/ContentArea';
import ProtectedRoute from '../../components/ProtectedRoute';
import Swal from 'sweetalert2';

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
  status: 'active' | 'inactive';
  balance: number;
  debt: number;
}

interface DebtTransaction {
  id: string;
  userId: string;
  amount: number;
  submitter: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

function UsersPageContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isDebtHistoryModalOpen, setIsDebtHistoryModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToUpdateBalance, setUserToUpdateBalance] = useState<User | null>(null);
  const [userForDebtHistory, setUserForDebtHistory] = useState<User | null>(null);
  const [debtHistory, setDebtHistory] = useState<DebtTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'balance' | 'debt'>('balance');
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'علی احمدی',
        email: 'ali.ahmadi@example.com',
        mobile: '09123456789',
        createdAt: '2024-01-15',
        status: 'active',
        balance: 1500000,
        debt: 0
      },
      {
        id: '2',
        name: 'فاطمه کریمی',
        email: 'fateme.karimi@example.com',
        mobile: '09187654321',
        createdAt: '2024-02-20',
        status: 'active',
        balance: 750000,
        debt: 50000
      },
      {
        id: '3',
        name: 'محمد رضایی',
        email: 'mohammad.rezaei@example.com',
        mobile: '09111111111',
        createdAt: '2024-03-10',
        status: 'inactive',
        balance: 0,
        debt: 200000
      },
      {
        id: '4',
        name: 'زهرا محمدی',
        email: 'zahra.mohammadi@example.com',
        mobile: '09222222222',
        createdAt: '2024-03-25',
        status: 'active',
        balance: 2300000,
        debt: 0
      },
      {
        id: '5',
        name: 'حسن نوری',
        email: 'hasan.nouri@example.com',
        mobile: '09333333333',
        createdAt: '2024-04-05',
        status: 'active',
        balance: 500000,
        debt: 100000
      },
      {
        id: '6',
        name: 'مریم صادقی',
        email: 'maryam.sadeghi@example.com',
        mobile: '09444444444',
        createdAt: '2024-04-12',
        status: 'active',
        balance: 1800000,
        debt: 0
      },
      {
        id: '7',
        name: 'رضا حسینی',
        email: 'reza.hosseini@example.com',
        mobile: '09555555555',
        createdAt: '2024-04-18',
        status: 'inactive',
        balance: 0,
        debt: 300000
      },
      {
        id: '8',
        name: 'سارا احمدی',
        email: 'sara.ahmadi@example.com',
        mobile: '09666666666',
        createdAt: '2024-04-22',
        status: 'active',
        balance: 950000,
        debt: 75000
      }
    ];

    // Mock debt history data
    const mockDebtHistory: DebtTransaction[] = [
      {
        id: '1',
        userId: '2',
        amount: 50000,
        submitter: 'مدیر سیستم',
        date: '2024-04-20',
        time: '14:30',
        status: 'approved'
      },
      {
        id: '2',
        userId: '3',
        amount: 200000,
        submitter: 'مدیر گیم نت',
        date: '2024-04-18',
        time: '16:45',
        status: 'approved'
      },
      {
        id: '3',
        userId: '5',
        amount: 100000,
        submitter: 'مدیر سیستم',
        date: '2024-04-15',
        time: '10:20',
        status: 'approved'
      },
      {
        id: '4',
        userId: '7',
        amount: 300000,
        submitter: 'مدیر گیم نت',
        date: '2024-04-12',
        time: '19:15',
        status: 'approved'
      },
      {
        id: '5',
        userId: '8',
        amount: 75000,
        submitter: 'مدیر سیستم',
        date: '2024-04-10',
        time: '13:00',
        status: 'approved'
      },
      {
        id: '6',
        userId: '2',
        amount: 25000,
        submitter: 'مدیر گیم نت',
        date: '2024-04-08',
        time: '11:30',
        status: 'pending'
      },
      {
        id: '7',
        userId: '5',
        amount: 50000,
        submitter: 'مدیر سیستم',
        date: '2024-04-05',
        time: '15:45',
        status: 'rejected'
      },
      {
        id: '8',
        userId: '1',
        amount: 120000,
        submitter: 'مدیر گیم نت',
        date: '2024-04-22',
        time: '09:15',
        status: 'approved'
      },
      {
        id: '9',
        userId: '4',
        amount: 85000,
        submitter: 'مدیر سیستم',
        date: '2024-04-21',
        time: '17:30',
        status: 'approved'
      },
      {
        id: '10',
        userId: '6',
        amount: 150000,
        submitter: 'مدیر گیم نت',
        date: '2024-04-19',
        time: '12:45',
        status: 'pending'
      },
      {
        id: '11',
        userId: '2',
        amount: 30000,
        submitter: 'مدیر سیستم',
        date: '2024-04-17',
        time: '14:20',
        status: 'approved'
      },
      {
        id: '12',
        userId: '8',
        amount: 95000,
        submitter: 'مدیر گیم نت',
        date: '2024-04-16',
        time: '11:10',
        status: 'approved'
      },
      {
        id: '13',
        userId: '3',
        amount: 180000,
        submitter: 'مدیر سیستم',
        date: '2024-04-14',
        time: '16:00',
        status: 'approved'
      },
      {
        id: '14',
        userId: '5',
        amount: 65000,
        submitter: 'مدیر گیم نت',
        date: '2024-04-13',
        time: '13:25',
        status: 'pending'
      },
      {
        id: '15',
        userId: '7',
        amount: 220000,
        submitter: 'مدیر سیستم',
        date: '2024-04-11',
        time: '10:40',
        status: 'approved'
      }
    ];

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setDebtHistory(mockDebtHistory);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Table columns configuration
  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'نام کاربر',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">👤</span>
          <span className="font-semibold text-white">{String(value)}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'ایمیل',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'mobile',
      label: 'موبایل',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'balance',
      label: 'موجودی',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center justify-center gap-2 min-w-[200px]">
          <span className="text-green-400 font-semibold">
            {Number(value).toLocaleString('fa-IR')} تومان
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleIncreaseBalance(item);
            }}
            className="btn-wave flex-shrink-0"
          >
            ➕
          </Button>
        </div>
      )
    },
    {
      key: 'debt',
      label: 'بدهی',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center justify-center gap-2 min-w-[200px]">
          <span className={`font-semibold ${Number(value) > 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {Number(value).toLocaleString('fa-IR')} تومان
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDebtHistory(item);
            }}
            className="btn-wave flex-shrink-0"
          >
            📋
          </Button>
        </div>
      )
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      render: (value) => (
        <Badge variant={String(value) === 'active' ? 'success' : 'secondary'}>
          {String(value) === 'active' ? 'فعال' : 'غیرفعال'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'تاریخ عضویت',
      sortable: true,
      render: (value) => <span className="text-gray-400">{String(value)}</span>
    }
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      mobile: ''
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleIncreaseBalance = (user: User) => {
    setUserToUpdateBalance(user);
    setBalanceAmount('');
    setTransactionType('balance');
    setIsBalanceModalOpen(true);
  };

  const handleViewDebtHistory = (user: User) => {
    setUserForDebtHistory(user);
    setIsDebtHistoryModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!balanceAmount || parseFloat(balanceAmount) <= 0) {
      Swal.fire({
        title: 'خطا',
        text: 'لطفاً مبلغ معتبری وارد کنید',
        icon: 'error',
        confirmButtonText: 'باشه',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    if (userToUpdateBalance) {
      const amount = parseFloat(balanceAmount);
      const actionText = transactionType === 'balance' ? 'افزایش یافت' : 'اضافه شد';
      const fieldText = transactionType === 'balance' ? 'موجودی' : 'بدهی';
      const userName = userToUpdateBalance.name;
      
      // Update the user data
      setUsers(prev => prev.map(u => 
        u.id === userToUpdateBalance.id 
          ? { 
              ...u, 
              balance: transactionType === 'balance' ? u.balance + amount : u.balance,
              debt: transactionType === 'debt' ? u.debt + amount : u.debt
            }
          : u
      ));
      
      // Close modal first
      setBalanceAmount('');
      setUserToUpdateBalance(null);
      setIsBalanceModalOpen(false);
      
      // Show success toast after modal closes
      setTimeout(() => {
        Swal.fire({
          title: 'موفقیت',
          text: `${fieldText} کاربر ${userName} با موفقیت ${actionText}!`,
          icon: 'success',
          confirmButtonText: 'باشه',
          confirmButtonColor: '#10b981',
          timer: 3000,
          timerProgressBar: true
        });
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      alert('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('لطفاً یک ایمیل معتبر وارد کنید');
      return;
    }

    // Mobile validation (Iranian mobile number)
    const mobileRegex = /^09\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      alert('لطفاً یک شماره موبایل معتبر وارد کنید');
      return;
    }

    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ));
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        balance: 0,
        debt: 0
      };
      setUsers(prev => [newUser, ...prev]);
    }
    
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      mobile: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.balance.toString().includes(searchTerm) ||
    user.debt.toString().includes(searchTerm)
  );

  // Paginate data
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Table actions configuration
  const actions: TableAction<User>[] = [
    {
      label: 'ویرایش',
      icon: '✏️',
      onClick: handleEditUser,
      variant: 'secondary'
    },
    {
      label: 'حذف',
      icon: '🗑️',
      onClick: handleDeleteUser,
      variant: 'danger'
    }
  ];

  return (
    <ContentArea className="space-y-4 sm:space-y-6" overflow="hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text">مدیریت کاربران</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">مدیریت و نظارت بر کاربران سیستم</p>
        </div>
        <Button
          onClick={handleAddUser}
          variant="primary"
          size="md"
          className="btn-wave w-full sm:w-auto"
        >
          <span className="sm:hidden">➕ افزودن</span>
          <span className="hidden sm:inline">➕ افزودن کاربر جدید</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <Badge variant="primary" size="md">
          👥 {users.length} کاربر
        </Badge>
        <Badge variant="success" size="md">
          🟢 {users.filter(u => u.status === 'active').length} فعال
        </Badge>
        <Badge variant="secondary" size="md">
          💰 {users.reduce((sum, u) => sum + u.balance, 0).toLocaleString('fa-IR')} تومان کل موجودی
        </Badge>
        <Badge variant="danger" size="md">
          💸 {users.reduce((sum, u) => sum + u.debt, 0).toLocaleString('fa-IR')} تومان کل بدهی
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجو در کاربران..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Users Table */}
      <Table
        data={paginatedUsers}
        columns={columns}
        actions={actions}
        searchable={false}
        loading={isLoading}
        emptyMessage="هیچ کاربری یافت نشد"
        className="gx-neon"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="نام کاربر"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="نام کاربر را وارد کنید"
            required
            fullWidth
          />
          
          <Input
            label="ایمیل"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="ایمیل کاربر را وارد کنید"
            required
            fullWidth
          />
          
          <Input
            label="شماره موبایل"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="شماره موبایل کاربر را وارد کنید"
            required
            fullWidth
          />
          
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="outline"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingUser ? 'ویرایش' : 'افزودن'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="تأیید حذف کاربر"
        size="md"
        primaryAction={{
          label: "حذف",
          onClick: confirmDelete,
          variant: "danger"
        }}
        secondaryAction={{
          label: "انصراف",
          onClick: cancelDelete
        }}
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
            <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            آیا از حذف این کاربر اطمینان دارید؟
          </h3>
          {userToDelete && (
            <div className="text-gray-300 text-sm">
              <p className="font-medium">{userToDelete.name}</p>
              <p className="text-gray-400">ایمیل: {userToDelete.email}</p>
            </div>
          )}
          <p className="text-gray-400 text-sm mt-4">
            این عمل قابل بازگشت نیست.
          </p>
        </div>
      </Modal>

      {/* Increase Balance Modal */}
      <Modal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        title={transactionType === 'balance' ? 'افزایش موجودی کاربر' : 'افزودن بدهی کاربر'}
        size="md"
      >
        <form onSubmit={handleBalanceSubmit} className="space-y-4">
          {userToUpdateBalance && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">اطلاعات کاربر</h3>
              <p className="text-gray-300">نام: {userToUpdateBalance.name}</p>
              <p className="text-gray-300">ایمیل: {userToUpdateBalance.email}</p>
              <p className="text-gray-300">موجودی فعلی: {userToUpdateBalance.balance.toLocaleString('fa-IR')} تومان</p>
              <p className="text-gray-300">بدهی فعلی: {userToUpdateBalance.debt.toLocaleString('fa-IR')} تومان</p>
            </div>
          )}
          
          {/* Transaction Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">نوع تراکنش</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTransactionType('balance')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                  transactionType === 'balance'
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                💰 افزایش موجودی
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('debt')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                  transactionType === 'debt'
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                💸 افزودن بدهی
              </button>
            </div>
          </div>
          
          <Input
            label={transactionType === 'balance' ? 'مبلغ افزایش (تومان)' : 'مبلغ بدهی (تومان)'}
            name="balanceAmount"
            type="number"
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
            placeholder="مبلغ مورد نظر را وارد کنید"
            required
            fullWidth
          />
          
          <div className="grid grid-cols-3 gap-3">
            {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setBalanceAmount(amount.toString())}
                className="btn-wave"
              >
                {amount.toLocaleString('fa-IR')}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={() => setIsBalanceModalOpen(false)}
              variant="outline"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {transactionType === 'balance' ? 'افزایش موجودی' : 'افزودن بدهی'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Debt History Modal */}
      <Modal
        isOpen={isDebtHistoryModalOpen}
        onClose={() => setIsDebtHistoryModalOpen(false)}
        title="تاریخچه بدهی کاربر"
        size="lg"
      >
        {userForDebtHistory && (
          <div className="space-y-4">
            {/* User Info */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">اطلاعات کاربر</h3>
              <p className="text-gray-300">نام: {userForDebtHistory.name}</p>
              <p className="text-gray-300">ایمیل: {userForDebtHistory.email}</p>
              <p className="text-gray-300">بدهی فعلی: {userForDebtHistory.debt.toLocaleString('fa-IR')} تومان</p>
            </div>

            {/* Debt History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-3">#ID</th>
                    <th className="px-3 py-3">مبلغ</th>
                    <th className="px-3 py-3">ثبت کننده</th>
                    <th className="px-3 py-3">تاریخ</th>
                    <th className="px-3 py-3">زمان</th>
                  </tr>
                </thead>
                <tbody>
                  {debtHistory
                    .filter(transaction => transaction.userId === userForDebtHistory.id)
                    .map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                        <td className="px-3 py-3 text-gray-300">#{transaction.id}</td>
                        <td className="px-3 py-3 text-red-400 font-semibold">
                          {transaction.amount.toLocaleString('fa-IR')} تومان
                        </td>
                        <td className="px-3 py-3 text-gray-300">{transaction.submitter}</td>
                        <td className="px-3 py-3 text-gray-300">{transaction.date}</td>
                        <td className="px-3 py-3 text-gray-300">{transaction.time}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              
              {/* Empty State */}
              {debtHistory.filter(transaction => 
                transaction.userId === userForDebtHistory.id
              ).length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">📋</div>
                  <p className="text-gray-400">هیچ بدهی ثبت شده‌ای برای این کاربر وجود ندارد</p>
                </div>
              )}
            </div>

            {/* Summary */}
            {debtHistory.filter(transaction => 
              transaction.userId === userForDebtHistory.id
            ).length > 0 && (
              <div className="bg-gray-800/30 rounded-lg p-4 mt-4">
                <h4 className="text-white font-semibold mb-2">خلاصه بدهی‌ها</h4>
                <div className="text-sm">
                  <span className="text-gray-400">کل بدهی‌ها:</span>
                  <span className="text-red-400 font-semibold mr-2">
                    {debtHistory
                      .filter(t => t.userId === userForDebtHistory.id)
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setIsDebtHistoryModalOpen(false)}
                variant="outline"
              >
                بستن
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </ContentArea>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <UsersPageContent />
    </ProtectedRoute>
  );
}
