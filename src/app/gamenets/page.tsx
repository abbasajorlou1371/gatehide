'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Badge, Table, TableColumn, TableAction, Pagination } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import ContentArea from '../../components/ContentArea';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Gamenet extends Record<string, unknown> {
  id: string;
  name: string;
  ownerName: string;
  ownerMobile: string;
  address: string;
  email: string;
  domain: string;
  onlineDevices: number;
  offlineDevices: number;
  licenseAttachment: File | null;
  createdAt: string;
  status: 'active' | 'inactive';
}

function GamenetsPageContent() {
  const [gamenets, setGamenets] = useState<Gamenet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gamenetToDelete, setGamenetToDelete] = useState<Gamenet | null>(null);
  const [editingGamenet, setEditingGamenet] = useState<Gamenet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerMobile: '',
    address: '',
    email: '',
    domain: '',
    licenseAttachment: null as File | null
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockGamenets: Gamenet[] = [
      {
        id: '1',
        name: 'گیم نت آریا',
        ownerName: 'علی احمدی',
        ownerMobile: '09123456789',
        address: 'تهران، خیابان ولیعصر، پلاک 123',
        email: 'aria.gamenet@gmail.com',
        domain: 'aria-gamenet',
        onlineDevices: 15,
        offlineDevices: 3,
        licenseAttachment: null,
        createdAt: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'گیم نت پارس',
        ownerName: 'محمد رضایی',
        ownerMobile: '09187654321',
        address: 'اصفهان، خیابان چهارباغ، پلاک 456',
        email: 'pars.gamenet@gmail.com',
        domain: 'pars-gamenet',
        onlineDevices: 22,
        offlineDevices: 1,
        licenseAttachment: null,
        createdAt: '2024-02-20',
        status: 'active'
      },
      {
        id: '3',
        name: 'گیم نت کوروش',
        ownerName: 'حسن محمدی',
        ownerMobile: '09111111111',
        address: 'شیراز، خیابان زند، پلاک 789',
        email: 'koroush.gamenet@gmail.com',
        domain: 'koroush-gamenet',
        onlineDevices: 0,
        offlineDevices: 12,
        licenseAttachment: null,
        createdAt: '2024-03-10',
        status: 'inactive'
      },
      {
        id: '4',
        name: 'گیم نت آتنا',
        ownerName: 'فاطمه کریمی',
        ownerMobile: '09222222222',
        address: 'مشهد، خیابان امام رضا، پلاک 321',
        email: 'atena.gamenet@gmail.com',
        domain: 'atena-gamenet',
        onlineDevices: 18,
        offlineDevices: 2,
        licenseAttachment: null,
        createdAt: '2024-03-25',
        status: 'active'
      },
      {
        id: '5',
        name: 'گیم نت هخامنش',
        ownerName: 'رضا نوری',
        ownerMobile: '09333333333',
        address: 'کرج، خیابان آزادی، پلاک 654',
        email: 'hakhamanesh.gamenet@gmail.com',
        domain: 'hakhamanesh-gamenet',
        onlineDevices: 25,
        offlineDevices: 0,
        licenseAttachment: null,
        createdAt: '2024-04-05',
        status: 'active'
      }
    ];

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setGamenets(mockGamenets);
      setIsLoading(false);
    }, 1000);
  }, []);

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
      key: 'ownerName',
      label: 'مالک',
      sortable: true,
      render: (value) => <span className="text-gray-300">{String(value)}</span>
    },
    {
      key: 'ownerMobile',
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
      key: 'domain',
      label: 'دامنه',
      sortable: true,
      render: (value) => (
        <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
          gatehide.com/{String(value)}
        </span>
      )
    },
    {
      key: 'onlineDevices',
      label: 'دستگاه‌های آنلاین',
      sortable: true,
      render: (value) => (
        <div className="text-green-400 font-semibold text-lg">
          {String(value) || 0}
        </div>
      )
    },
    {
      key: 'offlineDevices',
      label: 'دستگاه‌های آفلاین',
      sortable: true,
      render: (value) => (
        <div className="text-red-400 font-semibold text-lg">
          {String(value) || 0}
        </div>
      )
    },
    {
      key: 'address',
      label: 'آدرس',
      sortable: true,
      render: (value) => <span className="text-gray-300 truncate max-w-xs">{String(value)}</span>
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
      label: 'تاریخ ایجاد',
      sortable: true,
      render: (value) => <span className="text-gray-400">{String(value)}</span>
    }
  ];


  const handleAddGamenet = () => {
    setEditingGamenet(null);
    setFormData({
      name: '',
      ownerName: '',
      ownerMobile: '',
      address: '',
      email: '',
      domain: '',
      licenseAttachment: null
    });
    setIsModalOpen(true);
  };

  const handleEditGamenet = (gamenet: Gamenet) => {
    setEditingGamenet(gamenet);
    setFormData({
      name: gamenet.name,
      ownerName: gamenet.ownerName,
      ownerMobile: gamenet.ownerMobile,
      address: gamenet.address,
      email: gamenet.email,
      domain: gamenet.domain,
      licenseAttachment: gamenet.licenseAttachment
    });
    setIsModalOpen(true);
  };

  const handleDeleteGamenet = (gamenet: Gamenet) => {
    setGamenetToDelete(gamenet);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (gamenetToDelete) {
      setGamenets(prev => prev.filter(g => g.id !== gamenetToDelete.id));
      setGamenetToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setGamenetToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGamenet) {
      // Update existing gamenet
      setGamenets(prev => prev.map(g => 
        g.id === editingGamenet.id 
          ? { ...g, ...formData }
          : g
      ));
    } else {
      // Add new gamenet
      const newGamenet: Gamenet = {
        id: Date.now().toString(),
        ...formData,
        onlineDevices: 0,
        offlineDevices: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setGamenets(prev => [newGamenet, ...prev]);
    }
    
    setIsModalOpen(false);
    setFormData({
      name: '',
      ownerName: '',
      ownerMobile: '',
      address: '',
      email: '',
      domain: '',
      licenseAttachment: null
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    // Validate subdomain format for domain field
    if (name === 'domain') {
      // Only allow alphanumeric characters, hyphens, and underscores
      // Must start and end with alphanumeric character
      const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-_]*[a-zA-Z0-9])?$/;
      if (value === '' || subdomainRegex.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Filter gamenets based on search term
  const filteredGamenets = gamenets.filter(gamenet =>
    gamenet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gamenet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gamenet.ownerMobile.includes(searchTerm) ||
    gamenet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gamenet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gamenet.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `gatehide.com/${gamenet.domain}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate data
  const totalPages = Math.ceil(filteredGamenets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGamenets = filteredGamenets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Table actions configuration
  const actions: TableAction<Gamenet>[] = [
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

      {/* Stats */}
      <div className="flex flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 w-full sm:w-auto">
        <Badge variant="primary" size="md">
          📊 {gamenets.length} گیم نت
        </Badge>
        <Badge variant="success" size="md">
          🟢 {gamenets.filter(g => g.status === 'active').length} فعال
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
        data={paginatedGamenets}
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
        totalItems={filteredGamenets.length}
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
          <Input
            label="نام گیم نت"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="نام گیم نت را وارد کنید"
            required
            fullWidth
          />
          
          <Input
            label="نام مالک"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            placeholder="نام مالک را وارد کنید"
            required
            fullWidth
          />
          
          <Input
            label="شماره موبایل مالک"
            name="ownerMobile"
            value={formData.ownerMobile}
            onChange={handleInputChange}
            placeholder="شماره موبایل را وارد کنید"
            required
            fullWidth
          />

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
          
          <Input
            label="آدرس"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="آدرس گیم نت را وارد کنید"
            required
            fullWidth
          />


          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              دامنه
            </label>
            <div className="relative flex items-center group hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200">
              <div className="px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-tr-lg rounded-br-lg text-gray-300 text-sm font-medium border-r-0 group-focus-within:border-purple-500/50 group-focus-within:bg-gray-800/50 group-hover:border-gray-500/50 transition-all duration-200 h-10 flex items-center">
                gatehide.com.
              </div>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                placeholder="نام زیردامنه را وارد کنید"
                required
                className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-tl-lg rounded-bl-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 group-hover:border-gray-500/50 transition-all duration-200 h-10"
              />
            </div>
            <p className="text-xs text-gray-400">
              فقط نام زیردامنه را وارد کنید (مثال: aria-gamenet). فقط حروف، اعداد، خط تیره و زیرخط مجاز است.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              پیوست مجوز
            </label>
            <input
              type="file"
              name="licenseAttachment"
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
            <p className="text-xs text-gray-400">
              فرمت‌های مجاز: PDF, JPG, JPEG, PNG, DOC, DOCX
            </p>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="تأیید حذف گیم نت"
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
            آیا از حذف این گیم نت اطمینان دارید؟
          </h3>
          {gamenetToDelete && (
            <div className="text-gray-300 text-sm">
              <p className="font-medium">{gamenetToDelete.name}</p>
              <p className="text-gray-400">مالک: {gamenetToDelete.ownerName}</p>
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

export default function GamenetsPage() {
  return (
    <ProtectedRoute>
      <GamenetsPageContent />
    </ProtectedRoute>
  );
}
