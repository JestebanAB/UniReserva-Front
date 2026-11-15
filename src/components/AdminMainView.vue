<script setup>
import { ref } from 'vue';
import AdminReservations from './AdminComponents/AdminReservations.vue';
import AdminResources from './AdminComponents/AdminResources.vue';

const tab = ref('reservations');
</script>

<template>
    <main class="min-h-[calc(100vh-4rem)] bg-[#f5f8f4] px-6 py-8 xl:px-20">
        <div class="mx-auto max-w-7xl space-y-6">
            <header>
                <p class="text-sm font-bold uppercase tracking-[0.18em] text-primary">Administrador</p>
                <h1 class="mt-1! mb-0! text-4xl font-bold text-secondary md:text-5xl">Panel de administración</h1>
            </header>

            <nav class="flex gap-2" aria-label="Secciones">
                <button type="button" class="rounded-full px-5 py-2 font-bold transition"
                    :class="tab === 'reservations' ? 'bg-secondary text-white' : 'bg-white text-secondary hover:bg-[#e8f2e5]'"
                    @click="tab = 'reservations'">Reservas</button>
                <button type="button" class="rounded-full px-5 py-2 font-bold transition"
                    :class="tab === 'resources' ? 'bg-secondary text-white' : 'bg-white text-secondary hover:bg-[#e8f2e5]'"
                    @click="tab = 'resources'">Recursos</button>
            </nav>

            <AdminReservations v-if="tab === 'reservations'" />
            <AdminResources v-else />
        </div>
    </main>
</template>
