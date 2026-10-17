import React from 'react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import AdminEditBadge from './AdminEditBadge';

/**
 * Visual Admin Overlay wrapper for live frontend content blocks.
 *
 * CRITICAL REQUIREMENT (Requirement 1): Zero Interference for Public Users.
 * If the user is NOT authenticated as an administrator, this component immediately
 * returns `children` directly, rendering ZERO extra DOM nodes, zero classes, and zero scripts.
 */
export default function AdminOverlayBlock({
  children,
  tab,
  title,
  itemId,
  field,
  badgePosition = 'top-right',
  className = '',
}) {
  const { isAdmin, overlayEnabled } = useAdminAuth();

  // 1. Zero Interference for Public Users
  if (!isAdmin || !overlayEnabled) {
    return children;
  }

  // 2. For logged-in administrators, render the in-context edit trigger
  return (
    <div className={`relative group/admin-overlay ${className}`}>
      {children}
      <AdminEditBadge
        tab={tab}
        title={title}
        itemId={itemId}
        field={field}
        position={badgePosition}
      />
    </div>
  );
}
