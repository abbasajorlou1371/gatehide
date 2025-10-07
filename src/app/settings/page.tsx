'use client';

import { useState } from 'react';
import { Card } from '../../components/ui';
import ContentArea from '../../components/ContentArea';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/api';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';

interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  image?: string;
}


function SettingsPageContent() {
  const { token, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');


  const handleSave = async (profileData: UserProfile) => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Call API to update profile
      if (!token) {
        throw new Error('No authentication token available');
      }
      const response = await apiClient.updateProfile(token, profileData);
      
      // Update user context with new data
      if (response.data) {
        updateUser(response.data);
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'پروفایل', icon: '👤' },
    { id: 'security', name: 'امنیت', icon: '🛡️' }
  ] as const;

  return (
    <ContentArea className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-right">
          <h1 className="text-3xl font-bold gx-gradient-text">تنظیمات</h1>
          <p className="text-gray-400 mt-1">مدیریت حساب کاربری و تنظیمات شخصی</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="gx-neon lg:col-span-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-right p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <ProfileSettings 
              onSave={handleSave}
              isSaving={isSaving}
              saveStatus={saveStatus}
            />
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <SecuritySettings />
          )}
        </div>
      </div>
    </ContentArea>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  );
}
