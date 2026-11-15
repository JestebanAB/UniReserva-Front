<script setup>
import { nextTick, ref } from 'vue';
import { agentService } from '../../services/agentService';
import { getErrorMessage } from '../../services/apiErrorService';

const emit = defineEmits(['reservations-changed']);

const isOpen = ref(false);
const input = ref('');
const isThinking = ref(false);
const errorMessage = ref('');
const listRef = ref(null);

const welcome = '¡Hola! Soy Resi 👋 Puedo buscar espacios y equipos, ver su disponibilidad y hacer o cancelar tus reservas. ¿Qué necesitas?';
// El historial que se envía al backend NO incluye el saludo (es solo decorativo)
const messages = ref([{ role: 'assistant', content: welcome, local: true }]);

const suggestions = [
    'Quiero una cancha de tenis mañana a las 3 p. m.',
    '¿Qué juegos hay en la ludoteca?',
    '¿Cuáles son mis reservas?',
];

const scrollToBottom = async () => {
    await nextTick();
    if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight;
};

const send = async (text) => {
    const content = (text ?? input.value).trim();
    if (!content || isThinking.value) return;

    errorMessage.value = '';
    input.value = '';
    messages.value.push({ role: 'user', content });
    isThinking.value = true;
    scrollToBottom();

    try {
        const history = messages.value
            .filter((message) => !message.local)
            .map(({ role, content: body }) => ({ role, content: body }));
        const response = await agentService.chat(history);
        messages.value.push({ role: 'assistant', content: response.reply });
        if (response.reservationsChanged) emit('reservations-changed');
    } catch (error) {
        if (error.response?.status === 401) return;
        errorMessage.value = getErrorMessage(error, 'Resi no pudo responder. Inténtalo de nuevo.');
    } finally {
        isThinking.value = false;
        scrollToBottom();
    }
};

const reset = () => {
    messages.value = [{ role: 'assistant', content: welcome, local: true }];
    errorMessage.value = '';
};
</script>

<template>
    <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        <section v-if="isOpen"
            class="flex h-[32rem] max-h-[75vh] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[#dce9d9] bg-white shadow-2xl"
            aria-label="Chat con Resi, asistente de reservas">
            <header class="flex items-center justify-between bg-secondary px-4 py-3 text-white">
                <div>
                    <p class="font-bold leading-tight">Resi</p>
                    <p class="text-xs text-white/75">Asistente de reservas con IA</p>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" class="rounded px-2 py-1 text-xs font-bold text-white/80 hover:bg-white/10" @click="reset">Nuevo chat</button>
                    <button type="button" class="text-xl leading-none" aria-label="Cerrar chat" @click="isOpen = false">×</button>
                </div>
            </header>

            <div ref="listRef" class="flex-1 space-y-3 overflow-y-auto bg-[#f7faf6] p-4">
                <div v-for="(message, index) in messages" :key="index" class="flex"
                    :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                    <p class="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[15px] leading-snug"
                        :class="message.role === 'user' ? 'bg-primary text-white' : 'bg-white text-slate-800 shadow-sm'">{{ message.content }}</p>
                </div>

                <div v-if="messages.length === 1" class="flex flex-wrap gap-2">
                    <button v-for="suggestion in suggestions" :key="suggestion" type="button"
                        class="rounded-full border border-primary px-3 py-1 text-left text-sm text-secondary transition hover:bg-primary hover:text-white"
                        @click="send(suggestion)">
                        {{ suggestion }}
                    </button>
                </div>

                <p v-if="isThinking" class="text-sm italic text-slate-500">Resi está pensando...</p>
                <p v-if="errorMessage" role="alert" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{{ errorMessage }}</p>
            </div>

            <form class="flex gap-2 border-t border-[#dce9d9] bg-white p-3" @submit.prevent="send()">
                <input v-model="input" type="text" maxlength="2000" placeholder="Escribe tu mensaje..." class="field-input" :disabled="isThinking"
                    aria-label="Mensaje para Resi">
                <button type="submit" :disabled="isThinking || !input.trim()"
                    class="rounded-xl bg-primary px-4 font-bold text-white transition hover:bg-secondary disabled:opacity-50">
                    ➤
                </button>
            </form>
        </section>

        <button type="button"
            class="flex h-14 items-center gap-2 rounded-full bg-primary px-5 font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-secondary"
            :aria-expanded="isOpen" @click="isOpen = !isOpen">
            <span class="text-xl" aria-hidden="true">🤖</span>
            <span>{{ isOpen ? 'Cerrar' : 'Pregúntale a Resi' }}</span>
        </button>
    </div>
</template>
