<script setup>
import { getStoredAuthResponse } from '../services/roleService';

const session = getStoredAuthResponse();
</script>

<template>
    <main class="min-h-[calc(100vh-4rem)] bg-[#f5f8f4] px-6 py-8 xl:px-20">
        <div class="mx-auto max-w-7xl space-y-6">
            <header>
                <p class="text-sm font-bold uppercase tracking-[0.18em] text-primary">UniReserva</p>
                <h1 class="mt-1! mb-0! text-4xl font-bold text-secondary md:text-5xl">Tu perfil</h1>
            </header>
            <section v-if="session" class="max-w-xl space-y-2 rounded-2xl bg-white p-6 shadow-sm">
                <p><span class="font-bold text-secondary">Nombre:</span> {{ session.names }}</p>
                <p><span class="font-bold text-secondary">Correo:</span> {{ session.email }}</p>
                <p v-if="session.nickname"><span class="font-bold text-secondary">Usuario:</span> {{ session.nickname }}</p>
                <p><span class="font-bold text-secondary">Roles:</span> {{ (session.roles || []).join(', ') }}</p>
            </section>
        </div>
    </main>
</template>
