const roleOptions = [
    {
        id: 'student',
        routeName: 'student',
        label: 'Estudiante',
        description: 'Reserva espacios y equipos de la universidad.',
    },
    {
        id: 'teacher',
        routeName: 'teacher',
        label: 'Profesor',
        description: 'Reserva espacios y equipos para tus clases y actividades.',
    },
    {
        id: 'admin',
        routeName: 'admin',
        label: 'Administrador',
        description: 'Gestiona recursos y aprueba reservas.',
    },
];

const roleAliases = {
    ESTUDIANTE: 'student',
    STUDENT: 'student',
    PROFESOR: 'teacher',
    TEACHER: 'teacher',
    ADMIN: 'admin',
    ADMINISTRADOR: 'admin',
};

const normalizeRole = (role) => {
    if (typeof role !== 'string') return null;

    const normalized = role
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase()
        .replace(/^ROLE[_\s-]*/, '')
        .replace(/[\s-]+/g, '_');

    return roleAliases[normalized] || null;
};

export const clearStoredAuthState = () => {
    localStorage.removeItem('authResponse');
    localStorage.removeItem('activeRole');
};

export const getAvailableRoles = (roles) => {
    if (!Array.isArray(roles)) return [];

    const availableIds = new Set(roles.map(normalizeRole).filter(Boolean));
    return roleOptions.filter((role) => availableIds.has(role.id));
};

export const getStoredAuthResponse = () => {
    const storedResponse = localStorage.getItem('authResponse');
    if (!storedResponse) return null;

    try {
        return JSON.parse(storedResponse);
    } catch {
        clearStoredAuthState();
        return null;
    }
};

export const setActiveRole = (roleId) => {
    const roles = getAvailableRoles(getStoredAuthResponse()?.roles);
    if (!roles.some((role) => role.id === roleId)) return false;

    localStorage.setItem('activeRole', roleId);
    return true;
};

export const getActiveRole = () => {
    const activeRole = localStorage.getItem('activeRole');
    if (!activeRole) return null;

    const roles = getAvailableRoles(getStoredAuthResponse()?.roles);
    return roles.find((role) => role.id === activeRole);
};

export const clearActiveRole = () => {
    localStorage.removeItem('activeRole');
};
