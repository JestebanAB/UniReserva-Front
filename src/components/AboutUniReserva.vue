<script setup>
const steps = [
    { title: 'Busca', text: 'Explora canchas, salas de estudio, auditorios y los juegos de la ludoteca en un solo catálogo.' },
    { title: 'Reserva', text: 'Elige día y hora con la disponibilidad real, sin cruces ni dobles reservas.' },
    { title: 'Conversa', text: 'O dile a Resi, nuestro asistente de IA: «Quiero una cancha de tenis mañana a las 3 p. m.».' },
];

const benefits = [
    { title: 'Todo centralizado', text: 'Un solo lugar para espacios y préstamos que hoy se gestionan por separado.' },
    { title: 'Disponibilidad en tiempo real', text: 'Cada reserva pasa por las mismas reglas: horarios, cupos y duración máxima.' },
    { title: 'Aprobación cuando se necesita', text: 'Los espacios sensibles, como el auditorio, quedan pendientes hasta que un administrador los apruebe.' },
];
</script>

<template>
    <main>
        <section class="bg-linear-to-br from-tertiary via-secondary to-[#104a25] px-6 py-20 text-white xl:px-20">
            <div class="mx-auto max-w-5xl text-center">
                <p class="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/75">Reservas universitarias con IA</p>
                <h1 class="mt-0! mb-4! text-5xl font-extrabold leading-tight md:text-6xl">
                    Reserva espacios y equipos<br>sin filas ni papeleo
                </h1>
                <p class="mx-auto max-w-2xl text-xl text-white/85">
                    Canchas de tenis, salas de estudio, auditorios y la ludoteca, desde la web o conversando con un asistente inteligente.
                </p>
                <div class="mt-8 flex flex-wrap justify-center gap-3">
                    <RouterLink :to="{ name: 'register' }"
                        class="rounded-xl bg-white px-6 py-3 text-lg font-bold text-secondary shadow-lg transition hover:-translate-y-0.5">
                        Crear cuenta
                    </RouterLink>
                    <RouterLink :to="{ name: 'login' }"
                        class="rounded-xl border-2 border-white/70 px-6 py-3 text-lg font-bold text-white transition hover:bg-white/10">
                        Iniciar sesión
                    </RouterLink>
                </div>
            </div>
        </section>

        <section class="mx-auto max-w-6xl px-6 py-16 xl:px-20">
            <h2 class="mb-8 text-center text-3xl text-secondary">¿Cómo funciona?</h2>
            <div class="grid gap-6 md:grid-cols-3">
                <article v-for="(step, index) in steps" :key="step.title" class="rounded-2xl bg-white p-6 shadow-sm">
                    <span class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                        {{ index + 1 }}
                    </span>
                    <h3 class="mb-1 text-xl font-bold text-secondary">{{ step.title }}</h3>
                    <p class="text-slate-600">{{ step.text }}</p>
                </article>
            </div>
        </section>

        <section class="bg-white px-6 py-16 xl:px-20">
            <div class="mx-auto max-w-6xl">
                <h2 class="mb-8 text-center text-3xl text-secondary">Por qué UniReserva</h2>
                <div class="grid gap-6 md:grid-cols-3">
                    <article v-for="benefit in benefits" :key="benefit.title" class="rounded-2xl border border-[#dce9d9] bg-[#fbfdfb] p-6">
                        <h3 class="mb-1 text-xl font-bold text-secondary">{{ benefit.title }}</h3>
                        <p class="text-slate-600">{{ benefit.text }}</p>
                    </article>
                </div>
            </div>
        </section>
    </main>
</template>
