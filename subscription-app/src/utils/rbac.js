export const ROLES = {
    ADMIN: 'admin',
    INTERNAL: 'internal',
    CUSTOMER: 'customer'
};

export const PERMISSIONS = {
    // Dashboard
    VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.INTERNAL, ROLES.CUSTOMER],

    // Subscriptions
    VIEW_SUBSCRIPTIONS: [ROLES.ADMIN, ROLES.INTERNAL, ROLES.CUSTOMER], // Customer: own only
    MANAGE_SUBSCRIPTIONS: [ROLES.ADMIN, ROLES.INTERNAL],
    CREATE_SUBSCRIPTION: [ROLES.ADMIN, ROLES.INTERNAL],
    DELETE_SUBSCRIPTION: [ROLES.ADMIN],

    // Invoices
    VIEW_INVOICES: [ROLES.ADMIN, ROLES.INTERNAL, ROLES.CUSTOMER],
    MANAGE_INVOICES: [ROLES.ADMIN, ROLES.INTERNAL],

    // Products & Plans
    VIEW_PRODUCTS: [ROLES.ADMIN, ROLES.INTERNAL],
    MANAGE_PRODUCTS: [ROLES.ADMIN],

    // Users & Settings
    MANAGE_USERS: [ROLES.ADMIN],
    MANAGE_SETTINGS: [ROLES.ADMIN],

    // Reports
    VIEW_REPORTS: [ROLES.ADMIN, ROLES.INTERNAL]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - The user's role
 * @param {string} permission - The action to check (key in PERMISSIONS)
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
    if (!role) return false;
    const allowedRoles = PERMISSIONS[permission];
    return allowedRoles ? allowedRoles.includes(role) : false;
};
