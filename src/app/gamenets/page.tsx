'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Input, Badge, Table, TableColumn, TableAction, Pagination } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import ContentArea from '../../components/ContentArea';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiClient, ApiResponse } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { toJalaliDisplay } from '../../utils/jalali';
import { API_CONFIG } from '../../config/api';
import Swal from 'sweetalert2';

interface Gamenet extends Record<string, unknown> {
  id: string;
  name: string;
  owner_name: string;
  owner_mobile: string;
  address: string;
  email: string;
  password?: string; // Optional, not displayed in UI
  license_attachment: string | null;
  created_at: string;
  updated_at: string;
}

interface GamenetFormData {
  name: string;
  owner_name: string;
  owner_mobile: string;
  address: string;
  email: string;
  license_attachment: File | null;
}

function GamenetsPageContent() {
  const { token } = useAuth();
  const [gamenets, setGamenets] = useState<Gamenet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGamenet, setEditingGamenet] = useState<Gamenet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const itemsPerPage = 10;
  
  // Search and pagination state
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Track last token that was used for fetching
  const lastFetchedTokenRef = useRef<string | null>(null);

  // Validation functions
  const validateForm = (data: GamenetFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
      errors.name = 'نام گیم نت الزامی است';
    } else if (data.name.trim().length < 2) {
      errors.name = 'نام گیم نت باید حداقل 2 کاراکتر باشد';
    }

    if (!data.owner_name.trim()) {
      errors.owner_name = 'نام مالک الزامی است';
    } else if (data.owner_name.trim().length < 2) {
      errors.owner_name = 'نام مالک باید حداقل 2 کاراکتر باشد';
    }

    if (!data.owner_mobile.trim()) {
      errors.owner_mobile = 'شماره موبایل الزامی است';
    } else if (!/^09\d{9}$/.test(data.owner_mobile.trim())) {
      errors.owner_mobile = 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد';
    }

    if (!data.email.trim()) {
      errors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'فرمت ایمیل صحیح نیست';
    }

    if (!data.address.trim()) {
      errors.address = 'آدرس الزامی است';
    } else if (data.address.trim().length < 10) {
      errors.address = 'آدرس باید حداقل 10 کاراکتر باشد';
    }

    return errors;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  // Form state
  const [formData, setFormData] = useState<GamenetFormData>({
    name: '',
    owner_name: '',
    owner_mobile: '',
    address: '',
    email: '',
    license_attachment: null
  });

  // API functions
  const fetchGamenets = useCallback(async (searchQuery: string = '', page: number = 1, pageSize: number = 10) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (page > 1) params.append('page', page.toString());
      if (pageSize !== 10) params.append('page_size', pageSize.toString());
      
      const url = `/gamenets/${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await apiClient.authenticatedRequest<ApiResponse<Gamenet[]>>(
        url,
        token,
        { method: 'GET' }
      );
      
      // Check if response has pagination data
      if (response.pagination) {
        setGamenets(response.data || []);
        setTotalItems(response.pagination.total_items);
        setTotalPages(response.pagination.total_pages);
      } else {
        // Fallback for non-paginated response
        setGamenets(response.data || []);
        setTotalItems(response.data ? response.data.length : 0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching gamenets:', err);
      setError('خطا در بارگذاری گیم نت‌ها');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Function to refresh data (for after create/update/delete)
  const refreshGamenets = useCallback(async () => {
    await fetchGamenets(searchTerm, currentPage, itemsPerPage);
  }, [fetchGamenets, searchTerm, currentPage, itemsPerPage]);

  const createGamenet = async (gamenetData: GamenetFormData) => {
    if (!token) throw new Error('No authentication token');
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', gamenetData.name);
    formData.append('owner_name', gamenetData.owner_name);
    formData.append('owner_mobile', gamenetData.owner_mobile);
    formData.append('address', gamenetData.address);
    formData.append('email', gamenetData.email);
    
    if (gamenetData.license_attachment) {
      formData.append('license_attachment', gamenetData.license_attachment);
    }
    
    const response = await apiClient.authenticatedRequestWithProgress<ApiResponse<Gamenet>>(
      '/gamenets/',
      token,
      {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary
      },
      (progress) => {
        setUploadProgress(progress);
        setIsUploading(progress < 100);
      }
    );
    return response.data;
  };

  const updateGamenet = async (id: string, gamenetData: GamenetFormData) => {
    if (!token) throw new Error('No authentication token');
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Always send all fields for update
    formData.append('name', gamenetData.name);
    formData.append('owner_name', gamenetData.owner_name);
    formData.append('owner_mobile', gamenetData.owner_mobile);
    formData.append('address', gamenetData.address);
    formData.append('email', gamenetData.email);
    
    if (gamenetData.license_attachment) {
      formData.append('license_attachment', gamenetData.license_attachment);
    }
    
    const response = await apiClient.authenticatedRequestWithProgress<ApiResponse<Gamenet>>(
      `/gamenets/${id}`,
      token,
      {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary
      },
      (progress) => {
        setUploadProgress(progress);
        setIsUploading(progress < 100);
      }
    );
    return response.data;
  };

  const deleteGamenet = async (id: string) => {
    if (!token) throw new Error('No authentication token');
    
    await apiClient.authenticatedRequest<ApiResponse<Record<string, never>>>(
      `/gamenets/${id}`,
      token,
      { method: 'DELETE' }
    );
  };

  const resendCredentials = async (id: string) => {
    if (!token) throw new Error('No authentication token');
    
    // Direct fetch without retry logic for faster failure feedback
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/gamenets/${id}/resend-credentials`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'خطای سرور' }));
      throw new Error(errorData.error || 'خطا در ارسال اطلاعات');
    }

    return await response.json();
  };


  // Fetch gamenets on mount and when token changes
  useEffect(() => {
    if (!token) return;
    
    // Only fetch if we haven't already loaded for this specific token
    if (lastFetchedTokenRef.current !== token) {
      lastFetchedTokenRef.current = token;
      fetchGamenets(searchTerm, currentPage, itemsPerPage);
    }
  }, [token, fetchGamenets, searchTerm, currentPage, itemsPerPage]); // Depend on all relevant variables

  // Table columns configuration
  const columns: TableColumn<Gamenet>[] = [
    {
      key: 'name',
      label: 'نام گیم نت',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎮</span>
          <span className="font-semibold text-white">{String(value)}</span>
        </div>
      )
    },
    {
      key: 'owner_name',
      label: 'مالک',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'owner_mobile',
      label: 'موبایل',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'email',
      label: 'ایمیل',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'address',
      label: 'آدرس',
      sortable: true,
      render: (value) => <span className="text-gray-300 truncate max-w-xs">{String(value)}</span>
    },
    {
      key: 'license_attachment',
      label: 'مجوز',
      sortable: false,
      render: (value) => {
        if (!value || !String(value).trim()) {
          return (
            <span className="text-gray-500 text-sm">
              <span className="text-gray-600">📄</span> ندارد
            </span>
          );
        }
        
        const licenseUrl = String(value);
        const fileName = licenseUrl.split('/').pop() || 'license';
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        
        // Determine file type icon
        let fileIcon = '📄';
        if (['pdf'].includes(fileExtension)) {
          fileIcon = '📕';
        } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
          fileIcon = '🖼️';
        } else if (['doc', 'docx'].includes(fileExtension)) {
          fileIcon = '📝';
        }
        
        return (
          <button
            onClick={() => window.open(licenseUrl, '_blank')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:bg-blue-900/20 px-2 py-1 rounded-md group"
            title={`مشاهده مجوز: ${fileName}`}
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">
              {fileIcon}
            </span>
            <span className="text-xs truncate max-w-20" title={fileName}>
              {fileName.length > 15 ? `${fileName.substring(0, 15)}...` : fileName}
            </span>
            <span className="text-blue-500 group-hover:text-blue-400 transition-colors duration-200">
              🔗
            </span>
          </button>
        );
      }
    },
    {
      key: 'created_at',
      label: 'تاریخ ایجاد',
      sortable: true,
      render: (value) => (
        <span className="text-gray-400" title={`تاریخ میلادی: ${String(value)}`}>
          {toJalaliDisplay(String(value))}
        </span>
      )
    }
  ];


  const handleAddGamenet = () => {
    setEditingGamenet(null);
    setFormData({
      name: '',
      owner_name: '',
      owner_mobile: '',
      address: '',
      email: '',
      license_attachment: null
    });
    clearValidationErrors();
    setIsUploading(false);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const handleEditGamenet = (gamenet: Gamenet) => {
    setEditingGamenet(gamenet);
    setFormData({
      name: gamenet.name,
      owner_name: gamenet.owner_name,
      owner_mobile: gamenet.owner_mobile,
      address: gamenet.address,
      email: gamenet.email,
      license_attachment: null // Reset file input for editing
    });
    clearValidationErrors();
    setIsUploading(false);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const handleDeleteGamenet = async (gamenet: Gamenet) => {
    const result = await Swal.fire({
      title: 'تأیید حذف گیم نت',
      html: `
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
            <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">
            آیا از حذف این گیم نت اطمینان دارید؟
          </h3>
          <div class="text-gray-300 text-sm">
            <p class="font-medium">${gamenet.name}</p>
            <p class="text-gray-400">مالک: ${gamenet.owner_name}</p>
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

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        setError(null);
        await deleteGamenet(gamenet.id);
        await refreshGamenets(); // Refresh the list
        
        // Show success message
        Swal.fire({
          title: 'موفق!',
          text: 'گیم نت با موفقیت حذف شد',
          icon: 'success',
          confirmButtonText: 'باشه',
          theme: 'dark',
          customClass: {
            popup: 'font-sans',
            title: 'text-right'
          }
        });
      } catch (err) {
        console.error('Error deleting gamenet:', err);
        
        // Show error message
        Swal.fire({
          title: 'خطا!',
          text: 'خطا در حذف گیم نت. لطفاً دوباره تلاش کنید.',
          icon: 'error',
          confirmButtonText: 'باشه',
          theme: 'dark',
          customClass: {
            popup: 'font-sans',
            title: 'text-right'
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendCredentials = async (gamenet: Gamenet) => {
    const result = await Swal.fire({
      title: 'ارسال اطلاعات ورود',
      html: `
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/20 mb-4">
            <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">
            ارسال اطلاعات ورود به پیامک
          </h3>
          <div class="text-gray-300 text-sm space-y-1">
            <p class="font-medium">${gamenet.name}</p>
            <p class="text-gray-400">مالک: ${gamenet.owner_name}</p>
            <p class="text-blue-400">📱 ${gamenet.owner_mobile}</p>
          </div>
          <p class="text-yellow-400 text-sm mt-3">
            رمز عبور جدید تولید شده و به موبایل ارسال می‌شود
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '📱 ارسال پیامک',
      cancelButtonText: 'انصراف',
      reverseButtons: true,
      theme: 'dark',
      customClass: {
        popup: 'font-sans',
        title: 'text-right',
        htmlContainer: 'text-right'
      }
    });

    if (result.isConfirmed) {
      // Show loading state
      Swal.fire({
        title: 'در حال ارسال...',
        html: `
          <div class="text-center">
            <div class="mx-auto mb-4">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
            <p class="text-gray-300 text-sm">
              در حال تولید رمز عبور جدید و ارسال پیامک...
            </p>
            <p class="text-blue-400 text-xs mt-2">
              📱 ${gamenet.owner_mobile}
            </p>
          </div>
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        theme: 'dark',
        customClass: {
          popup: 'font-sans',
          title: 'text-right',
          htmlContainer: 'text-right'
        }
      });

      try {
        setIsLoading(true);
        setError(null);
        await resendCredentials(gamenet.id);
        
        // Show success message
        Swal.fire({
          title: 'موفق!',
          html: `
            <div class="text-center">
              <p class="text-green-400 mb-2">✅ اطلاعات ورود با موفقیت ارسال شد</p>
              <p class="text-gray-300 text-sm">
                پیامک حاوی اطلاعات ورود به شماره:
              </p>
              <p class="text-blue-400 text-sm mt-1 font-medium">
                ${gamenet.owner_mobile}
              </p>
              <p class="text-gray-400 text-xs mt-2">
                ارسال شد.
              </p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'باشه',
          theme: 'dark',
          customClass: {
            popup: 'font-sans',
            title: 'text-right',
            htmlContainer: 'text-right'
          }
        });
      } catch (err) {
        console.error('Error resending credentials:', err);
        
        // Show error message
        Swal.fire({
          title: 'خطا!',
          text: 'خطا در ارسال اطلاعات ورود. لطفاً دوباره تلاش کنید.',
          icon: 'error',
          confirmButtonText: 'باشه',
          theme: 'dark',
          customClass: {
            popup: 'font-sans',
            title: 'text-right'
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors
    clearValidationErrors();
    
    try {
      setIsLoading(true);
      setError(null);
    
      if (editingGamenet) {
        // Update existing gamenet
        await updateGamenet(editingGamenet.id, formData);
      } else {
        // Add new gamenet
        await createGamenet(formData);
      }
      
      await fetchGamenets(); // Refresh the list
      setIsModalOpen(false);
      setFormData({
        name: '',
        owner_name: '',
        owner_mobile: '',
        address: '',
        email: '',
        license_attachment: null
      });
    } catch (err) {
      console.error('Error saving gamenet:', err);
      setError(editingGamenet ? 'خطا در ویرایش گیم نت' : 'خطا در افزودن گیم نت');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchGamenets(searchTerm, page, itemsPerPage);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchGamenets(value, 1, itemsPerPage);
  };

  // Table actions configuration
  const actions: TableAction<Gamenet>[] = [
    {
      label: 'ارسال اطلاعات',
      icon: '📧',
      onClick: handleResendCredentials,
      variant: 'primary'
    },
    {
      label: 'ویرایش',
      icon: '✏️',
      onClick: handleEditGamenet,
      variant: 'secondary'
    },
    {
      label: 'حذف',
      icon: '🗑️',
      onClick: handleDeleteGamenet,
      variant: 'danger'
    }
  ];


  return (
    <ContentArea className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-4">
        <div className="w-full sm:flex-1 text-center sm:text-right">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text">مدیریت گیم نت‌ها</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">مدیریت و نظارت بر گیم نت‌های تحت پوشش</p>
        </div>
        <Button
          onClick={handleAddGamenet}
          variant="primary"
          size="md"
          className="btn-wave w-full sm:w-auto text-center sm:text-right"
        >
          <span className="sm:hidden">➕ افزودن</span>
          <span className="hidden sm:inline">➕ افزودن گیم نت</span>
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 w-full sm:w-auto">
        <Badge variant="primary" size="md">
          📊 {gamenets?.length || 0} گیم نت
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجو در گیم نت‌ها..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Gamenets Table */}
      <Table
        data={gamenets}
        columns={columns}
        actions={actions}
        searchable={false}
        loading={isLoading}
        emptyMessage="هیچ گیم نتی یافت نشد"
        className="gx-neon"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />


      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGamenet ? 'ویرایش گیم نت' : 'افزودن گیم نت جدید'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="نام گیم نت"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="نام گیم نت را وارد کنید"
              required
              fullWidth
            />
            {validationErrors.name && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>
          
          <div>
            <Input
              label="نام مالک"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleInputChange}
              placeholder="نام مالک را وارد کنید"
              required
              fullWidth
            />
            {validationErrors.owner_name && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.owner_name}</p>
            )}
          </div>
          
          <div>
            <Input
              label="شماره موبایل مالک"
              name="owner_mobile"
              value={formData.owner_mobile}
              onChange={handleInputChange}
              placeholder="شماره موبایل را وارد کنید"
              required
              fullWidth
            />
            {validationErrors.owner_mobile && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.owner_mobile}</p>
            )}
          </div>

          <div>
            <Input
              label="ایمیل"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ایمیل گیم نت را وارد کنید"
              required
              fullWidth
            />
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>
          
          <div>
            <Input
              label="آدرس"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="آدرس گیم نت را وارد کنید"
              required
              fullWidth
            />
            {validationErrors.address && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.address}</p>
            )}
          </div>



          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              پیوست مجوز
            </label>
            <input
              type="file"
              name="license_attachment"
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
            <p className="text-xs text-gray-400">
              فرمت‌های مجاز: PDF, JPG, JPEG, PNG, DOC, DOCX
            </p>
            
            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">در حال آپلود...</span>
                  <span className="text-purple-400 font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
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
              {editingGamenet ? 'ویرایش' : 'افزودن'}
            </Button>
          </div>
        </form>
      </Modal>


    </ContentArea>
  );
}

export default function GamenetsPage() {
  return (
    <ProtectedRoute>
      <GamenetsPageContent />
    </ProtectedRoute>
  );
}
