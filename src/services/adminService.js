import api from '../api/axios';

export const adminService = {
    async getResources() {
        const { data } = await api.get('api/admin/resources');
        return data;
    },

    async createResource(payload) {
        const { data } = await api.post('api/admin/resources', payload);
        return data;
    },

    async updateResource(id, payload) {
        const { data } = await api.put(`api/admin/resources/${id}`, payload);
        return data;
    },

    async uploadResourceImage(id, image) {
        const formData = new FormData();
        formData.append('image', image);
        const { data } = await api.post(`api/admin/resources/${id}/image`, formData);
        return data;
    },

    // status opcional: PENDING | CONFIRMED | CANCELLED | REJECTED | COMPLETED
    async getReservations(status) {
        const { data } = await api.get('api/admin/reservations', { params: status ? { status } : {} });
        return data;
    },

    async approve(reservationId) {
        const { data } = await api.post(`api/admin/reservations/${reservationId}/approve`);
        return data;
    },

    async reject(reservationId) {
        const { data } = await api.post(`api/admin/reservations/${reservationId}/reject`);
        return data;
    },
};
