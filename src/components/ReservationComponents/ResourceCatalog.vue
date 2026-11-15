<script setup>
import { onMounted, ref, watch } from 'vue';
import { reservationService } from '../../services/reservationService';
import { getErrorMessage } from '../../services/apiErrorService';
import ResourceCard from './ResourceCard.vue';

defineEmits(['reserve']);

const categories = ref([]);
const resources = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const filters = ref({ q: '', categoryId: '', type: '' });

let debounceId = null;

const loadResources = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
        resources.value = await reservationService.getResources(filters.value);
    } catch (error) {
        if (error.response?.status === 401) return;
        errorMessage.value = getErrorMessage(error, 'No se pudo cargar el catálogo.');
    } finally {
        isLoading.value = false;
    }
};

watch(filters, () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(loadResources, 300);
}, { deep: true });

onMounted(async () => {
    try {
        categories.value = await reservationService.getCategories();
    } catch {
        // el catálogo igual se puede usar sin el filtro de categorías
    }
    await loadResources();
});
</script>

<template>
    <section>
        <div class="mb-6 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
            <input v-model="filters.q" type="search" placeholder="Buscar: tenis, ajedrez, sala..." class="field-input"
                aria-label="Buscar recursos">
            <select v-model="filters.categoryId" class="field-input" aria-label="Categoría">
                <option value="">Todas las categorías</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
            <select v-model="filters.type" class="field-input" aria-label="Tipo">
                <option value="">Espacios y equipos</option>
                <option value="SPACE">Solo espacios</option>
                <option value="EQUIPMENT">Solo equipos</option>
            </select>
        </div>

        <p v-if="errorMessage" role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">{{ errorMessage }}</p>
        <p v-else-if="isLoading" class="text-slate-500">Cargando catálogo...</p>
        <p v-else-if="!resources.length" class="rounded-xl bg-white px-4 py-6 text-center text-slate-500">
            No encontramos recursos con esos filtros.
        </p>

        <div v-else class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <ResourceCard v-for="resource in resources" :key="resource.id" :resource="resource"
                @reserve="$emit('reserve', $event)" />
        </div>
    </section>
</template>
