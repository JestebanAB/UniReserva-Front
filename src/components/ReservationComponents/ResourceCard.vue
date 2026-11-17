<script setup>
import { computed } from 'vue';
import { formatClock, typeLabels } from '../../services/formatUtils';

const props = defineProps({
    resource: { type: Object, required: true },
});
defineEmits(['reserve']);

// imageUrl viene de la BD (ej. "/images/resources/cancha-tenis-1.jpg"); si no hay, se muestra un fondo verde con ícono
const hasImage = computed(() => Boolean(props.resource.imageUrl));
const fallbackIcon = computed(() => (props.resource.resourceType === 'EQUIPMENT' ? '🎲' : '🏟️'));
</script>

<template>
    <article class="grid overflow-hidden rounded-xl bg-secondary text-white shadow-md sm:grid-cols-2">
        <div class="relative min-h-52 bg-linear-to-br from-tertiary to-[#104a25]">
            <img v-if="hasImage" :src="resource.imageUrl" :alt="resource.name" loading="lazy"
                class="absolute inset-0 h-full w-full object-cover">
            <span v-else class="absolute inset-0 flex items-center justify-center text-6xl opacity-70" aria-hidden="true">
                {{ fallbackIcon }}
            </span>
        </div>

        <div class="flex flex-col justify-between gap-4 p-6">
            <div>
                <p class="mb-1 text-xs font-bold uppercase tracking-wider text-white/70">
                    {{ resource.categoryName }} · {{ typeLabels[resource.resourceType] }}
                </p>
                <h3 class="text-2xl font-extrabold leading-tight">{{ resource.name }}</h3>
                <p v-if="resource.description" class="mt-2 text-[15px] text-white/90">{{ resource.description }}</p>

                <dl class="mt-3 space-y-1 text-[15px] text-white/90">
                    <div v-if="resource.resourceType === 'SPACE' && resource.capacity">
                        <dt class="inline font-bold">Capacidad: </dt><dd class="inline">hasta {{ resource.capacity }} personas</dd>
                    </div>
                    <div v-if="resource.resourceType === 'EQUIPMENT'">
                        <dt class="inline font-bold">Disponibles: </dt><dd class="inline">{{ resource.quantity }} unidades</dd>
                    </div>
                    <div v-if="resource.location">
                        <dt class="inline font-bold">Ubicación: </dt><dd class="inline">{{ resource.location }}</dd>
                    </div>
                    <div>
                        <dt class="inline font-bold">Horario: </dt>
                        <dd class="inline">{{ formatClock(resource.openTime) }} – {{ formatClock(resource.closeTime) }} (máx. {{ resource.maxDurationMinutes }} min)</dd>
                    </div>
                </dl>
                <p v-if="resource.requiresApproval" class="mt-3 inline-block rounded bg-amber-300 px-2 py-1 text-xs font-bold text-amber-950">
                    Requiere aprobación
                </p>
            </div>

            <button type="button"
                class="w-full rounded-lg bg-white px-4 py-3 font-bold text-[#111] transition hover:bg-[#e8f2e5]"
                @click="$emit('reserve', resource)">
                Reserva aquí
            </button>
        </div>
    </article>
</template>
