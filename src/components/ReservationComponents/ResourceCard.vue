<script setup>
import { formatClock, typeLabels } from '../../services/formatUtils';

defineProps({
    resource: { type: Object, required: true },
});
defineEmits(['reserve']);
</script>

<template>
    <article class="flex flex-col justify-between rounded-2xl border border-[#dce9d9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div>
            <div class="mb-2 flex items-center justify-between gap-2">
                <span class="rounded-full bg-[#e8f2e5] px-3 py-1 text-xs font-bold text-secondary">{{ resource.categoryName }}</span>
                <span class="text-xs font-bold uppercase tracking-wide text-slate-400">{{ typeLabels[resource.resourceType] }}</span>
            </div>
            <h3 class="text-xl font-bold text-secondary">{{ resource.name }}</h3>
            <p v-if="resource.description" class="mt-1 text-sm text-slate-600">{{ resource.description }}</p>

            <ul class="mt-3 space-y-1 text-sm text-slate-600">
                <li v-if="resource.location">📍 {{ resource.location }}</li>
                <li>🕒 {{ formatClock(resource.openTime) }} – {{ formatClock(resource.closeTime) }} · máx. {{ resource.maxDurationMinutes }} min</li>
                <li v-if="resource.resourceType === 'SPACE' && resource.capacity">👥 Hasta {{ resource.capacity }} personas</li>
                <li v-if="resource.resourceType === 'EQUIPMENT'">📦 {{ resource.quantity }} unidades</li>
                <li v-if="resource.requiresApproval" class="font-semibold text-amber-700">Requiere aprobación de un administrador</li>
            </ul>
        </div>

        <button type="button"
            class="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 font-bold text-white transition hover:bg-secondary"
            @click="$emit('reserve', resource)">
            Reservar
        </button>
    </article>
</template>
