<script setup>
import { ref } from 'vue';
import { getStoredAuthResponse } from '../services/roleService';
import ResourceCatalog from './ReservationComponents/ResourceCatalog.vue';
import ReservationModal from './ReservationComponents/ReservationModal.vue';
import MyReservations from './ReservationComponents/MyReservations.vue';
import AgentChat from './AgentComponents/AgentChat.vue';

defineProps({
    // 'student' | 'teacher'
    role: { type: String, required: true },
});

const firstName = getStoredAuthResponse()?.names?.trim().split(/\s+/)[0] || '';
const tab = ref('catalog');
const selectedResource = ref(null);
const myReservationsRef = ref(null);
// Cambiar la key vuelve a montar "Mis reservas" y recarga los datos
const reservationsVersion = ref(0);

const refreshReservations = () => {
    reservationsVersion.value += 1;
};

const onCreated = () => {
    refreshReservations();
};
</script>

<template>
    <main class="min-h-[calc(100vh-4rem)] bg-[#f5f8f4] px-6 py-8 xl:px-20">
        <div class="mx-auto max-w-7xl space-y-6">
            <header>
                <p class="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                    {{ role === 'teacher' ? 'Profesor' : 'Estudiante' }}
                </p>
                <h1 class="mt-1! mb-0! text-4xl font-bold text-secondary md:text-5xl">
                    {{ firstName ? `Hola, ${firstName}` : 'Reservas' }}
                </h1>
                <p class="mt-2 text-lg text-slate-600">Reserva canchas, salas y equipos, o pídeselo a Resi.</p>
            </header>

            <nav class="flex gap-2" aria-label="Secciones">
                <button type="button" class="rounded-full px-5 py-2 font-bold transition"
                    :class="tab === 'catalog' ? 'bg-secondary text-white' : 'bg-white text-secondary hover:bg-[#e8f2e5]'"
                    @click="tab = 'catalog'">
                    Catálogo
                </button>
                <button type="button" class="rounded-full px-5 py-2 font-bold transition"
                    :class="tab === 'mine' ? 'bg-secondary text-white' : 'bg-white text-secondary hover:bg-[#e8f2e5]'"
                    @click="tab = 'mine'">
                    Mis reservas
                </button>
            </nav>

            <ResourceCatalog v-if="tab === 'catalog'" @reserve="selectedResource = $event" />
            <MyReservations v-else :key="reservationsVersion" ref="myReservationsRef" />
        </div>

        <ReservationModal v-if="selectedResource" :resource="selectedResource" @close="selectedResource = null"
            @created="onCreated" />

        <AgentChat @reservations-changed="refreshReservations" />
    </main>
</template>
