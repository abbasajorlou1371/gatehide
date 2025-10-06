'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Badge, Table, TableColumn, TableAction, Pagination, Modal, Button } from '../../components/ui';
import ContentArea from '../../components/ContentArea';
interface Invoice extends Record<string, unknown> {
  id: string;
  invoiceNumber: string;
  gamenetName: string;
  pricePerDevice: number;
  devicesCount: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  description: string;
}
function InvoicesPageContent() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        gamenetName: 'گیم نت آریا',
        pricePerDevice: 50000,
        devicesCount: 3,
        totalAmount: 150000,
        status: 'paid',
        dueDate: '2024-01-15',
        issueDate: '2024-01-01',
        description: 'اشتراک ماهانه گیم نت'
      },
        id: '2',
        invoiceNumber: 'INV-2024-002',
        gamenetName: 'گیم نت پارس',
        pricePerDevice: 40000,
        devicesCount: 5,
        totalAmount: 200000,
        status: 'pending',
        dueDate: '2024-01-20',
        issueDate: '2024-01-05',
        description: 'اشتراک سه ماهه گیم نت'
        id: '3',
        invoiceNumber: 'INV-2024-003',
        gamenetName: 'گیم نت تهران',
        pricePerDevice: 25000,
        devicesCount: 4,
        totalAmount: 100000,
        status: 'overdue',
        dueDate: '2024-01-10',
        issueDate: '2023-12-25',
        description: 'اشتراک هفتگی گیم نت'
        id: '4',
        invoiceNumber: 'INV-2024-004',
        gamenetName: 'گیم نت اصفهان',
        pricePerDevice: 60000,
        totalAmount: 300000,
        dueDate: '2024-01-25',
        issueDate: '2024-01-10',
        description: 'اشتراک شش ماهه گیم نت'
        id: '5',
        invoiceNumber: 'INV-2024-005',
        gamenetName: 'گیم نت شیراز',
        totalAmount: 75000,
        status: 'cancelled',
        dueDate: '2024-01-12',
        issueDate: '2024-01-08',
        description: 'اشتراک روزانه گیم نت'
      }
    ];
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setInvoices(mockInvoices);
      setIsLoading(false);
    }, 1000);
  }, []);
  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.gamenetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getStatusBadge = (status: Invoice['status']) => {
    const statusConfig = {
      paid: { label: 'پرداخت شده', variant: 'success' as const },
      pending: { label: 'در انتظار', variant: 'warning' as const },
      overdue: { label: 'سررسید گذشته', variant: 'danger' as const },
      cancelled: { label: 'لغو شده', variant: 'secondary' as const }
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: 'paid' as const }
        : invoice
    ));
  // const handleSendReminder = (invoiceId: string) => {
  //   // Implement send reminder logic
  //   console.log('Sending reminder for invoice:', invoiceId);
  // };
  // Paginate data
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  // Table columns configuration
  const columns: TableColumn<Invoice>[] = [
    {
      key: 'invoiceNumber',
      label: 'شماره فاکتور',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm text-gray-300">#{String(value)}</span>
      )
    },
      key: 'gamenetName',
      label: 'نام گیم نت',
        <span className="font-medium text-white">{String(value)}</span>
      key: 'pricePerDevice',
      label: 'قیمت هر دستگاه',
        <span className="text-blue-400">
          {formatCurrency(Number(value))}
        </span>
      key: 'devicesCount',
      label: 'تعداد دستگاه',
        <span className="text-yellow-400 font-semibold">
          {String(value)} دستگاه
      key: 'totalAmount',
      label: 'مبلغ کل',
        <span className="font-semibold text-green-400">
      key: 'status',
      label: 'وضعیت',
      render: (value) => getStatusBadge(value as Invoice['status'])
      key: 'dueDate',
      label: 'تاریخ سررسید',
        <span className="text-gray-400 text-sm">
          {formatDate(String(value))}
    }
  ];
  const handlePrintInvoice = (invoice: Invoice) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>فاکتور ${invoice.invoiceNumber}</title>
          <style>
            body {
              font-family: 'Tahoma', 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
            }
            .invoice-header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            .invoice-number {
              font-size: 18px;
              color: #666;
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            .detail-section {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
            .detail-title {
            .detail-item {
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
            .invoice-items {
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            .items-table th,
            .items-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: right;
            .items-table th {
            .total-section {
              text-align: left;
              margin-top: 20px;
            .total-amount {
              font-size: 20px;
              color: #2d5a27;
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
            .status-paid { background: #d4edda; color: #155724; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-overdue { background: #f8d7da; color: #721c24; }
            .status-cancelled { background: #e2e3e5; color: #383d41; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="invoice-title">فاکتور فروش</div>
            <div class="invoice-number">شماره فاکتور: ${invoice.invoiceNumber}</div>
          </div>
          
          <div class="invoice-details">
            <div class="detail-section">
              <div class="detail-title">اطلاعات فاکتور</div>
              <div class="detail-item">
                <span>تاریخ صدور:</span>
                <span>${formatDate(invoice.issueDate)}</span>
              </div>
                <span>تاریخ سررسید:</span>
                <span>${formatDate(invoice.dueDate)}</span>
                <span>وضعیت:</span>
                <span class="status-badge status-${invoice.status}">
                  ${getStatusBadge(invoice.status).props.children}
                </span>
            </div>
            
              <div class="detail-title">اطلاعات گیم نت</div>
                <span>نام گیم نت:</span>
                <span>${invoice.gamenetName}</span>
                <span>توضیحات:</span>
                <span>${invoice.description}</span>
          <div class="invoice-items">
            <div class="detail-title">جزئیات فاکتور</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>قیمت هر دستگاه</th>
                  <th>تعداد دستگاه</th>
                  <th>مبلغ کل</th>
                </tr>
              </thead>
              <tbody>
                  <td>${formatCurrency(invoice.pricePerDevice)}</td>
                  <td>${invoice.devicesCount} دستگاه</td>
                  <td>${formatCurrency(invoice.totalAmount)}</td>
              </tbody>
            </table>
          <div class="total-section">
            <div class="total-amount">
              مبلغ کل: ${formatCurrency(invoice.totalAmount)}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
  // Table actions configuration
  const actions: TableAction<Invoice>[] = [
      label: 'مشاهده',
      icon: '👁️',
      onClick: (invoice) => handleViewInvoice(invoice),
      variant: 'outline'
      label: 'چاپ فاکتور',
      icon: '🖨️',
      onClick: (invoice) => handlePrintInvoice(invoice),
      variant: 'secondary'
  // Calculate totals
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
  // const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);
  return (
    <ContentArea className="space-y-4 sm:space-y-6" overflow="hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text">مدیریت فاکتورها</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">مدیریت و پیگیری فاکتورهای صادر شده</p>
        </div>
        <Button variant="primary" className="btn-wave">
          <span className="me-2">📄</span>
          فاکتور جدید
        </Button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <div className="text-sm text-gray-400">کل فاکتورها</div>
              <div className="text-lg font-semibold text-white">
                {totalInvoices}
        
            <span className="text-2xl">✅</span>
              <div className="text-sm text-gray-400">پرداخت شده</div>
              <div className="text-lg font-semibold text-green-400">
                {paidInvoices}
            <span className="text-2xl">⏳</span>
              <div className="text-sm text-gray-400">در انتظار</div>
              <div className="text-lg font-semibold text-yellow-400">
                {pendingInvoices}
            <span className="text-2xl">💰</span>
              <div className="text-sm text-gray-400">کل درآمد</div>
                {formatCurrency(totalRevenue)}
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجو در فاکتورها..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
      {/* Invoices Table */}
      <Table
        data={paginatedInvoices}
        columns={columns}
        actions={actions}
        searchable={false}
        loading={isLoading}
        emptyMessage="هیچ فاکتوری یافت نشد"
        className="gx-neon"
      />
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredInvoices.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      {/* Invoice Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="جزئیات فاکتور"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">شماره فاکتور</label>
                <p className="font-mono">{selectedInvoice.invoiceNumber}</p>
                <label className="text-sm text-gray-400">وضعیت</label>
                <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                <label className="text-sm text-gray-400">نام گیم نت</label>
                <p className="font-medium">{selectedInvoice.gamenetName}</p>
                <label className="text-sm text-gray-400">قیمت هر دستگاه</label>
                <p className="text-blue-400">
                  {formatCurrency(selectedInvoice.pricePerDevice)}
                </p>
                <label className="text-sm text-gray-400">تعداد دستگاه</label>
                <p className="text-yellow-400 font-semibold">
                  {selectedInvoice.devicesCount} دستگاه
                <label className="text-sm text-gray-400">مبلغ کل</label>
                <p className="font-semibold text-green-400">
                  {formatCurrency(selectedInvoice.totalAmount)}
                <label className="text-sm text-gray-400">تاریخ صدور</label>
                <p>{formatDate(selectedInvoice.issueDate)}</p>
                <label className="text-sm text-gray-400">تاریخ سررسید</label>
                <p>{formatDate(selectedInvoice.dueDate)}</p>
              <label className="text-sm text-gray-400">توضیحات</label>
              <p className="mt-1">{selectedInvoice.description}</p>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseModal}>
                بستن
              </Button>
              {selectedInvoice.status === 'pending' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleMarkAsPaid(selectedInvoice.id);
                    handleCloseModal();
                  }}
                >
                  علامت‌گذاری به عنوان پرداخت شده
                </Button>
              )}
        )}
      </Modal>
    </ContentArea>
  );
}

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <InvoicesPageContent />
    </ProtectedRoute>
  );
}
