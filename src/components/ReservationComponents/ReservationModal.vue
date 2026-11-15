<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { reservationService } from '../../services/reservationService';
import { getErrorMessage } from '../../services/apiErrorService';
import { formatClock, statusLabels, todayIso, toTimeInput } from '../../services/formatUtils';

const props = defineProps({
    resource: { type: Object, required: true },
});
const emit = defineEmits(['close', 'created']);

const isEquipment = props.resource.resourceType === 'EQUIPMENT';

const date = ref(todayIso());
const startTime = ref('');
const endTime = ref('');
const attendees = ref(null);
const quantity = ref(1);
const notes = ref('');

const availability = ref(null);
const isLoadingAvailability = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const loadAvailability = async () => {
    isLoadingAvailability.value = true;
    errorMessage.value = '';
    try {
        availability.value = await reservationService.getAvailability(props.resource.id, date.value);
    } catch (error) {
        availability.value = null;
        errorMessage.value = getErrorMessage(error, 'No se pudo consultar la disponibilidad.');
    } finally {
        isLoadingAvailability.value = false;
    }
};

watch(date, () => {
    startTime.value = '';
    endTime.value = '';
    loadAvailability();
});
onMounted(loadAvailability);

const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};
const fromMinutes = (total) => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

// Al tocar una franja libre se rellenan inicio y fin (respetando la duración máxima)
const pickWindow = (window) => {
    const start = toTimeInput(window.start);
    const windowEnd = toMinutes(toTimeInput(window.end));
    const end = Math.min(windowEnd, toMinutes(start) + props.resource.maxDurationMinutes);
    startTime.value = start;
    endTime.value = fromMinutes(end);
};

const canSubmit = computed(() => date.value && startTime.value && endTime.value && !isSubmitting.value);

const submit = async () => {
    errorMessage.value = '';
    isSubmitting.value = true;
    try {
        const payload = {
            resourceId: props.resource.id,
            startTime: `${date.value}T${startTime.value}:00`,
            endTime: `${date.value}T${endTime.value}:00`,
            notes: notes.value || null,
        };
        if (isEquipment) payload.quantity = Number(quantity.value) || 1;
        else if (attendees.value) payload.attendees = Number(attendees.value);

        const created = await reservationService.createReservation(payload);
        successMessage.value = created.status === 'PENDING'
            ? 'Tu solicitud quedó registrada y está pendiente de aprobación.'
            : '¡Reserva confirmada!';
        emit('created', created);
    } catch (error) {
        errorMessage.value = getErrorMessage(error, 'No se pudo crear la reserva.');
        loadAvailability();
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true"
        @click.self="emit('close')">
        <div class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div class="mb-4 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-bold uppercase tracking-wide text-primary">Reservar</p>
                    <h2 class="text-2xl text-secondary">{{ resource.name }}</h2>
                    <p class="text-sm text-slate-500">
                        {{ formatClock(resource.openTime) }} – {{ formatClock(resource.closeTime) }} · máx. {{ resource.maxDurationMinutes }} min
                    </p>
                </div>
                <button type="button" class="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Cerrar" @click="emit('close')">×</button>
            </div>

            <div v-if="successMessage" class="space-y-4">
                <p role="status" class="rounded-xl border border-[#d9e9d5] bg-[#f4faf2] px-4 py-3 text-secondary">{{ successMessage }}</p>
                <button type="button" class="w-full rounded-xl bg-primary px-4 py-3 font-bold text-white hover:bg-secondary" @click="emit('close')">Listo</button>
            </div>

            <form v-else class="space-y-4" @submit.prevent="submit">
                <div>
                    <label for="res-date" class="mb-1 block font-bold text-secondary">Día</label>
                    <input id="res-date" v-model="date" type="date" :min="todayIso()" required class="field-input">
                </div>

                <div>
                    <p class="mb-1 font-bold text-secondary">Franjas libres</p>
                    <p v-if="isLoadingAvailability" class="text-sm text-slate-500">Consultando disponibilidad...</p>
                    <p v-else-if="availability && !availability.freeWindows.length" class="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        No hay franjas libres este día. Prueba con otra fecha.
                    </p>
                    <div v-else-if="availability" class="flex flex-wrap gap-2">
                        <button v-for="window in availability.freeWindows" :key="window.start" type="button"
                            class="rounded-full border border-primary px-3 py-1 text-sm font-semibold text-secondary transition hover:bg-primary hover:text-white"
                            @click="pickWindow(window)">
                            {{ toTimeInput(window.start) }} – {{ toTimeInput(window.end) }}
                            <span v-if="isEquipment">({{ window.availableQuantity }} disp.)</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label for="res-start" class="mb-1 block font-bold text-secondary">Inicio</label>
                        <input id="res-start" v-model="startTime" type="time" step="900" required class="field-input">
                    </div>
                    <div>
                        <label for="res-end" class="mb-1 block font-bold text-secondary">Fin</label>
                        <input id="res-end" v-model="endTime" type="time" step="900" required class="field-input">
                    </div>
                </div>

                <div v-if="isEquipment">
                    <label for="res-qty" class="mb-1 block font-bold text-secondary">Unidades</label>
                    <input id="res-qty" v-model="quantity" type="number" min="1" :max="resource.quantity" class="field-input">
                </div>
                <div v-else>
                    <label for="res-att" class="mb-1 block font-bold text-secondary">Personas (opcional)</label>
                    <input id="res-att" v-model="attendees" type="number" min="1" :max="resource.capacity || undefined" class="field-input">
                </div>

                <div>
                    <label for="res-notes" class="mb-1 block font-bold text-secondary">Notas (opcional)</label>
                    <textarea id="res-notes" v-model="notes" rows="2" maxlength="500" class="field-input" />
                </div>

                <p v-if="resource.requiresApproval" class="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    Este recurso requiere aprobación: tu reserva quedará «{{ statusLabels.PENDING }}».
                </p>
                <p v-if="errorMessage" role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ errorMessage }}</p>

                <button type="submit" :disabled="!canSubmit"
                    class="w-full rounded-xl bg-primary px-4 py-3 text-lg font-bold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
                    {{ isSubmitting ? 'Reservando...' : 'Confirmar reserva' }}
                </button>
            </form>
        </div>
    </div>
</template>
