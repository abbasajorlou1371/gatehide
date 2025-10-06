'use client';

import { useState, useEffect } from 'react';
import ContentArea from "../../components/ContentArea";
import ProtectedRoute from '../../components/ProtectedRoute';
import { Card, Button, Badge, Input, Modal } from "../../components/ui";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status?: string;
  description: string;
}

function WalletPageContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [chargeAmount, setChargeAmount] = useState('');
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'charge',
      amount: 500000,
      date: '2024-01-15',
      status: 'completed',
      description: 'شارژ کیف پول'
    },
    {
      id: 2,
      type: 'payment',
      amount: -150000,
      date: '2024-01-14',
      status: 'completed',
      description: 'پرداخت اشتراک ماهانه'
    },
    {
      id: 3,
      type: 'charge',
      amount: 1000000,
      date: '2024-01-10',
      status: 'completed',
      description: 'شارژ کیف پول'
    },
    {
      id: 4,
      type: 'payment',
      amount: -75000,
      date: '2024-01-08',
      status: 'completed',
      description: 'خرید سرویس اضافی'
    }
  ]);

  // Mock wallet balance - replace with actual API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setWalletBalance(1275000); // Mock balance
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChargeWallet = async () => {
    if (!chargeAmount || parseFloat(chargeAmount) <= 0) {
      alert('لطفاً مبلغ معتبری وارد کنید');
      return;
    }
    
    setIsCharging(true);
    // Simulate API call
    setTimeout(() => {
      const amount = parseFloat(chargeAmount);
      setWalletBalance(prev => prev + amount);
      
      // Add new transaction
      const newTransaction: Transaction = {
        id: Date.now(),
        type: 'charge',
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        description: 'شارژ کیف پول'
      };
      setRecentTransactions(prev => [newTransaction, ...prev]);
      setChargeAmount('');
      setShowChargeModal(false);
      setIsCharging(false);
      alert('کیف پول با موفقیت شارژ شد!');
    }, 2000);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fa-IR');
  };

  const getTransactionIcon = (type: string) => {
    return type === 'charge' ? '💰' : '💳';
  };

  const getTransactionColor = (type: string) => {
    return type === 'charge' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <ContentArea className="space-y-6">
      {/* Wallet Header */}
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-right">
          <h1 className="text-3xl font-bold gx-gradient-text">کیف پول</h1>
          <p className="text-gray-400 mt-1">مدیریت موجودی و تراکنش‌های مالی</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="success" size="lg">
            💳 کیف پول فعال
          </Badge>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <Card className="gx-neon hover:scale-[1.02] transition-transform duration-200 ease-out">
        <div className="text-center py-8">
          <div className="text-6xl mb-4 icon-wave">💎</div>
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">موجودی کیف پول</h2>
          <div className="text-5xl font-bold gx-gradient-text mb-4">
            {isLoaded ? formatAmount(walletBalance) : '0'} تومان
          </div>
          <Button
            onClick={() => setShowChargeModal(true)}
            variant="primary"
            size="lg"
            className="btn-wave mt-4"
          >
            💰 شارژ کیف پول
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="gx-neon card-wave">
          <div className="text-center p-6">
            <div className="text-4xl mb-3 icon-wave">💳</div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">پرداخت سریع</h3>
            <p className="text-gray-400 text-sm mb-4">پرداخت فوری اشتراک‌ها</p>
            <Button variant="outline" size="sm" className="btn-wave">
              پرداخت
            </Button>
          </div>
        </Card>
        <Card hover className="gx-neon card-wave">
          <div className="text-center p-6">
            <div className="text-4xl mb-3 icon-wave">📊</div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">گزارش مالی</h3>
            <p className="text-gray-400 text-sm mb-4">مشاهده گزارش‌های تفصیلی</p>
            <Button variant="outline" size="sm" className="btn-wave">
              مشاهده
            </Button>
          </div>
        </Card>
        <Card hover className="gx-neon card-wave">
          <div className="text-center p-6">
            <div className="text-4xl mb-3 icon-wave">⚙️</div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">تنظیمات</h3>
            <p className="text-gray-400 text-sm mb-4">مدیریت تنظیمات پرداخت</p>
            <Button variant="outline" size="sm" className="btn-wave">
              تنظیمات
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="gx-neon">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-blue-300">تراکنش‌های اخیر</h3>
          <Badge variant="primary">30 روز گذشته</Badge>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50">
              <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
              <div className="flex-1">
                <p className="text-white font-medium">{transaction.description}</p>
                <p className="text-gray-400 text-sm">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)} تومان
                </p>
                <Badge 
                  variant={transaction.status === 'completed' ? 'success' : 'warning'}
                  size="sm"
                >
                  {transaction.status === 'completed' ? 'تکمیل شده' : 'در انتظار'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charge Wallet Modal */}
      <Modal
        isOpen={showChargeModal}
        onClose={() => setShowChargeModal(false)}
        title="شارژ کیف پول"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              مبلغ شارژ (تومان)
            </label>
            <Input
              type="number"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              placeholder="مبلغ مورد نظر را وارد کنید"
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setChargeAmount(amount.toString())}
                className="btn-wave"
              >
                {formatAmount(amount)}
              </Button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleChargeWallet}
              variant="primary"
              disabled={isCharging || !chargeAmount}
              className="flex-1 btn-wave"
            >
              {isCharging ? 'در حال پردازش...' : 'شارژ کیف پول'}
            </Button>
            <Button
              onClick={() => setShowChargeModal(false)}
              variant="outline"
              className="btn-wave"
            >
              انصراف
            </Button>
          </div>
        </div>
      </Modal>
    </ContentArea>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <WalletPageContent />
    </ProtectedRoute>
  );
}