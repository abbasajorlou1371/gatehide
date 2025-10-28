'use client';

import { ReactNode, useState } from 'react';
import { Button, ButtonProps } from './ui';
import { useHasPermission } from '../hooks/usePermissions';

interface PermissionButtonProps extends Omit<ButtonProps, 'disabled'> {
  permission: string;
  disabledMessage?: string;
  showTooltip?: boolean;
  fallback?: ReactNode;
}

/**
 * Permission-aware button component
 * Automatically disabled if user lacks permission
 * Shows tooltip with message when disabled due to permissions
 */
export default function PermissionButton({
  permission,
  disabledMessage = 'شما دسترسی لازم برای این عمل را ندارید',
  showTooltip = true,
  fallback,
  children,
  ...buttonProps
}: PermissionButtonProps) {
  const hasPermission = useHasPermission(permission);
  const [showTooltipState, setShowTooltipState] = useState(false);
  
  // If user doesn't have permission and fallback is provided, render fallback
  if (!hasPermission && fallback) {
    return <>{fallback}</>;
  }
  
  // If user doesn't have permission and no fallback, render disabled button
  if (!hasPermission) {
    return (
      <div className="relative inline-block">
        <Button
          {...buttonProps}
          disabled={true}
          className={`${buttonProps.className || ''} opacity-50 cursor-not-allowed`}
          onMouseEnter={() => showTooltip && setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
          onFocus={() => showTooltip && setShowTooltipState(true)}
          onBlur={() => setShowTooltipState(false)}
        >
          {children}
        </Button>
        
        {/* Tooltip */}
        {showTooltip && showTooltipState && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
            {disabledMessage}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  }
  
  // User has permission, render normal button
  return (
    <Button {...buttonProps}>
      {children}
    </Button>
  );
}

/**
 * Permission-aware icon button component
 * @param permission Required permission
 * @param icon Icon component
 * @param onClick Click handler
 * @param disabledMessage Message to show when disabled
 * @param otherProps Additional button props
 */
export function PermissionIconButton({
  permission,
  icon,
  onClick,
  disabledMessage = 'شما دسترسی لازم برای این عمل را ندارید',
  ...otherProps
}: {
  permission: string;
  icon: ReactNode;
  onClick?: () => void;
  disabledMessage?: string;
} & Omit<ButtonProps, 'children' | 'onClick'>) {
  return (
    <PermissionButton
      permission={permission}
      disabledMessage={disabledMessage}
      onClick={onClick}
      {...otherProps}
    >
      {icon}
    </PermissionButton>
  );
}

/**
 * Permission-aware action button group
 * @param actions Array of actions with permissions
 * @param className Additional CSS classes
 */
export function PermissionActionGroup({
  actions,
  className = '',
}: {
  actions: Array<{
    permission: string;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: ReactNode;
  }>;
  className?: string;
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {actions.map((action, index) => (
        <PermissionButton
          key={index}
          permission={action.permission}
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          disabledMessage={`شما دسترسی لازم برای ${action.label} را ندارید`}
        >
          {action.icon && <span className="ml-2">{action.icon}</span>}
          {action.label}
        </PermissionButton>
      ))}
    </div>
  );
}
