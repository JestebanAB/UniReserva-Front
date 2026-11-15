// Utilidades de formato compartidas (el backend devuelve "2026-11-20T14:00:00" en hora local)

const MONTHS = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'];
const timeFormatter = new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit' });

export const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
};

export const formatTime = (value) => (value ? timeFormatter.format(new Date(value)) : '');

export const formatDateTime = (value) => (value ? `${formatDate(value)}, ${formatTime(value)}` : '');

// "06:00:00" -> "6:00 a. m."
export const formatClock = (value) => {
    if (!value) return '';
    const [hours, minutes] = String(value).split(':');
    return timeFormatter.format(new Date(2000, 0, 1, Number(hours), Number(minutes)));
};

// Fecha de hoy en formato YYYY-MM-DD (para <input type="date">)
export const todayIso = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
};

// "2026-11-20T14:00:00" -> "14:00"
export const toTimeInput = (value) => String(value).slice(11, 16);

export const statusLabels = {
    PENDING: 'Pendiente de aprobación',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    REJECTED: 'Rechazada',
    COMPLETED: 'Completada',
};

export const statusStyles = {
    PENDING: 'bg-amber-100 text-amber-900',
    CONFIRMED: 'bg-green-100 text-green-900',
    CANCELLED: 'bg-slate-200 text-slate-700',
    REJECTED: 'bg-red-100 text-red-900',
    COMPLETED: 'bg-blue-100 text-blue-900',
};

export const typeLabels = {
    SPACE: 'Espacio',
    EQUIPMENT: 'Equipo',
};
