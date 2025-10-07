'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, Button, Input, Badge } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/api';

interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  image?: string;
}

interface ProfileSettingsProps {
  onSave: (profile: UserProfile) => void;
  isSaving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
}

export default function ProfileSettings({ onSave, isSaving, saveStatus }: ProfileSettingsProps) {
  const { user, isLoading, token, updateUser } = useAuth();
  
  // Create profile data from authenticated user
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    mobile: ''
  });

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        image: user.image || ''
      });
    }
  }, [user]);

  // Email verification state
  const [emailVerification, setEmailVerification] = useState({
    isPending: false,
    newEmail: '',
    verificationCode: '',
    showVerificationForm: false,
    showConfirmationDialog: false,
    isVerified: false,
    isSendingEmail: false,
    hasError: false,
    errorMessage: ''
  });

  // Image upload state
  const [imageUpload, setImageUpload] = useState({
    isUploading: false,
    preview: null as string | null
  });

  // Check if email has changed and show confirmation dialog
  const handleEmailChange = (newEmail: string) => {
    setProfile(prev => ({ ...prev, email: newEmail }));
    
    // Check if email has changed and is valid
    if (newEmail !== user?.email && newEmail.trim() && !emailVerification.isVerified) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(newEmail)) {
        setEmailVerification(prev => ({
          ...prev,
          newEmail: newEmail.trim(),
          showConfirmationDialog: true,
          isVerified: false
        }));
      }
    }
  };

  const handleSave = async () => {
    // Check if email has changed but not verified
    if (profile.email !== user?.email && !emailVerification.isVerified) {
      alert('لطفاً ابتدا ایمیل جدید خود را تأیید کنید');
      return;
    }

    // Update profile data
    const updateData: { name: string; mobile: string; image?: string; email?: string } = {
      name: profile.name,
      mobile: profile.mobile,
      image: profile.image
    };

    // If email is verified, include it in the update
    if (emailVerification.isVerified && profile.email !== user?.email) {
      updateData.email = profile.email;
    }

    onSave(updateData as UserProfile);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setImageUpload(prev => ({ ...prev, isUploading: true }));

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUpload(prev => ({ 
          ...prev, 
          preview: e.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);

      // Upload to server
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await apiClient.uploadProfileImage(token, file);
      
      // Update profile with server response
      setProfile(prev => ({ ...prev, image: response.data.image_url }));
      
      // Update user context
      if (updateUser) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setImageUpload(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleConfirmEmailVerification = async () => {
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      // Set loading state
      setEmailVerification(prev => ({ ...prev, isSendingEmail: true }));
      
      // Validate email before sending
      if (!emailVerification.newEmail || !emailVerification.newEmail.trim()) {
        throw new Error('Email address is required');
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVerification.newEmail)) {
        throw new Error('Please enter a valid email address');
      }
      
      console.log('Sending email verification request...');
      const response = await apiClient.sendEmailVerification(token, emailVerification.newEmail.trim());
      console.log('Email verification response:', response);
      
      // The response structure is { message: string, code: string }
      if (response.code && response.message) {
        console.log('Verification code:', response.code); // For testing
        
        // Hide confirmation dialog and show verification form
        setEmailVerification(prev => ({ 
          ...prev, 
          isPending: true,
          showConfirmationDialog: false,
          showVerificationForm: true,
          isSendingEmail: false
        }));
        console.log('Email verification state updated successfully');
      } else {
        console.log('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      
      // Reset email verification state on error
      setEmailVerification(prev => ({ 
        ...prev, 
        showConfirmationDialog: false,
        showVerificationForm: false,
        isPending: false,
        isSendingEmail: false
      }));
      
      // Show error message to user
      const errorMessage = error instanceof Error ? error.message : 'خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید.';
      alert(errorMessage);
    }
  };

  const handleCancelEmailVerification = () => {
    // Reset email to original value
    setProfile(prev => ({ ...prev, email: user?.email || '' }));
    setEmailVerification({
      isPending: false,
      newEmail: '',
      verificationCode: '',
      showVerificationForm: false,
      showConfirmationDialog: false,
      isVerified: false,
      isSendingEmail: false,
      hasError: false,
      errorMessage: ''
    });
  };

  const handleVerificationCodeChange = (code: string) => {
    setEmailVerification(prev => ({ 
      ...prev, 
      verificationCode: code,
      hasError: false,
      errorMessage: ''
    }));
  };

  const handleVerifyCode = async () => {
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      if (!emailVerification.verificationCode.trim()) {
        alert('لطفاً کد تأیید را وارد کنید');
        return;
      }
      
      const response = await apiClient.verifyEmailCode(
        token, 
        emailVerification.newEmail, 
        emailVerification.verificationCode
      );
      
      // The response structure is { message: string, user: User }
      if (response.user) {
        // Update user context with new email
        updateUser(response.user);
        
        // Mark email as verified and clear any errors
        setEmailVerification(prev => ({
          ...prev,
          isPending: false,
          verificationCode: '',
          showVerificationForm: false,
          isVerified: true,
          hasError: false,
          errorMessage: ''
        }));
      }
    } catch (error) {
      console.error('Code verification failed:', error);
      
      // Set error state for UI feedback
      const errorMessage = error && typeof error === 'object' && 'status' in error && error.status === 400
        ? 'کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.'
        : 'خطا در تأیید کد. لطفاً دوباره تلاش کنید.';
      
      setEmailVerification(prev => ({
        ...prev,
        hasError: true,
        errorMessage: errorMessage
      }));
    }
  };

  return (
    <Card className="gx-neon">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">اطلاعات پروفایل</h2>
        <Badge variant="primary">👤 پروفایل</Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="mr-3 text-gray-400">در حال بارگذاری...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                {profile.image || imageUpload.preview ? (
                  <Image 
                    src={profile.image || imageUpload.preview || ''} 
                    alt="Profile" 
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                    👤
                  </div>
                )}
              </div>
              {imageUpload.isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                تصویر پروفایل
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image-upload"
              />
              <label
                htmlFor="profile-image-upload"
                className="btn-ghost btn-wave cursor-pointer"
              >
                📷 تغییر تصویر
              </label>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              نام و نام خانوادگی *
            </label>
            <Input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="نام و نام خانوادگی خود را وارد کنید"
              className="w-full"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              ایمیل *
            </label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="ایمیل خود را وارد کنید"
              className="w-full"
            />
            {profile.email !== user?.email && !emailVerification.isVerified && (
              <p className="text-yellow-400 text-sm mt-1">
                ⚠️ برای تغییر ایمیل، ابتدا باید آن را تأیید کنید
              </p>
            )}
            {emailVerification.isVerified && (
              <p className="text-green-400 text-sm mt-1">
                ✅ ایمیل تأیید شد - می‌توانید تغییرات را ذخیره کنید
              </p>
            )}
          </div>

          {/* Email Verification Confirmation Dialog */}
          {emailVerification.showConfirmationDialog && (
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h3 className="text-blue-400 font-medium mb-2">تأیید تغییر ایمیل</h3>
              <p className="text-gray-300 text-sm mb-4">
                آیا می‌خواهید کد تأیید به ایمیل <strong>{emailVerification.newEmail}</strong> ارسال شود؟
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmEmailVerification}
                  disabled={emailVerification.isSendingEmail}
                  className="btn-primary btn-wave"
                >
                  {emailVerification.isSendingEmail ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      📧 بله، کد تأیید ارسال کن
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelEmailVerification}
                  disabled={emailVerification.isSendingEmail}
                  className="btn-ghost btn-wave"
                >
                  انصراف
                </Button>
              </div>
            </div>
          )}

          {/* Email Verification Modal */}
          {emailVerification.showVerificationForm && (
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <h3 className="text-yellow-400 font-medium mb-2">تأیید ایمیل جدید</h3>
              <p className="text-gray-400 text-sm mb-4">
                کد تأیید به ایمیل {emailVerification.newEmail} ارسال شد
              </p>
              <div className="space-y-3">
                <Input
                  type="text"
                  value={emailVerification.verificationCode}
                  onChange={(e) => handleVerificationCodeChange(e.target.value)}
                  placeholder="کد تأیید را وارد کنید"
                  className={`w-full ${
                    emailVerification.isVerified 
                      ? 'border-green-500 bg-green-50/10' 
                      : emailVerification.hasError 
                        ? 'border-red-500 bg-red-50/10' 
                        : ''
                  }`}
                />
                {emailVerification.isVerified && (
                  <p className="text-green-400 text-sm">
                    ✅ کد تأیید با موفقیت تأیید شد - می‌توانید تغییرات را ذخیره کنید
                  </p>
                )}
                {emailVerification.hasError && (
                  <p className="text-red-400 text-sm">
                    ❌ {emailVerification.errorMessage}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={handleVerifyCode}
                    disabled={!emailVerification.verificationCode}
                    className="btn-primary btn-wave"
                  >
                    ✅ تأیید کد
                  </Button>
                  <Button
                    onClick={() => setEmailVerification(prev => ({ 
                      ...prev, 
                      showVerificationForm: false 
                    }))}
                    className="btn-ghost btn-wave"
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              شماره تلفن
            </label>
            <Input
              type="tel"
              value={profile.mobile}
              onChange={(e) => setProfile(prev => ({ ...prev, mobile: e.target.value }))}
              placeholder="شماره تلفن خود را وارد کنید"
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Save Button for Profile Section */}
      <div className="flex flex-col gap-2 items-center w-full sm:flex-row sm:items-center sm:gap-4 sm:w-auto mt-6">
        {saveStatus === 'success' && (
          <Badge variant="success" className="w-full sm:w-auto text-center">✅ ذخیره شد</Badge>
        )}
        {saveStatus === 'error' && (
          <Badge variant="danger" className="w-full sm:w-auto text-center">❌ خطا در ذخیره</Badge>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving || (profile.email !== user?.email && !emailVerification.isVerified)}
          className="btn-primary btn-wave w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              در حال ذخیره...
            </>
          ) : (
            '💾 ذخیره تغییرات'
          )}
        </Button>
        {profile.email !== user?.email && !emailVerification.isVerified && (
          <p className="text-gray-400 text-xs mt-2 text-center">
            برای ذخیره تغییرات، ابتدا ایمیل جدید را تأیید کنید
          </p>
        )}
      </div>
    </Card>
  );
}
