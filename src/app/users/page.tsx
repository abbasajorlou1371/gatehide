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
import { jwtDecode } from 'jwt-decode';
import { usePageTitle, PAGE_TITLES } from '../../hooks/usePageTitle';

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  mobile: string;
  balance: number;
  debt: number;
  created_at: string;
  updated_at: string;
}

interface UserFormData {
  name: string;
  email: string;
  mobile: string;
}

function UsersPageContent() {
  const { token } = useAuth();

  // Set page title
  usePageTitle(PAGE_TITLES.users.title, PAGE_TITLES.users.description);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const itemsPerPage = 10;
  
  // Search and pagination state
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Track last token that was used for fetching
  const lastFetchedTokenRef = useRef<string | null>(null);

  // User search state for attach functionality
  const [searchIdentifier, setSearchIdentifier] = useState('');
  const [, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Get user type from token
  const [userType, setUserType] = useState<string>('');
  
  useEffect(() => {
    if (token) {
      try {
        const decoded: { user_type?: string } = jwtDecode(token);
        setUserType(decoded.user_type || '');
      } catch {
        setUserType('');
      }
    }
  }, [token]);

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    mobile: ''
  });

  // Validation functions
  const validateForm = (data: UserFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
      errors.name = 'نام الزامی است';
    } else if (data.name.trim().length < 2) {
      errors.name = 'نام باید حداقل 2 کاراکتر باشد';
    }

    if (!data.email.trim()) {
      errors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'فرمت ایمیل صحیح نیست';
    }

    if (!data.mobile.trim()) {
      errors.mobile = 'شماره موبایل الزامی است';
    } else if (!/^09\d{9}$/.test(data.mobile.trim())) {
      errors.mobile = 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد';
    }

    return errors;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  // API functions
  const fetchUsers = useCallback(async (searchQuery: string = '', page: number = 1, pageSize: number = 10) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (page > 1) params.append('page', page.toString());
      if (pageSize !== 10) params.append('page_size', pageSize.toString());
      
      const url = `/users/${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await apiClient.authenticatedRequest<ApiResponse<User[]>>(
        url,
        token,
        { method: 'GET' }
      );
      
      // Check if response has pagination data
      if (response.pagination) {
        setUsers(response.data || []);
        setTotalItems(response.pagination.total_items);
        setTotalPages(response.pagination.total_pages);
      } else {
        // Fallback for non-paginated response
        setUsers(response.data || []);
        setTotalItems(response.data ? response.data.length : 0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('خطا در بارگذاری کاربران');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Function to refresh data (for after create/update/delete)
  const refreshUsers = useCallback(async () => {
    await fetchUsers(searchTerm, currentPage, itemsPerPage);
  }, [fetchUsers, searchTerm, currentPage, itemsPerPage]);

  const createUser = async (userData: UserFormData) => {
    if (!token) throw new Error('No authentication token');
    
    const response = await apiClient.authenticatedRequest<ApiResponse<User>>(
      '/users/',
      token,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );
    return response.data;
  };

  const updateUser = async (id: string, userData: UserFormData) => {
    if (!token) throw new Error('No authentication token');
    
    const response = await apiClient.authenticatedRequest<ApiResponse<User>>(
      `/users/${id}`,
      token,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );
    return response.data;
  };

  const deleteUser = async (id: string) => {
    if (!token) throw new Error('No authentication token');
    
    await apiClient.authenticatedRequest<ApiResponse<Record<string, never>>>(
      `/users/${id}`,
      token,
      { method: 'DELETE' }
    );
  };

  const resendCredentials = async (id: string) => {
    if (!token) throw new Error('No authentication token');
    
    // Direct fetch without retry logic for faster failure feedback
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/users/${id}/resend-credentials`, {
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

  const searchUserByIdentifier = async (identifier: string) => {
    if (!token) throw new Error('No authentication token');
    
    const response = await apiClient.authenticatedRequest<{found: boolean; data?: User; message: string}>(
      `/users/search-by-identifier?q=${encodeURIComponent(identifier)}`,
      token,
      { method: 'GET' }
    );
    
    return response;
  };

  const attachUserToGamenet = async (userId: string) => {
    if (!token) throw new Error('No authentication token');
    
    await apiClient.authenticatedRequest(
      `/users/${userId}/attach`,
      token,
      { method: 'POST' }
    );
  };

  const detachUserFromGamenet = async (userId: string) => {
    if (!token) throw new Error('No authentication token');
    
    await apiClient.authenticatedRequest(
      `/users/${userId}/detach`,
      token,
      { method: 'POST' }
    );
  };

  // Fetch users on mount and when token changes
  useEffect(() => {
    if (!token) return;
    
    // Only fetch if we haven't already loaded for this specific token
    if (lastFetchedTokenRef.current !== token) {
      lastFetchedTokenRef.current = token;
      fetchUsers(searchTerm, currentPage, itemsPerPage);
    }
  }, [token, fetchUsers, searchTerm, currentPage, itemsPerPage]);

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
      render: (value) => {
        const balance = value || 0;
        return (
          <span className="text-green-400 font-semibold">
            {Number(balance).toLocaleString('fa-IR')} تومان
          </span>
        );
      }
    },
    {
      key: 'debt',
      label: 'بدهی',
      sortable: true,
      render: (value) => {
        const debt = value || 0;
        return (
          <span className={`font-semibold ${Number(debt) > 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {Number(debt).toLocaleString('fa-IR')} تومان
          </span>
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

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      mobile: ''
    });
    setSearchIdentifier('');
    setFoundUser(null);
    setSearchMode(false);
    clearValidationErrors();
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile
    });
    clearValidationErrors();
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    const result = await Swal.fire({
      title: 'تأیید حذف کاربر',
      html: `
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
            <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">
            آیا از حذف این کاربر اطمینان دارید؟
          </h3>
          <div class="text-gray-300 text-sm">
            <p class="font-medium">${user.name}</p>
            <p class="text-gray-400">ایمیل: ${user.email}</p>
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
        await deleteUser(user.id);
        await refreshUsers();
        
        Swal.fire({
          title: 'موفق!',
          text: 'کاربر با موفقیت حذف شد',
          icon: 'success',
          confirmButtonText: 'باشه',
          theme: 'dark',
          customClass: {
            popup: 'font-sans',
            title: 'text-right'
          }
        });
      } catch (err) {
        console.error('Error deleting user:', err);
        
        Swal.fire({
          title: 'خطا!',
          text: 'خطا در حذف کاربر. لطفاً دوباره تلاش کنید.',
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

  const handleResendCredentials = async (user: User) => {
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
            <p class="font-medium">${user.name}</p>
            <p class="text-gray-400">ایمیل: ${user.email}</p>
            <p class="text-blue-400">📱 ${user.mobile}</p>
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
              📱 ${user.mobile}
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
        await resendCredentials(user.id);
        
        Swal.fire({
          title: 'موفق!',
          html: `
            <div class="text-center">
              <p class="text-green-400 mb-2">✅ اطلاعات ورود با موفقیت ارسال شد</p>
              <p class="text-gray-300 text-sm">
                پیامک حاوی اطلاعات ورود به شماره:
              </p>
              <p class="text-blue-400 text-sm mt-1 font-medium">
                ${user.mobile}
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

  // Live search with debounce
  useEffect(() => {
    if (!searchMode || !searchIdentifier.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        const result = await searchUserByIdentifier(searchIdentifier.trim());
        
        if (result.found && result.data) {
          setSearchResults([result.data]);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
          setShowSearchResults(false);
        }
      } catch {
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchIdentifier, searchMode]);

  const handleSelectUserFromSearch = async (user: User) => {
    setShowSearchResults(false);
    
    // Ask for confirmation
    const confirmResult = await Swal.fire({
      title: 'افزودن کاربر',
      html: `
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
            <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">
            آیا می‌خواهید این کاربر را به لیست خود اضافه کنید؟
          </h3>
          <div class="text-gray-300 text-sm space-y-1 mt-3">
            <p class="font-medium text-lg">${user.name}</p>
            <p class="text-gray-400">📧 ${user.email}</p>
            <p class="text-blue-400">📱 ${user.mobile}</p>
            <div class="flex justify-center gap-4 mt-2">
              <span class="text-green-400">💰 ${Number(user.balance || 0).toLocaleString('fa-IR')} تومان</span>
              <span class="text-red-400">💸 ${Number(user.debt || 0).toLocaleString('fa-IR')} تومان</span>
            </div>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '✅ افزودن به لیست',
      cancelButtonText: 'انصراف',
      reverseButtons: true,
      theme: 'dark',
      customClass: {
        popup: 'font-sans',
        title: 'text-right',
        htmlContainer: 'text-right'
      }
    });

    if (confirmResult.isConfirmed) {
      try {
        setIsLoading(true);
        await attachUserToGamenet(user.id);
        await fetchUsers();
        setIsModalOpen(false);
        setSearchIdentifier('');
        setSearchResults([]);

        Swal.fire({
          title: 'موفق!',
          text: 'کاربر با موفقیت به لیست شما اضافه شد',
          icon: 'success',
          confirmButtonText: 'باشه',
          theme: 'dark'
        });
      } catch (err) {
        console.error('Error attaching user:', err);
        Swal.fire({
          title: 'خطا',
          text: 'خطا در افزودن کاربر',
          icon: 'error',
          confirmButtonText: 'باشه'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDetachUser = async (user: User) => {
    const result = await Swal.fire({
      title: 'حذف کاربر از لیست',
      html: `
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/20 mb-4">
            <svg class="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">
            آیا از حذف این کاربر از لیست خود اطمینان دارید؟
          </h3>
          <div class="text-gray-300 text-sm">
            <p class="font-medium">${user.name}</p>
            <p class="text-gray-400">ایمیل: ${user.email}</p>
          </div>
          <p class="text-yellow-400 text-sm mt-4">
            توجه: کاربر از سیستم حذف نمی‌شود، فقط از لیست شما حذف می‌گردد.
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'حذف از لیست',
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
        await detachUserFromGamenet(user.id);
        await refreshUsers();
        
        Swal.fire({
          title: 'موفق!',
          text: 'کاربر از لیست شما حذف شد',
          icon: 'success',
          confirmButtonText: 'باشه',
          theme: 'dark'
        });
      } catch (err) {
        console.error('Error detaching user:', err);
        
        Swal.fire({
          title: 'خطا!',
          text: 'خطا در حذف کاربر از لیست',
          icon: 'error',
          confirmButtonText: 'باشه',
          theme: 'dark'
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
    
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, formData);
      } else {
        // Add new user
        await createUser(formData);
      }
      
      await fetchUsers();
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        mobile: ''
      });
    } catch (err) {
      console.error('Error saving user:', err);
      setError(editingUser ? 'خطا در ویرایش کاربر' : 'خطا در افزودن کاربر');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    fetchUsers(searchTerm, page, itemsPerPage);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchUsers(value, 1, itemsPerPage);
  };

  // Table actions configuration
  const getTableActions = (): TableAction<User>[] => {
    const actions: TableAction<User>[] = [
      {
        label: 'ارسال اطلاعات',
        icon: '📧',
        onClick: handleResendCredentials,
        variant: 'primary'
      },
      {
        label: 'ویرایش',
        icon: '✏️',
        onClick: handleEditUser,
        variant: 'secondary'
      }
    ];

    // Add detach for gamenets, delete for admins
    if (userType === 'gamenet') {
      actions.push({
        label: 'حذف از لیست',
        icon: '➖',
        onClick: handleDetachUser,
        variant: 'secondary'
      });
    } else if (userType === 'admin') {
      actions.push({
        label: 'حذف',
        icon: '🗑️',
        onClick: handleDeleteUser,
        variant: 'danger'
      });
    }

    return actions;
  };

  return (
    <ContentArea className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-4">
        <div className="w-full sm:flex-1 text-center sm:text-right">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text">مدیریت کاربران</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">مدیریت و نظارت بر کاربران سیستم</p>
        </div>
        <Button
          onClick={handleAddUser}
          variant="primary"
          size="md"
          className="btn-wave w-full sm:w-auto text-center sm:text-right"
        >
          <span className="sm:hidden">➕ افزودن</span>
          <span className="hidden sm:inline">➕ افزودن کاربر جدید</span>
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
      <div className="flex flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">
        <Badge variant="primary" size="md">
          👥 {users?.length || 0} کاربر
        </Badge>
        <Badge variant="success" size="md">
          💰 {users.reduce((sum, u) => sum + (u.balance || 0), 0).toLocaleString('fa-IR')} تومان موجودی
        </Badge>
        <Badge variant="danger" size="md">
          💸 {users.reduce((sum, u) => sum + (u.debt || 0), 0).toLocaleString('fa-IR')} تومان بدهی
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
        data={users}
        columns={columns}
        actions={getTableActions()}
        searchable={false}
        loading={isLoading}
        emptyMessage="هیچ کاربری یافت نشد"
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
        title={editingUser ? 'ویرایش کاربر' : (searchMode ? 'جستجوی کاربر موجود' : 'افزودن کاربر جدید')}
        size="lg"
      >
        {!editingUser && (
          <div className="mb-4 flex gap-2">
            <Button
              type="button"
              variant={searchMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSearchMode(true)}
              className="flex-1"
            >
              🔍 جستجوی کاربر موجود
            </Button>
            <Button
              type="button"
              variant={!searchMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSearchMode(false)}
              className="flex-1"
            >
              ➕ ایجاد کاربر جدید
            </Button>
          </div>
        )}

        {!editingUser && searchMode ? (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-400">
              <div className="flex items-start gap-2">
                <span>ℹ️</span>
                <div className="text-sm">
                  <p className="font-medium mb-1">جستجوی کاربر موجود</p>
                  <p className="text-blue-300">
                    برای افزودن کاربری که قبلاً در سیستم ثبت شده، ایمیل یا شماره موبایل او را تایپ کنید.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Input
                label="ایمیل یا شماره موبایل"
                value={searchIdentifier}
                onChange={(e) => {
                  setSearchIdentifier(e.target.value);
                  setShowSearchResults(true);
                }}
                placeholder="شروع به تایپ کنید..."
                fullWidth
              />
              {isSearching && (
                <div className="absolute left-3 top-11 text-purple-400">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              )}
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectUserFromSearch(user)}
                      className="w-full text-right px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👤</span>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{user.name}</p>
                          <p className="text-gray-400 text-sm">📧 {user.email}</p>
                          <p className="text-blue-400 text-sm">📱 {user.mobile}</p>
                          <div className="flex gap-3 text-xs mt-1">
                            <span className="text-green-400">💰 {Number(user.balance || 0).toLocaleString('fa-IR')} تومان</span>
                            <span className="text-red-400">💸 {Number(user.debt || 0).toLocaleString('fa-IR')} تومان</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* No Results Message */}
              {showSearchResults && searchResults.length === 0 && searchIdentifier.trim() && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 p-4">
                  <div className="text-center text-gray-400">
                    <p className="text-sm">کاربری یافت نشد</p>
                    <button
                      type="button"
                      onClick={() => setSearchMode(false)}
                      className="text-purple-400 text-sm mt-2 hover:text-purple-300"
                    >
                      ایجاد کاربر جدید ←
                    </button>
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
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="نام کاربر"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="نام کاربر را وارد کنید"
                required
                fullWidth
              />
              {validationErrors.name && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
            
            <div>
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
              {validationErrors.email && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            
            <div>
              <Input
                label="شماره موبایل"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="شماره موبایل کاربر را وارد کنید"
                required
                fullWidth
              />
              {validationErrors.mobile && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.mobile}</p>
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
                {editingUser ? 'ویرایش' : 'افزودن'}
              </Button>
            </div>
          </form>
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
