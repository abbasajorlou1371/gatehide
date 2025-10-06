'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Table, TableColumn, TableAction, Button, Badge, Modal } from '../../components/ui';
import ContentArea from '../../components/ContentArea';
import Swal from 'sweetalert2';

// Device interface
interface Device extends Record<string, unknown> {
  id: string;
  name: string;
  macAddress: string;
  status: 'online' | 'offline' | 'reserved';
  isFree: boolean;
  lastSeen: string;
  location?: string;
  reservationCount: number;
  hourlyRate: number;
  systemInfo: {
    ram: string;
    cpu: string;
    gpu: string;
    storage: string;
    os: string;
  };
}

// Reserved user interface
interface ReservedUser {
  id: string;
  name: string;
  email: string;
  reservationTime: string;
  duration: string;
}

// Mock data for demonstration
const mockDevices: Device[] = [
  {
    id: '1',
    name: 'کامپیوتر گیمینگ ۱',
    macAddress: '00:1B:44:11:3A:B7',
    status: 'online',
    isFree: true,
    lastSeen: '2024-01-15 14:30:00',
    location: 'سالن A',
    reservationCount: 5,
    hourlyRate: 15000,
    systemInfo: {
      ram: '32GB DDR4',
      cpu: 'Intel Core i9-12900K',
      gpu: 'RTX 4080',
      storage: '1TB NVMe SSD',
      os: 'Windows 11 Pro'
    }
  },
  {
    id: '2',
    name: 'کامپیوتر گیمینگ ۲',
    macAddress: '00:1B:44:11:3A:B8',
    status: 'online',
    isFree: true,
    lastSeen: '2024-01-15 14:25:00',
    location: 'سالن A',
    reservationCount: 3,
    hourlyRate: 12000,
    systemInfo: {
      ram: '16GB DDR4',
      cpu: 'Intel Core i7-12700K',
      gpu: 'RTX 3070',
      storage: '512GB NVMe SSD',
      os: 'Windows 11 Pro'
    }
  },
  {
    id: '3',
    name: 'کامپیوتر گیمینگ ۳',
    macAddress: '00:1B:44:11:3A:B9',
    status: 'online',
    isFree: false,
    lastSeen: '2024-01-15 14:20:00',
    location: 'سالن B',
    reservationCount: 8,
    hourlyRate: 18000,
    systemInfo: {
      ram: '64GB DDR5',
      cpu: 'Intel Core i9-13900K',
      gpu: 'RTX 4090',
      storage: '2TB NVMe SSD',
      os: 'Windows 11 Pro'
    }
  },
  {
    id: '4',
    name: 'کامپیوتر گیمینگ ۴',
    macAddress: '00:1B:44:11:3A:BA',
    status: 'offline',
    isFree: true,
    lastSeen: '2024-01-15 12:00:00',
    location: 'سالن B',
    reservationCount: 2,
    hourlyRate: 10000,
    systemInfo: {
      ram: '16GB DDR4',
      cpu: 'AMD Ryzen 7 5800X',
      gpu: 'RTX 3060',
      storage: '256GB NVMe SSD',
      os: 'Windows 10 Pro'
    }
  },
  {
    id: '5',
    name: 'کامپیوتر گیمینگ ۵',
    macAddress: '00:1B:44:11:3A:BB',
    status: 'online',
    isFree: true,
    lastSeen: '2024-01-15 14:35:00',
    location: 'سالن C',
    reservationCount: 4,
    hourlyRate: 14000,
    systemInfo: {
      ram: '32GB DDR4',
      cpu: 'Intel Core i7-13700K',
      gpu: 'RTX 4070',
      storage: '1TB NVMe SSD',
      os: 'Windows 11 Pro'
    }
  },
  {
    id: '6',
    name: 'کامپیوتر گیمینگ ۶',
    macAddress: '00:1B:44:11:3A:BC',
    status: 'online',
    isFree: false,
    lastSeen: '2024-01-15 14:28:00',
    location: 'سالن C',
    reservationCount: 6,
    hourlyRate: 16000,
    systemInfo: {
      ram: '32GB DDR5',
      cpu: 'AMD Ryzen 9 7900X',
      gpu: 'RTX 4080',
      storage: '1TB NVMe SSD',
      os: 'Windows 11 Pro'
    }
  }
];

// Mock reserved users data
const mockReservedUsers: ReservedUser[] = [
  {
    id: '1',
    name: 'علی احمدی',
    email: 'ali.ahmadi@example.com',
    reservationTime: '2024-01-15 14:00:00',
    duration: '2 ساعت'
  },
  {
    id: '2',
    name: 'فاطمه محمدی',
    email: 'fateme.mohammadi@example.com',
    reservationTime: '2024-01-15 13:30:00',
    duration: '3 ساعت'
  },
  {
    id: '3',
    name: 'محمد رضایی',
    email: 'mohammad.rezaei@example.com',
    reservationTime: '2024-01-15 12:45:00',
    duration: '1.5 ساعت'
  }
];

function DevicesPageContent() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isReservedUsersModalOpen, setIsReservedUsersModalOpen] = useState(false);
  const [isSystemDetailsModalOpen, setIsSystemDetailsModalOpen] = useState(false);
  const [reservedUsers, setReservedUsers] = useState<ReservedUser[]>([]);

  // Filter devices to show only free and online devices
  const availableDevices = devices.filter(device => 
    device.isFree && device.status === 'online'
  );

  // Filter devices based on search term
  const filteredDevices = availableDevices.filter(device => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      device.name.toLowerCase().includes(searchLower) ||
      device.macAddress.toLowerCase().includes(searchLower) ||
      (device.location && device.location.toLowerCase().includes(searchLower))
    );
  });

  // Debounced search effect
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  // Simulate API call
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDevices(mockDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const handleReservation = (device: Device) => {
    setSelectedDevice(device);
    setIsReservationModalOpen(true);
  };

  const handleViewReservedUsers = (device: Device) => {
    setReservedUsers(mockReservedUsers); // In real app, fetch from API
    setIsReservedUsersModalOpen(true);
  };

  const handleViewSystemDetails = (device: Device) => {
    setIsSystemDetailsModalOpen(true);
  };

  const confirmReservation = async () => {
    if (!selectedDevice) return;
    setReservationLoading(true);
    try {
      // Simulate API call for reservation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update device status
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.id === selectedDevice.id
            ? { ...device, isFree: false, status: 'reserved' as const }
            : device
        )
      );
      setIsReservationModalOpen(false);
      setSelectedDevice(null);
      // Show success toast
      await Swal.fire({
        title: 'رزرو موفق! 🎉',
        text: `دستگاه ${selectedDevice.name} با موفقیت رزرو شد`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#ffffff',
        customClass: {
          popup: 'swal2-popup-dark',
          title: 'swal2-title-dark',
          htmlContainer: 'swal2-content-dark'
        }
      });
    } catch (error) {
      console.error('Error reserving device:', error);
      // Show error toast
      await Swal.fire({
        title: 'خطا در رزرو! ❌',
        text: 'خطا در رزرو دستگاه. لطفاً دوباره تلاش کنید.',
        icon: 'error',
        timer: 4000,
      });
    } finally {
      setReservationLoading(false);
    }
  };

  const getStatusBadge = (status: Device['status']) => {
    const statusConfig = {
      online: { label: 'آنلاین', variant: 'success' as const, icon: '🟢' },
      offline: { label: 'آفلاین', variant: 'danger' as const, icon: '🔴' },
      reserved: { label: 'رزرو شده', variant: 'warning' as const, icon: '🟡' }
    };
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <span>{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  const getAvailabilityBadge = (isFree: boolean) => {
    return isFree ? (
      <Badge variant="success" className="flex items-center gap-1">
        <span>✅</span>
        آزاد
      </Badge>
    ) : (
      <Badge variant="danger" className="flex items-center gap-1">
        <span>❌</span>
        اشغال
      </Badge>
    );
  };

  // Table columns configuration
  const columns: TableColumn<Device>[] = [
    {
      key: 'name',
      label: 'نام دستگاه',
      sortable: true,
      render: (value, device) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{String(value)}</span>
          {device.location && (
            <span className="text-xs text-gray-400">{String(device.location)}</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (value) => getStatusBadge(value as Device['status'])
    },
    {
      key: 'isFree',
      label: 'دسترسی',
      render: (value) => getAvailabilityBadge(Boolean(value))
    },
    {
      key: 'reservationCount',
      label: 'تعداد رزرو',
      render: (value, device) => (
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{String(value)}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewReservedUsers(device)}
            className="text-xs px-2 py-1"
          >
            مشاهده
          </Button>
        </div>
      )
    },
    {
      key: 'hourlyRate',
      label: 'نرخ ساعتی',
      render: (value) => (
        <span className="text-green-400 font-medium">
          {Number(value).toLocaleString('fa-IR')} تومان
        </span>
      )
    }
  ];

  // Table actions
  const actions: TableAction<Device>[] = [
    {
      label: 'جزئیات سیستم',
      icon: '💻',
      onClick: handleViewSystemDetails,
      variant: 'secondary',
      className: 'btn-wave'
    },
    {
      label: 'رزرو',
      icon: '📅',
      onClick: handleReservation,
      variant: 'primary',
    }
  ];

  return (
    <>
      <ContentArea padding="md">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="text-center sm:text-right">
              <h1 className="text-xl sm:text-2xl font-bold gx-gradient-text">رزرو دستگاه‌ها</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                لیست دستگاه‌های آزاد و آنلاین برای رزرو
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50">
                <div className="text-sm text-gray-400">
                  <span className="text-green-400 font-medium">{availableDevices.length}</span> دستگاه آزاد
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                  <span className="text-green-400 text-lg sm:text-xl">🟢</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-400 truncate">دستگاه‌های آنلاین</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {devices.filter(d => d.status === 'online').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  <span className="text-blue-400 text-lg sm:text-xl">📅</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-400 truncate">دستگاه‌های آزاد</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {availableDevices.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                  <span className="text-yellow-400 text-lg sm:text-xl">🟡</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-400 truncate">دستگاه‌های رزرو شده</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {devices.filter(d => !d.isFree).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در دستگاه‌ها (نام، آدرس MAC، مکان)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-sm min-h-[44px] touch-manipulation"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {isSearching ? (
                  <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                ) : (
                  '🔍'
                )}
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-xs text-gray-400">
                {filteredDevices.length} نتیجه برای "{searchTerm}"
              </div>
            )}
          </div>

          {/* Mobile Card View for Devices */}
          <div className="block sm:hidden">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 animate-pulse">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-8 bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 text-center">
                <div className="text-gray-400 text-sm">
                  {searchTerm ? 'هیچ دستگاهی با این جستجو یافت نشد' : 'هیچ دستگاه آزادی یافت نشد'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDevices.map((device) => (
                  <div key={device.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
                    <div className="space-y-3">
                      {/* Device Name and Location */}
                      <div>
                        <h3 className="font-medium text-white text-sm">{device.name}</h3>
                        {device.location && (
                          <p className="text-xs text-gray-400 mt-1">{device.location}</p>
                        )}
                      </div>
                      
                      {/* Status and Availability */}
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(device.status)}
                        {getAvailabilityBadge(device.isFree)}
                      </div>
                      
                      {/* Reservation Count and Hourly Rate */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">تعداد رزرو:</p>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{device.reservationCount}</span>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewReservedUsers(device)}
                              className="text-xs px-2 py-1"
                            >
                              مشاهده
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">نرخ ساعتی:</p>
                          <span className="text-green-400 font-medium">
                            {device.hourlyRate.toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="pt-2 space-y-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewSystemDetails(device)}
                          className="w-full btn-wave min-h-[44px] touch-manipulation"
                        >
                          <span className="ml-1">💻</span>
                          جزئیات سیستم
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReservation(device)}
                          className="w-full min-h-[44px] touch-manipulation"
                        >
                          <span className="ml-1">📅</span>
                          رزرو دستگاه
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <Table
              data={filteredDevices}
              columns={columns}
              actions={actions}
              loading={loading}
              searchable={false}
              emptyMessage={searchTerm ? 'هیچ دستگاهی با این جستجو یافت نشد' : 'هیچ دستگاه آزادی یافت نشد'}
              className="min-h-[400px]"
            />
          </div>
        </div>
      </ContentArea>

      {/* Reservation Confirmation Modal */}
      <Modal
        isOpen={isReservationModalOpen}
        onClose={() => {
          setIsReservationModalOpen(false);
          setSelectedDevice(null);
        }}
        title="تأیید رزرو دستگاه"
        size="sm"
        primaryAction={{
          label: reservationLoading ? 'در حال رزرو...' : 'تأیید رزرو',
          onClick: confirmReservation,
          variant: 'primary'
        }}
        secondaryAction={{
          label: 'انصراف',
          onClick: () => {
            setIsReservationModalOpen(false);
            setSelectedDevice(null);
          }
        }}
      >
        {selectedDevice && (
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">اطلاعات دستگاه</h3>
              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-400 text-xs sm:text-sm">نام:</span>
                  <span className="text-white font-medium text-sm sm:text-base">{selectedDevice.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-400 text-xs sm:text-sm">آدرس MAC:</span>
                  <code className="text-gray-300 font-mono text-xs sm:text-sm bg-gray-700/30 px-2 py-1 rounded">
                    {selectedDevice.macAddress}
                  </code>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-400 text-xs sm:text-sm">مکان:</span>
                  <span className="text-white text-sm sm:text-base">{selectedDevice.location || 'نامشخص'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-400 text-xs sm:text-sm">وضعیت:</span>
                  <div className="flex-shrink-0">
                    {getStatusBadge(selectedDevice.status)}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-yellow-400 text-lg sm:text-xl flex-shrink-0">⚠️</span>
                <div className="min-w-0">
                  <h4 className="text-yellow-400 font-medium mb-1 text-sm sm:text-base">توجه</h4>
                  <p className="text-yellow-300 text-xs sm:text-sm leading-relaxed">
                    با تأیید این رزرو، دستگاه برای شما رزرو خواهد شد و سایر کاربران قادر به استفاده از آن نخواهند بود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Reserved Users Modal */}
      <Modal
        isOpen={isReservedUsersModalOpen}
        onClose={() => {
          setIsReservedUsersModalOpen(false);
        }}
        title="لیست کاربران رزرو شده"
        size="lg"
        secondaryAction={{
          label: 'بستن',
          onClick: () => {
            setIsReservedUsersModalOpen(false);
          },
        }}
      >
        {selectedDevice && (
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-2">دستگاه: {selectedDevice.name}</h3>
              <p className="text-gray-400 text-sm">تعداد کل رزروها: {selectedDevice.reservationCount}</p>
              {reservedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">هیچ کاربر رزرو شده‌ای یافت نشد</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservedUsers.map((user) => (
                    <div key={user.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{user.name}</h4>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                          <span className="text-green-400 text-sm font-medium">{user.duration}</span>
                          <span className="text-gray-400 text-xs">
                            {new Date(user.reservationTime).toLocaleString('fa-IR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* System Details Modal */}
      <Modal
        isOpen={isSystemDetailsModalOpen}
        onClose={() => {
          setIsSystemDetailsModalOpen(false);
        }}
        title="جزئیات سیستم"
        size="md"
        secondaryAction={{
          label: 'بستن',
          onClick: () => {
            setIsSystemDetailsModalOpen(false);
          },
        }}
      >
        {selectedDevice && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">دستگاه: {selectedDevice.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{selectedDevice.location}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">پردازنده:</span>
                  <span className="text-white font-medium text-sm">{selectedDevice.systemInfo.cpu}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">حافظه RAM:</span>
                  <span className="text-white font-medium text-sm">{selectedDevice.systemInfo.ram}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">کارت گرافیک:</span>
                  <span className="text-white font-medium text-sm">{selectedDevice.systemInfo.gpu}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">حافظه ذخیره‌سازی:</span>
                  <span className="text-white font-medium text-sm">{selectedDevice.systemInfo.storage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">سیستم عامل:</span>
                  <span className="text-white font-medium text-sm">{selectedDevice.systemInfo.os}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">نرخ ساعتی:</span>
                  <span className="text-green-400 font-medium text-sm">
                    {selectedDevice.hourlyRate.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-lg flex-shrink-0">ℹ️</span>
                <div className="min-w-0">
                  <h4 className="text-blue-400 font-medium mb-1">اطلاعات سیستم</h4>
                  <p className="text-blue-300 text-sm leading-relaxed">
                    این سیستم برای بازی‌های سنگین و کارهای گرافیکی بهینه‌سازی شده است.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default function DevicesPage() {
  return (
    <ProtectedRoute>
      <DevicesPageContent />
    </ProtectedRoute>
  );
}