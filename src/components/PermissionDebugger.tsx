'use client';

import { useState, useEffect } from 'react';
import { usePermissionSummary } from '../hooks/usePermissions';
import { PERMISSIONS } from '../types/permission';

export default function PermissionDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const permissionSummary = usePermissionSummary();

  // Only show in development mode
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + P to toggle debugger
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setIsVisible(!isVisible);
        if (!isVisible) {
          setIsOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Permission Debugger (Ctrl+Shift+P)"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-purple-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">Permission Debugger</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 max-h-80 overflow-y-auto">
            {/* User Info */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">User Info</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <div>Type: <span className="font-mono">{permissionSummary.userType || 'None'}</span></div>
                <div>Authenticated: <span className="font-mono">{permissionSummary.isAuthenticated ? 'Yes' : 'No'}</span></div>
                <div>Total Permissions: <span className="font-mono">{permissionSummary.totalPermissions}</span></div>
                <div>Total Resources: <span className="font-mono">{permissionSummary.totalResources}</span></div>
              </div>
            </div>

            {/* All Permissions */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">All Permissions</h4>
              <div className="text-sm">
                {permissionSummary.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {permissionSummary.permissions.map((permission, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">No permissions</span>
                )}
              </div>
            </div>

            {/* Grouped Permissions */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">By Resource</h4>
              <div className="text-sm space-y-2">
                {Object.entries(permissionSummary.grouped).map(([resource, actions]) => (
                  <div key={resource}>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{resource}</div>
                    <div className="flex flex-wrap gap-1 ml-2">
                      {actions.map((action, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Permission Tests */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Tests</h4>
              <div className="text-sm space-y-1">
                {Object.entries(PERMISSIONS).slice(0, 10).map(([key, permission]) => {
                  const hasPermission = permissionSummary.permissions.includes(permission);
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{key}:</span>
                      <span className={`font-mono ${hasPermission ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {hasPermission ? '✓' : '✗'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2 mt-4">
              <p>Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Shift+P</kbd> to toggle this debugger</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
