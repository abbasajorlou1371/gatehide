'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Badge } from '../components/ui';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import { UserSession } from '../types/sessions';

interface ActiveSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ActiveSessionsModal({ isOpen, onClose }: ActiveSessionsModalProps) {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadSessions = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getActiveSessions(token);
      const sessions = response.sessions || [];
      setSessions(sessions);
    } catch (err) {
      setError('خطا در بارگذاری جلسات فعال');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, token, loadSessions]);

  const handleLogoutSession = async (sessionId: number) => {
    if (!token) return;
    
    setActionLoading(sessionId);
    
    try {
      await apiClient.logoutSession(token, sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (err) {
      setError('خطا در خروج از جلسه');
      console.error('Error logging out session:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogoutAllOthers = async () => {
    if (!token) return;
    
    setActionLoading(-1); // Special value for "logout all others"
    
    try {
      await apiClient.logoutAllOtherSessions(token);
      // Reload sessions to update the list
      await loadSessions();
    } catch (err) {
      setError('خطا در خروج از سایر جلسات');
      console.error('Error logging out other sessions:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogoutAll = async () => {
    if (!token) return;
    
    setActionLoading(-2); // Special value for "logout all"
    
    try {
      await apiClient.logoutAllSessions(token);
      // Close modal and redirect to login
      onClose();
      window.location.href = '/login';
    } catch (err) {
      setError('خطا در خروج از تمام جلسات');
      console.error('Error logging out all sessions:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return '📱';
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile')) return '📱';
    if (ua.includes('tablet')) return '📱';
    if (ua.includes('chrome')) return '🌐';
    if (ua.includes('firefox')) return '🦊';
    if (ua.includes('safari')) return '🧭';
    if (ua.includes('edge')) return '🌐';
    return '💻';
  };

  const getLocationFromIP = (ipAddress?: string) => {
    if (!ipAddress) return 'نامشخص';
    
    // Simple IP-based location detection (in production, use a proper geolocation service)
    if (ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
      return 'محلی';
    }
    
    return 'ایران'; // Default for Iranian users
  };

  const currentSession = sessions.find(session => session.is_current);
  const otherSessions = sessions.filter(session => !session.is_current);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="جلسات فعال"
      size="lg"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="mr-3 text-gray-400">در حال بارگذاری...</span>
          </div>
        ) : (
          <>
            {/* Current Session */}
            {currentSession && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">جلسه فعلی</h3>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getDeviceIcon(currentSession.user_agent)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">
                            {currentSession.device_info || 'مرورگر فعلی'}
                          </h4>
                          <Badge variant="success">فعلی</Badge>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {getLocationFromIP(currentSession.ip_address)} • {formatDate(currentSession.last_activity_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-green-400">
                      <span className="text-sm">🟢 فعال</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Sessions */}
            {otherSessions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">جلسات دیگر</h3>
                  <Button
                    onClick={handleLogoutAllOthers}
                    disabled={actionLoading === -1}
                    className="btn-danger btn-wave text-sm"
                    size="sm"
                  >
                    {actionLoading === -1 ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        در حال خروج...
                      </>
                    ) : (
                      '🚪 خروج از سایر جلسات'
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  {otherSessions.map((session) => (
                    <div key={session.id} className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getDeviceIcon(session.user_agent)}</span>
                          <div>
                            <h4 className="text-white font-medium">
                              {session.device_info || 'دستگاه نامشخص'}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {getLocationFromIP(session.ip_address)} • {formatDate(session.last_activity_at)}
                            </p>
                            <p className="text-gray-500 text-xs">
                              ایجاد شده: {formatDate(session.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="warning">فعال</Badge>
                          <Button
                            onClick={() => handleLogoutSession(session.id)}
                            disabled={actionLoading === session.id}
                            className="btn-danger btn-wave text-sm"
                            size="sm"
                          >
                            {actionLoading === session.id ? (
                              <>
                                <span className="animate-spin mr-1">⏳</span>
                                ...
                              </>
                            ) : (
                              '🚪 خروج'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sessions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">هیچ جلسه فعالی یافت نشد</p>
              </div>
            )}

            {/* Danger Zone */}
            {sessions.length > 1 && (
              <div className="pt-6 border-t border-gray-700">
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-medium mb-2">منطقه خطر</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    خروج از تمام جلسات باعث خروج شما از تمام دستگاه‌ها خواهد شد
                  </p>
                  <Button
                    onClick={handleLogoutAll}
                    disabled={actionLoading === -2}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {actionLoading === -2 ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        در حال خروج از تمام جلسات...
                      </>
                    ) : (
                      '🚪 خروج از تمام جلسات'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            disabled={loading}
            className="btn-ghost btn-wave"
          >
            بستن
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ActiveSessionsModal;
