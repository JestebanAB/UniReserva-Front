<script setup>
import BrandLogo from './BrandLogo.vue';
</script>

<template>
    <footer class="bg-secondary text-white">
        <div class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between xl:px-20">
            <BrandLogo tone="light" />
            <p class="max-w-md text-sm text-white/75">
                Proyecto final de Fundamentos de Sistemas de Información · Universidad de Antioquia.
                Reserva de espacios y préstamo de equipos con un agente de IA.
            </p>
            <p class="text-sm font-semibold text-white/60">© 2026 UniReserva</p>
        </div>
    </footer>
</template>
