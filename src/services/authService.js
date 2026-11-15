import api from "../api/axios";
import { clearStoredAuthState, getStoredAuthResponse } from "./roleService";

let validatedSession = null;
const csrfHeader = 'X-XSRF-TOKEN';

const clearSession = () => {
    validatedSession = null;
    delete api.defaults.headers.common[csrfHeader];
    clearStoredAuthState();
};

const refreshCsrfToken = async () => {
    const { data } = await api.get('auth/csrf');
    api.defaults.headers.common[csrfHeader] = data.token;
};

const storeSession = (session) => {
    localStorage.setItem('authResponse', JSON.stringify(session));
    validatedSession = session;
    return session;
};

export const authService = {
    async login(loginData) {
        clearSession();
        await refreshCsrfToken();
        const { data: loginResponse } = await api.post('auth/login', loginData);
        return storeSession(loginResponse);
    },

    async logout() {
        await refreshCsrfToken();
        await api.post('auth/logout');
        clearSession();
    },

    async validateSession(forceValidation = false) {
        if (!forceValidation && validatedSession && getStoredAuthResponse()) return validatedSession;
        validatedSession = null;

        try {
            await refreshCsrfToken();
            const { data: sessionResponse } = await api.get('auth/me');
            return storeSession(sessionResponse);
        } catch (error) {
            if (error.response?.status === 401) {
                clearSession();
                return null;
            }
            throw error;
        }
    },

    async register(registerData) {
        await refreshCsrfToken();
        const { data: registerResponse } = await api.post('auth/register', registerData);
        return registerResponse;
    }
}