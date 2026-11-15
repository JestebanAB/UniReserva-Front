import api from '../api/axios';

export const agentService = {
    // messages: [{ role: 'user' | 'assistant', content: string }] (historial completo; el último es del usuario)
    // Devuelve { reply, toolsUsed, reservationsChanged }
    async chat(messages) {
        const { data } = await api.post('api/agent/chat', { messages }, { timeout: 60000 });
        return data;
    },
};
