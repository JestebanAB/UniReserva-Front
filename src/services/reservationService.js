import api from '../api/axios';

export const reservationService = {
    async getCategories() {
        const { data } = await api.get('api/categories');
        return data;
    },

    // filters: { categoryId, type, q }
    async getResources(filters = {}) {
        const params = {};
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.type) params.type = filters.type;
        if (filters.q) params.q = filters.q;
        const { data } = await api.get('api/resources', { params });
        return data;
    },

    // { resourceId, resourceName, date, openTime, closeTime, totalQuantity, maxDurationMinutes, freeWindows: [{start,end,availableQuantity}], busySlots }
    async getAvailability(resourceId, date) {
        const { data } = await api.get(`api/resources/${resourceId}/availability`, { params: { date } });
        return data;
    },

    // { resourceId, startTime, endTime, quantity?, attendees?, notes? }
    async createReservation(payload) {
        const { data } = await api.post('api/reservations', payload);
        return data;
    },

    async getMyReservations() {
        const { data } = await api.get('api/reservations/mine');
        return data;
    },

    async cancelReservation(reservationId) {
        const { data } = await api.delete(`api/reservations/${reservationId}`);
        return data;
    },
};
