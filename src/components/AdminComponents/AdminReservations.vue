<script setup>
import { onMounted, ref, watch } from 'vue';
import { adminService } from '../../services/adminService';
import { reservationService } from '../../services/reservationService';
import { getErrorMessage } from '../../services/apiErrorService';
import { formatDate, formatTime, statusLabels, statusStyles } from '../../services/formatUtils';

const status = ref('PENDING');
const reservations = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const load = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
        reservations.value = await adminService.getReservations(status.value);
    } catch (error) {
        if (error.response?.status === 401) return;
        errorMessage.value = getErrorMessage(error, 'No se pudieron cargar las reservas.');
    } finally {
        isLoading.value = false;
    }
};

const act = async (action, reservation) => {
    errorMessage.value = '';
    try {
        if (action === 'approve') await adminService.approve(reservation.id);
        else if (action === 'reject') await adminService.reject(reservation.id);
        else await reservationService.cancelReservation(reservation.id);
        await load();
    } catch (error) {
        errorMessage.value = getErrorMessage(error, 'No se pudo completar la acción.');
    }
};

watch(status, load);
onMounted(load);
</script>

<template>
    <section>
        <div class="mb-4 max-w-xs">
            <label for="admin-status" class="mb-1 block font-bold text-secondary">Estado</label>
            <select id="admin-status" v-model="status" class="field-input">
                <option value="">Todas</option>
                <option v-for="(label, key) in statusLabels" :key="key" :value="key">{{ label }}</option>
            </select>
        </div>

        <p v-if="errorMessage" role="alert" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">{{ errorMessage }}</p>
        <p v-if="isLoading" class="text-slate-500">Cargando...</p>
        <p v-else-if="!reservations.length" class="rounded-xl bg-white px-4 py-6 text-center text-slate-500">No hay reservas con este estado.</p>

        <ul v-else class="space-y-3">
            <li v-for="reservation in reservations" :key="reservation.id"
                class="flex flex-col gap-3 rounded-2xl border border-[#dce9d9] bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p class="text-lg font-bold text-secondary">{{ reservation.resourceName }}</p>
                    <p class="text-slate-600">
                        {{ formatDate(reservation.startTime) }} · {{ formatTime(reservation.startTime) }} – {{ formatTime(reservation.endTime) }}
                    </p>
                    <p class="text-sm text-slate-500">
                        {{ reservation.userName }} ({{ reservation.userEmail }})
                        <span v-if="reservation.quantity > 1"> · {{ reservation.quantity }} unidades</span>
                        <span v-if="reservation.channel === 'AGENT'"> · vía Resi 🤖</span>
                    </p>
                    <p v-if="reservation.notes" class="text-sm italic text-slate-500">«{{ reservation.notes }}»</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full px-3 py-1 text-sm font-bold" :class="statusStyles[reservation.status]">{{ statusLabels[reservation.status] }}</span>
                    <template v-if="reservation.status === 'PENDING'">
                        <button type="button" class="rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white hover:bg-secondary" @click="act('approve', reservation)">Aprobar</button>
                        <button type="button" class="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-bold text-red-700 hover:bg-red-50" @click="act('reject', reservation)">Rechazar</button>
                    </template>
                    <button v-else-if="reservation.status === 'CONFIRMED' && new Date(reservation.startTime) > new Date()" type="button"
                        class="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-bold text-red-700 hover:bg-red-50" @click="act('cancel', reservation)">
                        Cancelar
                    </button>
                </div>
            </li>
        </ul>
    </section>
</template>
