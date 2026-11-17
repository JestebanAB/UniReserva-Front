<script setup>
import BrandLogo from './BrandLogo.vue';
</script>

<template>
    <header class="sticky top-0 z-50 w-full bg-[#111] shadow-md">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 xl:px-20">
            <RouterLink :to="{ name: 'home' }" aria-label="Ir al inicio de UniReserva">
                <BrandLogo tone="light" />
            </RouterLink>
            <nav class="flex items-center gap-2">
                <RouterLink :to="{ name: 'login' }"
                    class="rounded-lg border border-white/70 px-4 py-2 font-bold text-white transition hover:bg-white hover:text-[#111]">
                    Iniciar sesión
                </RouterLink>
                <RouterLink :to="{ name: 'register' }"
                    class="hidden rounded-lg bg-primary px-4 py-2 font-bold text-white transition hover:bg-tertiary sm:inline-block">
                    Crear cuenta
                </RouterLink>
            </nav>
        </div>
    </header>
</template>
