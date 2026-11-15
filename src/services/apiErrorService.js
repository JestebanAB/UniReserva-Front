const fieldLabels = {
    documentType: 'Tipo de documento',
    email: 'Correo electrónico',
    idNumber: 'Número de documento',
    names: 'Nombres',
    nickname: 'Nombre de usuario',
    password: 'Contraseña',
    surNames: 'Apellidos',
    resourceId: 'Recurso',
    startTime: 'Hora de inicio',
    endTime: 'Hora de fin',
    quantity: 'Cantidad',
    attendees: 'Asistentes',
    notes: 'Notas',
    name: 'Nombre',
    categoryId: 'Categoría',
    capacity: 'Capacidad',
    openTime: 'Hora de apertura',
    closeTime: 'Hora de cierre',
    maxDurationMinutes: 'Duración máxima',
};

export const getApiErrorFieldLabel = (field) => fieldLabels[field] || field;

// Mensaje legible a partir de un error de axios
export const getErrorMessage = (error, fallback) => {
    const data = error.response?.data;
    if (data?.errors && typeof data.errors === 'object') {
        const first = Object.values(data.errors)[0];
        if (first) return first;
    }
    return data?.message
        || (error.response ? fallback : 'No fue posible conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
};
