'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Button, Badge, Table, TableColumn, TableAction, Pagination } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import ContentArea from '../../components/ContentArea';
import { SubscriptionPlanService, SubscriptionPlan, CreatePlanRequest, UpdatePlanRequest } from '../../services/subscriptionPlanService';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { formatNumberWithCommas, parseFormattedNumber } from '../../utils/numberFormat';


// Remove duplicate interface - using the one from service
function SubscriptionsPageContent() {
  const { token } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const isFetchingRef = useRef(false); // Request deduplication using ref

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    plan_type: 'monthly' as 'trial' | 'monthly' | 'annual',
    price: '',
    annual_discount_percentage: '',
    trial_duration_days: '',
    is_active: true
  });

  // Formatted price for display (with commas)
  const [formattedPrice, setFormattedPrice] = useState('');

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchPlans = useCallback(async () => {
    if (!token || isFetchingRef.current) return; // Prevent duplicate requests
    
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const response = await SubscriptionPlanService.getAllPlans(token, {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });
      setPlans(response.data || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans([]); // Ensure plans is always an array
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [token, itemsPerPage, currentPage]);

  useEffect(() => {
    if (token) {
      fetchPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentPage]); // Intentionally excluding fetchPlans to prevent infinite loops

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
      key: 'plan_type',
      label: 'نوع پلن',
      render: (value) => {
        const typeLabels = {
          trial: 'آزمایشی',
          monthly: 'ماهانه',
          annual: 'سالانه'
        };
        const typeColors = {
          trial: 'warning',
          monthly: 'primary',
          annual: 'success'
        };
        return (
          <Badge variant={typeColors[value as keyof typeof typeColors] as 'primary' | 'secondary' | 'success' | 'warning' | 'danger'}>
            {typeLabels[value as keyof typeof typeLabels]}
          </Badge>
        );
      }
    },
      {
        key: 'price',
        label: 'قیمت (برای هر دستگاه)',
      render: (value, row) => {
        const price = Number(value);
        const discount = row.annual_discount_percentage;
        const effectivePrice = discount ? price * (1 - discount / 100) : price;
        
        return (
          <div className="text-gray-300">
            {price === 0 ? 'رایگان' : (
              <div>
                <div className="font-medium">{effectivePrice.toLocaleString('fa-IR')} تومان</div>
                {discount && discount > 0 && (
                  <div className="text-xs text-green-400">
                    {discount}% تخفیف
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'subscription_count',
      label: 'تعداد اشتراک',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="font-medium text-white">
            {Number(value) || 0} گیم نت
          </span>
        </div>
      )
    },
    {
      key: 'is_active',
      label: 'وضعیت',
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
      plan_type: 'monthly',
      price: '',
      annual_discount_percentage: '',
      trial_duration_days: '',
      is_active: true
    });
    setFormattedPrice('');
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      plan_type: plan.plan_type,
      price: plan.price.toString(),
      annual_discount_percentage: plan.annual_discount_percentage?.toString() || '',
      trial_duration_days: plan.trial_duration_days?.toString() || '',
      is_active: plan.is_active
    });
    setFormattedPrice(formatNumberWithCommas(plan.price.toString()));
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleDeletePlan = async (plan: SubscriptionPlan) => {
    const result = await Swal.fire({
      title: 'تأیید حذف پلن اشتراک',
      html: `
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
            <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">
            آیا از حذف این پلن اشتراک اطمینان دارید؟
          </h3>
          <div class="text-gray-300 text-sm">
            <p class="font-medium">${plan.name}</p>
            <p class="text-gray-400">قیمت: ${formatPrice(plan.price)} (برای هر دستگاه)</p>
          </div>
          <p class="text-red-400 text-sm mt-2">این عمل قابل بازگشت نیست.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'حذف',
      cancelButtonText: 'انصراف',
      reverseButtons: true,
      theme: 'dark',
      customClass: {
        popup: 'font-sans',
        title: 'text-right',
        htmlContainer: 'text-right'
      }
    });

    if (result.isConfirmed && token) {
      setIsLoading(true);
      try {
        await SubscriptionPlanService.deletePlan(token, plan.id);
        // Plans will be refreshed automatically by useEffect
        
        // Show success message
        Swal.fire({
          title: 'موفق!',
          text: 'پلن اشتراک با موفقیت حذف شد',
          icon: 'success',
          confirmButtonText: 'باشه',
          theme: 'dark',
          customClass: {
            popup: 'font-sans',
            title: 'text-right'
          }
        });
      } catch (error: unknown) {
        console.error('Failed to delete plan:', error);
        
        // Type guard to check if error has status property
        const isErrorWithStatus = (err: unknown): err is { status: number } => {
          return typeof err === 'object' && err !== null && 'status' in err;
        };
        
        // Handle specific error cases
        if (isErrorWithStatus(error) && error.status === 409) {
          // Conflict - plan has active subscriptions
          Swal.fire({
            title: 'خطا!',
            text: 'این پلن دارای اشتراک‌های فعال است و نمی‌توان آن را حذف کرد. لطفاً ابتدا تمام اشتراک‌های فعال را لغو کنید.',
            icon: 'error',
            confirmButtonText: 'باشه',
            theme: 'dark',
            customClass: {
              popup: 'font-sans',
              title: 'text-right'
            }
          });
        } else if (isErrorWithStatus(error) && error.status === 404) {
          // Not found
          Swal.fire({
            title: 'خطا!',
            text: 'پلن اشتراک یافت نشد',
            icon: 'error',
            confirmButtonText: 'باشه',
            theme: 'dark',
            customClass: {
              popup: 'font-sans',
              title: 'text-right'
            }
          });
        } else {
          // Other errors
          Swal.fire({
            title: 'خطا!',
            text: 'خطا در حذف پلن اشتراک. لطفاً دوباره تلاش کنید.',
            icon: 'error',
            confirmButtonText: 'باشه',
            theme: 'dark',
            customClass: {
              popup: 'font-sans',
              title: 'text-right'
            }
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'نام پلن الزامی است';
    }

    if (!formData.plan_type) {
      errors.plan_type = 'نوع پلن الزامی است';
    }

    // Convert Persian plan type to English for validation
    const englishPlanType = mapPlanTypeToEnglish(formData.plan_type);

    if (englishPlanType !== 'trial' && (!formData.price || formData.price.trim() === '')) {
      errors.price = 'قیمت الزامی است';
    }

    if (englishPlanType === 'trial' && !formData.trial_duration_days) {
      errors.trial_duration_days = 'مدت دوره آزمایشی الزامی است';
    }

    if (englishPlanType === 'annual' && formData.annual_discount_percentage) {
      const discount = parseFloat(formData.annual_discount_percentage);
      if (discount < 0 || discount > 100) {
        errors.annual_discount_percentage = 'درصد تخفیف باید بین 0 تا 100 باشد';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function to convert Persian plan type to English
  const mapPlanTypeToEnglish = (persianType: string): 'trial' | 'monthly' | 'annual' => {
    const mapping: Record<string, 'trial' | 'monthly' | 'annual'> = {
      'آزمایشی': 'trial',
      'ماهانه': 'monthly',
      'سالانه': 'annual',
      'trial': 'trial',
      'monthly': 'monthly',
      'annual': 'annual'
    };
    return mapping[persianType] || 'monthly';
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) return;
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      if (editingPlan) {
        // Update existing plan
        const updateData: UpdatePlanRequest = {
          name: formData.name,
          plan_type: mapPlanTypeToEnglish(formData.plan_type),
          price: parseFormattedNumber(formData.price),
          annual_discount_percentage: formData.annual_discount_percentage ? parseFloat(formData.annual_discount_percentage) : undefined,
          trial_duration_days: formData.trial_duration_days ? parseInt(formData.trial_duration_days) : undefined,
          is_active: formData.is_active,
        };
        
        await SubscriptionPlanService.updatePlan(token, editingPlan.id, updateData);
      } else {
        // Create new plan
        const createData: CreatePlanRequest = {
          name: formData.name,
          plan_type: mapPlanTypeToEnglish(formData.plan_type),
          price: parseFormattedNumber(formData.price),
          annual_discount_percentage: formData.annual_discount_percentage ? parseFloat(formData.annual_discount_percentage) : undefined,
          trial_duration_days: formData.trial_duration_days ? parseInt(formData.trial_duration_days) : undefined,
          is_active: formData.is_active,
        };
        
        await SubscriptionPlanService.createPlan(token, createData);
      }
      
      // Plans will be refreshed automatically by useEffect
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save plan:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'price') {
      // For price field, store the raw numeric value and formatted display value
      const numericValue = parseFormattedNumber(value);
      const formattedValue = formatNumberWithCommas(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: numericValue.toString()
      }));
      setFormattedPrice(formattedValue);
    } else {
      let processedValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      
      // Handle is_active field conversion from string to boolean
      if (name === 'is_active') {
        processedValue = value === 'true';
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }
  };

  // Filter plans based on search term
  const filteredPlans = (plans || []).filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.plan_type.toLowerCase().includes(searchTerm.toLowerCase())
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
          📊 {(plans || []).length} پلن
        </Badge>
        <Badge variant="success" size="md">
          🟢 {(plans || []).filter(p => p.is_active).length} فعال
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
      <Table<SubscriptionPlan>
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
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">اطلاعات پایه</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نام پلن *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="نام پلن را وارد کنید"
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نوع پلن *</label>
                <select
                  name="plan_type"
                  value={formData.plan_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                >
                  <option value="trial">آزمایشی</option>
                  <option value="monthly">ماهانه</option>
                  <option value="annual">سالانه</option>
                </select>
                {validationErrors.plan_type && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.plan_type}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">اطلاعات قیمت‌گذاری</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  قیمت (تومان) (برای هر دستگاه) {formData.plan_type !== 'trial' && '*'}
                </label>
                <input
                  type="text"
                  name="price"
                  value={formattedPrice}
                  onChange={handleInputChange}
                  placeholder="قیمت را وارد کنید (مثال: 1,000,000) - برای هر دستگاه"
                  disabled={formData.plan_type === 'trial'}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none disabled:opacity-50"
                />
                {validationErrors.price && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.price}</p>
                )}
              </div>
              
              {formData.plan_type === 'annual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">درصد تخفیف سالانه</label>
                  <input
                    type="number"
                    name="annual_discount_percentage"
                    value={formData.annual_discount_percentage}
                    onChange={handleInputChange}
                    placeholder="درصد تخفیف (0-100)"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                  {validationErrors.annual_discount_percentage && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.annual_discount_percentage}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Trial Period */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">دوره آزمایشی</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.plan_type === 'trial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">مدت دوره آزمایشی (روز) *</label>
                  <input
                    type="number"
                    name="trial_duration_days"
                    value={formData.trial_duration_days}
                    onChange={handleInputChange}
                    placeholder="مدت دوره آزمایشی"
                    min="1"
                    max="365"
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                  {validationErrors.trial_duration_days && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.trial_duration_days}</p>
                  )}
                </div>
              )}
            </div>
          </div>


          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">وضعیت</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">وضعیت پلن</label>
              <select
                name="is_active"
                value={formData.is_active.toString()}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              >
                <option value="true">فعال</option>
                <option value="false">غیرفعال</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-600">
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

    </ContentArea>
  );
}

export default function SubscriptionsPage() {
  return (
    <ProtectedRoute>
      <SubscriptionsPageContent />
    </ProtectedRoute>
  );
}