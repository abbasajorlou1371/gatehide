'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Badge, Table, TableColumn, TableAction, Pagination } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import Footer from '../../components/Footer';
import ContentArea from '../../components/ContentArea';

interface Gamenet {
  id: string;
  name: string;
  ownerName: string;
  ownerMobile: string;
  address: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export default function GamenetsPage() {
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
    address: ''
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
        createdAt: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'گیم نت پارس',
        ownerName: 'محمد رضایی',
        ownerMobile: '09187654321',
        address: 'اصفهان، خیابان چهارباغ، پلاک 456',
        createdAt: '2024-02-20',
        status: 'active'
      },
      {
        id: '3',
        name: 'گیم نت کوروش',
        ownerName: 'حسن محمدی',
        ownerMobile: '09111111111',
        address: 'شیراز، خیابان زند، پلاک 789',
        createdAt: '2024-03-10',
        status: 'inactive'
      },
      {
        id: '4',
        name: 'گیم نت آتنا',
        ownerName: 'فاطمه کریمی',
        ownerMobile: '09222222222',
        address: 'مشهد، خیابان امام رضا، پلاک 321',
        createdAt: '2024-03-25',
        status: 'active'
      },
      {
        id: '5',
        name: 'گیم نت هخامنش',
        ownerName: 'رضا نوری',
        ownerMobile: '09333333333',
        address: 'کرج، خیابان آزادی، پلاک 654',
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
          <span className="font-semibold text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'ownerName',
      label: 'مالک',
      sortable: true,
      render: (value) => <span className="text-gray-300">{value}</span>
    },
    {
      key: 'ownerMobile',
      label: 'موبایل',
      sortable: true,
      render: (value) => <span className="text-gray-300">{value}</span>
    },
    {
      key: 'address',
      label: 'آدرس',
      sortable: true,
      render: (value) => <span className="text-gray-300 truncate max-w-xs">{value}</span>
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
      render: (value) => <span className="text-gray-400">{value}</span>
    }
  ];


  const handleAddGamenet = () => {
    setEditingGamenet(null);
    setFormData({
      name: '',
      ownerName: '',
      ownerMobile: '',
      address: ''
    });
    setIsModalOpen(true);
  };

  const handleEditGamenet = (gamenet: Gamenet) => {
    setEditingGamenet(gamenet);
    setFormData({
      name: gamenet.name,
      ownerName: gamenet.ownerName,
      ownerMobile: gamenet.ownerMobile,
      address: gamenet.address
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
      address: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Filter gamenets based on search term
  const filteredGamenets = gamenets.filter(gamenet =>
    gamenet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gamenet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gamenet.ownerMobile.includes(searchTerm) ||
    gamenet.address.toLowerCase().includes(searchTerm.toLowerCase())
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
    <ContentArea className="space-y-4 sm:space-y-6" overflow="hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text">مدیریت گیم نت‌ها</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">مدیریت و نظارت بر گیم نت‌های تحت پوشش</p>
        </div>
        <Button
          onClick={handleAddGamenet}
          variant="primary"
          size="md"
          className="btn-wave w-full sm:w-auto"
        >
          <span className="sm:hidden">➕ افزودن</span>
          <span className="hidden sm:inline">➕ افزودن گیم نت</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
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
            label="آدرس"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="آدرس گیم نت را وارد کنید"
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

      <Footer />
    </ContentArea>
  );
}
