<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { resolveResourceImageUrl } from '../../api/axios';
import { adminService } from '../../services/adminService';
import { reservationService } from '../../services/reservationService';
import { getErrorMessage } from '../../services/apiErrorService';
import { formatClock, typeLabels } from '../../services/formatUtils';

const resources = ref([]);
const categories = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const form = ref(null); // null = formulario cerrado
const editingId = ref(null);
const isSaving = ref(false);
const selectedImage = ref(null);
const imagePreviewUrl = ref('');
const imageSelectionError = ref('');

const releaseImagePreview = () => {
    if (imagePreviewUrl.value.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = '';
};

const resetImageSelection = () => {
    releaseImagePreview();
    selectedImage.value = null;
    imageSelectionError.value = '';
};

const onImageSelected = (event) => {
    const image = event.target.files?.[0];
    if (!image) return;

    resetImageSelection();
    imagePreviewUrl.value = resolveResourceImageUrl(form.value?.imageUrl) || '';
    errorMessage.value = '';
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(image.type)) {
        imageSelectionError.value = 'Selecciona una imagen PNG, JPEG, GIF o WebP.';
        errorMessage.value = imageSelectionError.value;
        event.target.value = '';
        return;
    }
    if (image.size > 5 * 1024 * 1024) {
        imageSelectionError.value = 'La imagen no puede superar 5 MB.';
        errorMessage.value = imageSelectionError.value;
        event.target.value = '';
        return;
    }

    selectedImage.value = image;
    imagePreviewUrl.value = URL.createObjectURL(image);
};

const blankForm = () => ({
    categoryId: categories.value[0]?.id ?? '',
    name: '',
    description: '',
    resourceType: 'SPACE',
    location: '',
    capacity: null,
    quantity: 1,
    openTime: '07:00',
    closeTime: '20:00',
    maxDurationMinutes: 120,
    requiresApproval: false,
    state: 'AVAILABLE',
    imageUrl: '',
});

const load = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
        [resources.value, categories.value] = await Promise.all([
            adminService.getResources(),
            reservationService.getCategories(),
        ]);
    } catch (error) {
        if (error.response?.status === 401) return;
        errorMessage.value = getErrorMessage(error, 'No se pudieron cargar los recursos.');
    } finally {
        isLoading.value = false;
    }
};

const openCreate = () => {
    resetImageSelection();
    editingId.value = null;
    form.value = blankForm();
};

const openEdit = (resource) => {
    resetImageSelection();
    editingId.value = resource.id;
    imagePreviewUrl.value = resolveResourceImageUrl(resource.imageUrl) || '';
    form.value = {
        categoryId: resource.categoryId,
        name: resource.name,
        description: resource.description || '',
        resourceType: resource.resourceType,
        location: resource.location || '',
        capacity: resource.capacity,
        quantity: resource.quantity,
        openTime: String(resource.openTime).slice(0, 5),
        closeTime: String(resource.closeTime).slice(0, 5),
        maxDurationMinutes: resource.maxDurationMinutes,
        requiresApproval: resource.requiresApproval,
        state: resource.state,
        imageUrl: resource.imageUrl || '',
    };
};

const save = async () => {
    if (imageSelectionError.value) {
        errorMessage.value = imageSelectionError.value;
        return;
    }
    errorMessage.value = '';
    isSaving.value = true;
    let savedResource = null;
    try {
        const payload = {
            ...form.value,
            categoryId: Number(form.value.categoryId),
            capacity: form.value.capacity ? Number(form.value.capacity) : null,
            quantity: Number(form.value.quantity) || 1,
            maxDurationMinutes: Number(form.value.maxDurationMinutes),
            imageUrl: form.value.imageUrl || null,
        };
        savedResource = editingId.value
            ? await adminService.updateResource(editingId.value, payload)
            : await adminService.createResource(payload);
        editingId.value = savedResource.id;
        form.value.imageUrl = savedResource.imageUrl || '';
        if (selectedImage.value) {
            savedResource = await adminService.uploadResourceImage(savedResource.id, selectedImage.value);
            form.value.imageUrl = savedResource.imageUrl;
        }
        resetImageSelection();
        form.value = null;
        await load();
    } catch (error) {
        const fallback = savedResource && selectedImage.value
            ? 'El recurso se guardó, pero no se pudo subir la imagen. Puedes intentarlo de nuevo.'
            : 'No se pudo guardar el recurso.';
        errorMessage.value = getErrorMessage(error, fallback);
    } finally {
        isSaving.value = false;
    }
};

const stateLabels = { AVAILABLE: 'Disponible', MAINTENANCE: 'En mantenimiento', INACTIVE: 'Inactivo' };

onMounted(load);
onBeforeUnmount(releaseImagePreview);
</script>

<template>
    <section class="space-y-4">
        <div class="flex justify-end">
            <button type="button" :disabled="isSaving" class="rounded-xl bg-primary px-4 py-2 font-bold text-white hover:bg-secondary disabled:opacity-50" @click="openCreate">+ Nuevo recurso</button>
        </div>

        <p v-if="errorMessage" role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">{{ errorMessage }}</p>

        <form v-if="form" class="grid gap-3 rounded-2xl border border-[#dce9d9] bg-white p-5 md:grid-cols-2" @submit.prevent="save">
            <h2 class="md:col-span-2 text-secondary">{{ editingId ? 'Editar recurso' : 'Nuevo recurso' }}</h2>

            <label class="block"><span class="mb-1 block font-bold text-secondary">Nombre</span>
                <input v-model="form.name" required maxlength="120" class="field-input"></label>
            <label class="block"><span class="mb-1 block font-bold text-secondary">Categoría</span>
                <select v-model="form.categoryId" required class="field-input">
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select></label>

            <label class="block md:col-span-2"><span class="mb-1 block font-bold text-secondary">Descripción</span>
                <input v-model="form.description" class="field-input"></label>

            <div class="space-y-2 md:col-span-2">
                <label class="block">
                    <span class="mb-1 block font-bold text-secondary">Imagen del recurso</span>
                    <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" class="field-input"
                        @change="onImageSelected">
                    <span class="mt-1 block text-sm text-slate-500">PNG, JPEG, GIF o WebP; máximo 5 MB.</span>
                </label>
                <img v-if="imagePreviewUrl" :src="imagePreviewUrl" :alt="`Vista previa de ${form.name || 'la imagen del recurso'}`"
                    class="h-48 w-full rounded-xl border border-slate-200 object-cover sm:w-80">
            </div>

            <label class="block"><span class="mb-1 block font-bold text-secondary">Tipo</span>
                <select v-model="form.resourceType" class="field-input">
                    <option value="SPACE">Espacio (por horario)</option>
                    <option value="EQUIPMENT">Equipo (por unidades)</option>
                </select></label>
            <label class="block"><span class="mb-1 block font-bold text-secondary">Ubicación</span>
                <input v-model="form.location" maxlength="160" class="field-input"></label>

            <label v-if="form.resourceType === 'SPACE'" class="block"><span class="mb-1 block font-bold text-secondary">Capacidad (personas)</span>
                <input v-model="form.capacity" type="number" min="1" class="field-input"></label>
            <label v-else class="block"><span class="mb-1 block font-bold text-secondary">Unidades</span>
                <input v-model="form.quantity" type="number" min="1" class="field-input"></label>
            <label class="block"><span class="mb-1 block font-bold text-secondary">Duración máxima (min)</span>
                <input v-model="form.maxDurationMinutes" type="number" min="15" step="15" required class="field-input"></label>

            <label class="block"><span class="mb-1 block font-bold text-secondary">Apertura</span>
                <input v-model="form.openTime" type="time" required class="field-input"></label>
            <label class="block"><span class="mb-1 block font-bold text-secondary">Cierre</span>
                <input v-model="form.closeTime" type="time" required class="field-input"></label>

            <label class="block"><span class="mb-1 block font-bold text-secondary">Estado</span>
                <select v-model="form.state" class="field-input">
                    <option v-for="(label, key) in stateLabels" :key="key" :value="key">{{ label }}</option>
                </select></label>
            <label class="flex items-center gap-2 pt-7"><input v-model="form.requiresApproval" type="checkbox" class="h-4 w-4 accent-primary">
                <span class="font-bold text-secondary">Requiere aprobación</span></label>

            <div class="flex gap-2 md:col-span-2">
                <button type="submit" :disabled="isSaving" class="rounded-xl bg-primary px-5 py-2 font-bold text-white hover:bg-secondary disabled:opacity-50">
                    {{ isSaving ? 'Guardando...' : 'Guardar' }}
                </button>
                <button type="button" :disabled="isSaving" class="rounded-xl border border-slate-300 px-5 py-2 font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50" @click="resetImageSelection(); form = null">Cancelar</button>
            </div>
        </form>

        <p v-if="isLoading" class="text-slate-500">Cargando...</p>
        <ul v-else class="space-y-3">
            <li v-for="resource in resources" :key="resource.id"
                class="flex flex-col gap-2 rounded-2xl border border-[#dce9d9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p class="text-lg font-bold text-secondary">{{ resource.name }}
                        <span class="ml-2 text-xs font-bold uppercase text-slate-400">{{ typeLabels[resource.resourceType] }}</span></p>
                    <p class="text-sm text-slate-600">
                        {{ resource.categoryName }} · {{ formatClock(resource.openTime) }} – {{ formatClock(resource.closeTime) }}
                        · {{ resource.resourceType === 'SPACE' ? `${resource.capacity ?? '—'} personas` : `${resource.quantity} unidades` }}
                        · {{ stateLabels[resource.state] }}
                    </p>
                </div>
                <button type="button" :disabled="isSaving" class="rounded-lg border border-primary px-3 py-1.5 text-sm font-bold text-secondary hover:bg-primary hover:text-white disabled:opacity-50" @click="openEdit(resource)">Editar</button>
            </li>
        </ul>
    </section>
</template>
