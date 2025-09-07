'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Badge, Table, TableColumn, TableAction, Pagination } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import ContentArea from '../../components/ContentArea';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
  status: 'active' | 'inactive';
  balance: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToUpdateBalance, setUserToUpdateBalance] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
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
        balance: 1500000
      },
      {
        id: '2',
        name: 'فاطمه کریمی',
        email: 'fateme.karimi@example.com',
        mobile: '09187654321',
        createdAt: '2024-02-20',
        status: 'active',
        balance: 750000
      },
      {
        id: '3',
        name: 'محمد رضایی',
        email: 'mohammad.rezaei@example.com',
        mobile: '09111111111',
        createdAt: '2024-03-10',
        status: 'inactive',
        balance: 0
      },
      {
        id: '4',
        name: 'زهرا محمدی',
        email: 'zahra.mohammadi@example.com',
        mobile: '09222222222',
        createdAt: '2024-03-25',
        status: 'active',
        balance: 2300000
      },
      {
        id: '5',
        name: 'حسن نوری',
        email: 'hasan.nouri@example.com',
        mobile: '09333333333',
        createdAt: '2024-04-05',
        status: 'active',
        balance: 500000
      },
      {
        id: '6',
        name: 'مریم صادقی',
        email: 'maryam.sadeghi@example.com',
        mobile: '09444444444',
        createdAt: '2024-04-12',
        status: 'active',
        balance: 1800000
      },
      {
        id: '7',
        name: 'رضا حسینی',
        email: 'reza.hosseini@example.com',
        mobile: '09555555555',
        createdAt: '2024-04-18',
        status: 'inactive',
        balance: 0
      },
      {
        id: '8',
        name: 'سارا احمدی',
        email: 'sara.ahmadi@example.com',
        mobile: '09666666666',
        createdAt: '2024-04-22',
        status: 'active',
        balance: 950000
      }
    ];

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
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
          <span className="font-semibold text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'ایمیل',
      sortable: true,
      render: (value) => <span className="text-gray-300">{value}</span>
    },
    {
      key: 'mobile',
      label: 'موبایل',
      sortable: true,
      render: (value) => <span className="text-gray-300">{value}</span>
    },
    {
      key: 'balance',
      label: 'موجودی',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-semibold">
            {value.toLocaleString('fa-IR')} تومان
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleIncreaseBalance(item);
            }}
            className="btn-wave"
          >
            ➕
          </Button>
        </div>
      )
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'secondary'}>
          {value === 'active' ? 'فعال' : 'غیرفعال'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'تاریخ عضویت',
      sortable: true,
      render: (value) => <span className="text-gray-400">{value}</span>
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
    setIsBalanceModalOpen(true);
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
      alert('لطفاً مبلغ معتبری وارد کنید');
      return;
    }

    if (userToUpdateBalance) {
      const amount = parseFloat(balanceAmount);
      setUsers(prev => prev.map(u => 
        u.id === userToUpdateBalance.id 
          ? { ...u, balance: u.balance + amount }
          : u
      ));
      
      setBalanceAmount('');
      setUserToUpdateBalance(null);
      setIsBalanceModalOpen(false);
      
      alert(`موجودی کاربر ${userToUpdateBalance.name} با موفقیت افزایش یافت!`);
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
        balance: 0
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
    user.balance.toString().includes(searchTerm)
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
        title="افزایش موجودی کاربر"
        size="md"
      >
        <form onSubmit={handleBalanceSubmit} className="space-y-4">
          {userToUpdateBalance && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">اطلاعات کاربر</h3>
              <p className="text-gray-300">نام: {userToUpdateBalance.name}</p>
              <p className="text-gray-300">ایمیل: {userToUpdateBalance.email}</p>
              <p className="text-gray-300">موجودی فعلی: {userToUpdateBalance.balance.toLocaleString('fa-IR')} تومان</p>
            </div>
          )}
          
          <Input
            label="مبلغ افزایش (تومان)"
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
              افزایش موجودی
            </Button>
          </div>
        </form>
      </Modal>

    </ContentArea>
  );
}
