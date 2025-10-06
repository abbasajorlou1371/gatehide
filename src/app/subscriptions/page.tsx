'use client';

import { useState, useEffect } from 'react';
import { Button, Badge, Table, TableColumn, TableAction, Pagination } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import ContentArea from '../../components/ContentArea';

interface SubscriptionPlan extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: '',
    isActive: true
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPlans: SubscriptionPlan[] = [
      {
        id: '1',
        name: 'پلن پایه',
        description: 'پلن مناسب برای شروع کار',
        price: 50000,
        duration: 1,
        features: ['دسترسی به 5 گیم نت', 'پشتیبانی ایمیل', 'گزارشات ماهانه'],
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'پلن حرفه‌ای',
        description: 'پلن مناسب برای کسب‌وکارهای متوسط',
        price: 150000,
        duration: 3,
        features: ['دسترسی به 15 گیم نت', 'پشتیبانی تلفنی', 'گزارشات هفتگی', 'آنالیز پیشرفته'],
        isActive: true,
        createdAt: '2024-02-20'
      },
      {
        id: '3',
        name: 'پلن سازمانی',
        description: 'پلن مناسب برای سازمان‌های بزرگ',
        price: 500000,
        duration: 12,
        features: ['دسترسی نامحدود', 'پشتیبانی 24/7', 'گزارشات روزانه', 'API دسترسی', 'مدیریت چند کاربره'],
        isActive: true,
        createdAt: '2024-03-10'
      },
      {
        id: '4',
        name: 'پلن آزمایشی',
        description: 'پلن رایگان برای تست',
        price: 0,
        duration: 1,
        features: ['دسترسی به 1 گیم نت', 'پشتیبانی محدود'],
        isActive: false,
        createdAt: '2024-03-25'
      },
      {
        id: '5',
        name: 'پلن سالانه',
        description: 'پلن با تخفیف ویژه برای خرید سالانه',
        price: 400000,
        duration: 12,
        features: ['دسترسی به 20 گیم نت', 'پشتیبانی تلفنی', 'گزارشات ماهانه', 'تخفیف 20%'],
        isActive: true,
        createdAt: '2024-04-05'
      }
    ];

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setPlans(mockPlans);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Table columns configuration
  const columns: TableColumn<SubscriptionPlan>[] = [
    {
      key: 'name',
      label: 'نام پلن',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <span className="font-semibold text-white">{String(value)}</span>
        </div>
      )
    },
    {
      key: 'description',
      label: 'توضیحات',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'price',
      label: 'قیمت',
      sortable: true,
      render: (value) => (
        <span className="text-gray-300">
          {Number(value) === 0 ? 'رایگان' : `${Number(value).toLocaleString('fa-IR')} تومان`}
        </span>
      )
    },
    {
      key: 'duration',
      label: 'مدت',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)} ماه</span>
    },
    {
      key: 'features',
      label: 'ویژگی‌ها',
      sortable: false,
      render: (value) => (
        <span className="text-gray-300">{Array.isArray(value) ? value.length : 0} ویژگی</span>
      )
    },
    {
      key: 'isActive',
      label: 'وضعیت',
      sortable: true,
      render: (value) => (
        <Badge variant={Boolean(value) ? 'success' : 'secondary'}>
          {Boolean(value) ? 'فعال' : 'غیرفعال'}
        </Badge>
      )
    }
  ];


  const handleAddPlan = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      features: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      features: plan.features.join('\n'),
      isActive: plan.isActive
    });
    setIsModalOpen(true);
  };

  const handleDeletePlan = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (planToDelete) {
      setPlans(prev => prev.filter(p => p.id !== planToDelete.id));
      setPlanToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setPlanToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPlan) {
      // Update existing plan
      setPlans(prev => prev.map(p => 
        p.id === editingPlan.id 
          ? { 
              ...p, 
              name: formData.name,
              description: formData.description,
              price: parseInt(formData.price),
              duration: parseInt(formData.duration),
              features: formData.features.split('\n').filter(f => f.trim()),
              isActive: formData.isActive
            }
          : p
      ));
    } else {
      // Add new plan
      const newPlan: SubscriptionPlan = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        features: formData.features.split('\n').filter(f => f.trim()),
        isActive: formData.isActive,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPlans(prev => [newPlan, ...prev]);
    }
    
    setIsModalOpen(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      features: '',
      isActive: true
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Filter plans based on search term
  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate data
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Table actions configuration
  const actions: TableAction<SubscriptionPlan>[] = [
    {
      label: 'ویرایش',
      icon: '✏️',
      onClick: handleEditPlan,
      variant: 'secondary'
    },
    {
      label: 'حذف',
      icon: '🗑️',
      onClick: handleDeletePlan,
      variant: 'danger'
    }
  ];


  const formatPrice = (price: number) => {
    return price === 0 ? 'رایگان' : `${price.toLocaleString('fa-IR')} تومان`;
  };

  return (
    <ContentArea className="space-y-4 sm:space-y-6" overflow="hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text">مدیریت پلن‌های اشتراک</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">مدیریت و نظارت بر پلن‌های اشتراک موجود</p>
        </div>
        <Button
          onClick={handleAddPlan}
          variant="primary"
          size="md"
          className="btn-wave w-full sm:w-auto"
        >
          <span className="sm:hidden">➕ افزودن</span>
          <span className="hidden sm:inline">➕ افزودن پلن</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <Badge variant="primary" size="md">
          📊 {plans.length} پلن
        </Badge>
        <Badge variant="success" size="md">
          🟢 {plans.filter(p => p.isActive).length} فعال
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجو در پلن‌های اشتراک..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Plans Table */}
      <Table
        data={paginatedPlans}
        columns={columns}
        actions={actions}
        searchable={false}
        loading={isLoading}
        emptyMessage="هیچ پلنی یافت نشد"
        className="gx-neon"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredPlans.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />


      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? 'ویرایش پلن اشتراک' : 'افزودن پلن اشتراک جدید'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">نام پلن</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="نام پلن را وارد کنید"
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">قیمت (تومان)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="قیمت را وارد کنید"
                required
                min="0"
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="توضیحات پلن را وارد کنید"
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">مدت (ماه)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="مدت را وارد کنید"
                required
                min="1"
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">وضعیت</label>
              <select
                name="isActive"
                value={formData.isActive.toString()}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              >
                <option value="true">فعال</option>
                <option value="false">غیرفعال</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ویژگی‌ها (هر ویژگی در یک خط)</label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              placeholder="ویژگی‌های پلن را وارد کنید (هر ویژگی در یک خط)"
              required
              rows={4}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
            />
          </div>
          
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
              {editingPlan ? 'ویرایش' : 'افزودن'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="تأیید حذف پلن اشتراک"
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
            آیا از حذف این پلن اشتراک اطمینان دارید؟
          </h3>
          {planToDelete && (
            <div className="text-gray-300 text-sm">
              <p className="font-medium">{planToDelete.name}</p>
              <p className="text-gray-400">قیمت: {formatPrice(planToDelete.price)}</p>
            </div>
          )}
          <p className="text-gray-400 text-sm mt-4">
            این عمل قابل بازگشت نیست.
          </p>
        </div>
      </Modal>

    </ContentArea>
  );
}
