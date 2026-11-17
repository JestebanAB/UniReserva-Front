<script setup>
// La foto de portada se busca en public/images/hero/portada.jpg.
// Si el archivo no existe, se ve el degradado verde (no rompe nada).
const steps = [
    { title: 'Busca', text: 'Explora canchas, salas de estudio, auditorios y los juegos de la ludoteca en un solo catálogo.' },
    { title: 'Reserva', text: 'Elige día y hora con la disponibilidad real, sin cruces ni dobles reservas.' },
    { title: 'Conversa', text: 'O dile a Resi, nuestro asistente de IA: «Quiero una cancha de tenis mañana a las 3 p. m.».' },
];

const spaces = [
    { title: 'Canchas deportivas', text: 'Tenis y más, con horarios por franjas.', image: '/images/sections/canchas.jpg' },
    { title: 'Salas de estudio', text: 'Espacios para trabajo en grupo.', image: '/images/sections/salas.jpg' },
    { title: 'Ludoteca', text: 'Presta juegos de mesa por unidades.', image: '/images/sections/ludoteca.jpg' },
    { title: 'Auditorios', text: 'Eventos con aprobación de un administrador.', image: '/images/sections/auditorio.jpg' },
];
</script>

<template>
    <main>
        <!-- Portada -->
        <section class="relative flex min-h-[28rem] items-end bg-cover bg-center md:min-h-[34rem]"
            style="background-image: url('/images/hero/portada.jpg'), linear-gradient(135deg, #1f7d3a, #104a25);">
            <div class="mx-auto w-full max-w-7xl px-6 xl:px-20">
                <div class="max-w-2xl rounded-t-xl bg-white/90 p-8 backdrop-blur md:p-10">
                    <h1 class="mt-0! mb-3! text-5xl font-extrabold leading-none text-[#111] md:text-6xl">Reserva de espacios</h1>
                    <p class="mb-5 text-lg text-slate-700">
                        Canchas, salas de estudio, auditorios y la ludoteca de la universidad, desde la web o conversando con un asistente de IA.
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <RouterLink :to="{ name: 'register' }"
                            class="rounded-lg bg-primary px-6 py-3 font-bold text-white transition hover:bg-secondary">
                            Crear cuenta
                        </RouterLink>
                        <RouterLink :to="{ name: 'login' }"
                            class="rounded-lg border-2 border-[#111] px-6 py-3 font-bold text-[#111] transition hover:bg-[#111] hover:text-white">
                            Iniciar sesión
                        </RouterLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Qué se puede reservar -->
        <section class="mx-auto max-w-7xl px-6 py-14 xl:px-20">
            <h2 class="mb-8 max-w-3xl text-3xl font-extrabold leading-tight text-[#111]">
                Elige el espacio que se adapte a tus necesidades, selecciona el horario y reserva en un clic
            </h2>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <article v-for="space in spaces" :key="space.title" class="overflow-hidden rounded-xl bg-secondary text-white shadow-md">
                    <div class="h-40 bg-cover bg-center"
                        :style="{ backgroundImage: `url('${space.image}'), linear-gradient(135deg, #1f7d3a, #104a25)` }" />
                    <div class="p-5">
                        <h3 class="mb-1 text-xl font-extrabold">{{ space.title }}</h3>
                        <p class="text-[15px] text-white/90">{{ space.text }}</p>
                    </div>
                </article>
            </div>
        </section>

        <!-- Cómo funciona -->
        <section class="bg-[#f3f6f2] px-6 py-14 xl:px-20">
            <div class="mx-auto max-w-7xl">
                <h2 class="mb-8 text-3xl font-extrabold text-[#111]">¿Cómo funciona?</h2>
                <div class="grid gap-6 md:grid-cols-3">
                    <article v-for="(step, index) in steps" :key="step.title" class="rounded-xl bg-white p-6 shadow-sm">
                        <span class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">{{ index + 1 }}</span>
                        <h3 class="mb-1 text-xl font-bold text-[#111]">{{ step.title }}</h3>
                        <p class="text-slate-600">{{ step.text }}</p>
                    </article>
                </div>
            </div>
        </section>
    </main>
</template>
