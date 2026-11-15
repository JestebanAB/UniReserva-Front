<script setup>
import { onMounted, ref } from 'vue';
import { reservationService } from '../../services/reservationService';
import { getErrorMessage } from '../../services/apiErrorService';
import { formatDate, formatTime, statusLabels, statusStyles } from '../../services/formatUtils';

const reservations = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const load = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
        reservations.value = await reservationService.getMyReservations();
    } catch (error) {
        if (error.response?.status === 401) return;
        errorMessage.value = getErrorMessage(error, 'No se pudieron cargar tus reservas.');
    } finally {
        isLoading.value = false;
    }
};

const canCancel = (reservation) =>
    ['PENDING', 'CONFIRMED'].includes(reservation.status) && new Date(reservation.startTime) > new Date();

const cancel = async (reservation) => {
    if (!window.confirm(`¿Cancelar la reserva de «${reservation.resourceName}»?`)) return;
    errorMessage.value = '';
    try {
        await reservationService.cancelReservation(reservation.id);
        await load();
    } catch (error) {
        errorMessage.value = getErrorMessage(error, 'No se pudo cancelar la reserva.');
    }
};

onMounted(load);
defineExpose({ reload: load });
</script>

<template>
    <section>
        <p v-if="errorMessage" role="alert" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">{{ errorMessage }}</p>
        <p v-if="isLoading" class="text-slate-500">Cargando tus reservas...</p>
        <p v-else-if="!reservations.length" class="rounded-xl bg-white px-4 py-6 text-center text-slate-500">
            Aún no tienes reservas. Ve al catálogo o pídele una a Resi.
        </p>

        <ul v-else class="space-y-3">
            <li v-for="reservation in reservations" :key="reservation.id"
                class="flex flex-col gap-3 rounded-2xl border border-[#dce9d9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p class="text-lg font-bold text-secondary">{{ reservation.resourceName }}</p>
                    <p class="text-slate-600">
                        {{ formatDate(reservation.startTime) }} · {{ formatTime(reservation.startTime) }} – {{ formatTime(reservation.endTime) }}
                    </p>
                    <p class="text-sm text-slate-500">
                        {{ reservation.location }}
                        <span v-if="reservation.channel === 'AGENT'"> · reservada con Resi 🤖</span>
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="rounded-full px-3 py-1 text-sm font-bold" :class="statusStyles[reservation.status]">
                        {{ statusLabels[reservation.status] }}
                    </span>
                    <button v-if="canCancel(reservation)" type="button"
                        class="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-bold text-red-700 transition hover:bg-red-50"
                        @click="cancel(reservation)">
                        Cancelar
                    </button>
                </div>
            </li>
        </ul>
    </section>
</template>
