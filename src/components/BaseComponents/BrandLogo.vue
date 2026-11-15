<script setup>
defineProps({
    // 'dark' = texto verde (fondos claros) | 'light' = texto blanco (fondos oscuros)
    tone: { type: String, default: 'dark' },
    compact: { type: Boolean, default: false },
});
</script>

<template>
    <span class="inline-flex items-center gap-2 select-none">
        <svg viewBox="0 0 64 64" class="h-9 w-9 shrink-0" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="#175F2C" />
            <rect x="12" y="16" width="40" height="36" rx="6" fill="#fff" />
            <rect x="12" y="16" width="40" height="11" rx="6" fill="#44A13A" />
            <rect x="20" y="10" width="5" height="12" rx="2.5" fill="#fff" />
            <rect x="39" y="10" width="5" height="12" rx="2.5" fill="#fff" />
            <path d="M22 41l7 7 14-15" fill="none" stroke="#175F2C" stroke-width="5" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
        <span v-if="!compact" class="text-2xl font-extrabold tracking-tight"
            :class="tone === 'light' ? 'text-white' : 'text-secondary'">
            Uni<span :class="tone === 'light' ? 'text-white/80' : 'text-primary'">Reserva</span>
        </span>
    </span>
</template>
