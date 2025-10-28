'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SecurityUtils } from '../../utils/security';
import { PERMISSIONS } from '../../types/permission';
import PermissionGuard from '../../components/PermissionGuard';
import PermissionButton from '../../components/PermissionButton';

// Mock user roles with different permissions
const MOCK_ROLES = {
  admin: {
    name: 'مدیر سیستم',
    permissions: [
      'dashboard:view',
      'gamenets:*',
      'subscription_plans:*',
      'analytics:view',
      'payments:view',
      'transactions:view',
      'invoices:view',
      'settings:manage',
      'support:access',
    ],
  },
  gamenet: {
    name: 'مدیر گیم نت',
    permissions: [
      'dashboard:view',
      'users:*',
      'analytics:view',
      'transactions:view',
      'payments:view',
      'support:access',
      'settings:manage',
    ],
  },
  user: {
    name: 'کاربر عادی',
    permissions: [
      'reservation:manage',
      'support:access',
      'settings:manage',
      'wallet:view',
    ],
  },
};

export default function PermissionDemoPage() {
  const { userType, updatePermissions } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>(userType || 'user');

  const switchRole = (role: keyof typeof MOCK_ROLES) => {
    const roleData = MOCK_ROLES[role];
    setSelectedRole(role);
    
    // Update permissions in context and storage
    updatePermissions(roleData.permissions);
    
    // Also update in SecurityUtils for consistency
    SecurityUtils.setPermissions(roleData.permissions, false);
  };

  const currentRoleData = MOCK_ROLES[selectedRole as keyof typeof MOCK_ROLES];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Permission System Demo
          </h1>
          <p className="text-gray-600">
            Test the permission system by switching between different user roles
          </p>
        </div>

        {/* Role Switcher */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Switch User Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(MOCK_ROLES).map(([role, data]) => (
              <button
                key={role}
                onClick={() => switchRole(role as keyof typeof MOCK_ROLES)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === role
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-semibold">{data.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {data.permissions.length} permissions
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Role Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Role Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Role Details</h3>
              <div className="space-y-2">
                <div><strong>Name:</strong> {currentRoleData.name}</div>
                <div><strong>Type:</strong> {selectedRole}</div>
                <div><strong>Permissions Count:</strong> {currentRoleData.permissions.length}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">All Permissions</h3>
              <div className="max-h-32 overflow-y-auto">
                <div className="space-y-1">
                  {currentRoleData.permissions.map((permission, index) => (
                    <div key={index} className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {permission}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permission Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Permission Guards */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Permission Guards</h2>
            <div className="space-y-4">
              <PermissionGuard permission={PERMISSIONS.DASHBOARD_VIEW}>
                <div className="p-3 bg-green-100 border border-green-300 rounded text-green-700">
                  ✅ You can view the dashboard
                </div>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.USERS_CREATE}>
                <div className="p-3 bg-green-100 border border-green-300 rounded text-green-700">
                  ✅ You can create users
                </div>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.GAMENETS_MANAGE}>
                <div className="p-3 bg-green-100 border border-green-300 rounded text-green-700">
                  ✅ You can manage gamenets
                </div>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.SUBSCRIPTION_PLANS_VIEW}>
                <div className="p-3 bg-green-100 border border-green-300 rounded text-green-700">
                  ✅ You can view subscription plans
                </div>
              </PermissionGuard>
              
              <PermissionGuard permission="nonexistent:permission">
                <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
                  ❌ This should never show (nonexistent permission)
                </div>
              </PermissionGuard>
            </div>
          </div>

          {/* Permission Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Permission Buttons</h2>
            <div className="space-y-4">
              <PermissionButton
                permission={PERMISSIONS.DASHBOARD_VIEW}
                variant="primary"
                onClick={() => alert('Dashboard action executed!')}
              >
                View Dashboard
              </PermissionButton>
              
              <PermissionButton
                permission={PERMISSIONS.USERS_CREATE}
                variant="secondary"
                onClick={() => alert('Create user action executed!')}
              >
                Create User
              </PermissionButton>
              
              <PermissionButton
                permission={PERMISSIONS.GAMENETS_MANAGE}
                variant="primary"
                onClick={() => alert('Manage gamenets action executed!')}
              >
                Manage Gamenets
              </PermissionButton>
              
              <PermissionButton
                permission={PERMISSIONS.SUBSCRIPTION_PLANS_VIEW}
                variant="secondary"
                onClick={() => alert('View subscription plans action executed!')}
              >
                View Subscription Plans
              </PermissionButton>
              
              <PermissionButton
                permission="nonexistent:permission"
                variant="danger"
                onClick={() => alert('This should never execute!')}
                disabledMessage="You don't have permission for this action"
              >
                Restricted Action
              </PermissionButton>
            </div>
          </div>
        </div>

        {/* Wildcard Permission Tests */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wildcard Permission Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Users Wildcard (*)</h3>
              <div className="space-y-2">
                <PermissionGuard permission="users:view">
                  <div className="p-2 bg-blue-100 border border-blue-300 rounded text-blue-700 text-sm">
                    ✅ users:view
                  </div>
                </PermissionGuard>
                <PermissionGuard permission="users:create">
                  <div className="p-2 bg-blue-100 border border-blue-300 rounded text-blue-700 text-sm">
                    ✅ users:create
                  </div>
                </PermissionGuard>
                <PermissionGuard permission="users:update">
                  <div className="p-2 bg-blue-100 border border-blue-300 rounded text-blue-700 text-sm">
                    ✅ users:update
                  </div>
                </PermissionGuard>
                <PermissionGuard permission="users:delete">
                  <div className="p-2 bg-blue-100 border border-blue-300 rounded text-blue-700 text-sm">
                    ✅ users:delete
                  </div>
                </PermissionGuard>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Gamenets Wildcard (*)</h3>
              <div className="space-y-2">
                <PermissionGuard permission="gamenets:view">
                  <div className="p-2 bg-purple-100 border border-purple-300 rounded text-purple-700 text-sm">
                    ✅ gamenets:view
                  </div>
                </PermissionGuard>
                <PermissionGuard permission="gamenets:create">
                  <div className="p-2 bg-purple-100 border border-purple-300 rounded text-purple-700 text-sm">
                    ✅ gamenets:create
                  </div>
                </PermissionGuard>
                <PermissionGuard permission="gamenets:update">
                  <div className="p-2 bg-purple-100 border border-purple-300 rounded text-purple-700 text-sm">
                    ✅ gamenets:update
                  </div>
                </PermissionGuard>
                <PermissionGuard permission="gamenets:delete">
                  <div className="p-2 bg-purple-100 border border-purple-300 rounded text-purple-700 text-sm">
                    ✅ gamenets:delete
                  </div>
                </PermissionGuard>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">How to Test</h2>
          <div className="text-blue-800 space-y-2">
            <p>1. <strong>Switch Roles:</strong> Click on different role buttons above to change permissions</p>
            <p>2. <strong>Observe Changes:</strong> Notice how permission guards and buttons show/hide based on role</p>
            <p>3. <strong>Test Wildcards:</strong> Admin role has gamenets:* and gamenet role has users:* permissions</p>
            <p>4. <strong>Check Sidebar:</strong> Navigate to other pages to see how sidebar menu items are filtered</p>
            <p>5. <strong>Test Protected Routes:</strong> Try accessing pages you don&apos;t have permission for</p>
          </div>
        </div>
      </div>
    </div>
  );
}
