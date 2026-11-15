import { createRouter, createWebHistory } from 'vue-router';
import AboutUniReserva from './components/AboutUniReserva.vue';
import LoginView from './components/LoginView.vue';
import RegisterView from './components/RegisterView.vue';
import RoleSelectionView from './components/RoleSelectionView.vue';
import UserHomeView from './components/UserHomeView.vue';
import AdminMainView from './components/AdminMainView.vue';
import UserInformationView from './components/UserInformationView.vue';
import { clearActiveRole, getAvailableRoles, setActiveRole } from './services/roleService';
import { authService } from './services/authService';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: AboutUniReserva, meta: { layout: 'home' } },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/registro', name: 'register', component: RegisterView },
        { path: '/elegir-rol', name: 'role-selection', component: RoleSelectionView },
        { path: '/informacion-usuario', name: 'user-information', component: UserInformationView, meta: { layout: 'main', requiresAuth: true } },
        // Estudiante y profesor comparten la misma vista (catálogo + mis reservas + agente)
        { path: '/estudiante', name: 'student', component: UserHomeView, props: { role: 'student' }, meta: { layout: 'main', requiredRole: 'student' } },
        { path: '/profesor', name: 'teacher', component: UserHomeView, props: { role: 'teacher' }, meta: { layout: 'main', requiredRole: 'teacher' } },
        { path: '/admin', name: 'admin', component: AdminMainView, meta: { layout: 'main', requiredRole: 'admin' } },
        { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
    ],
});

router.beforeEach(async (to) => {
    if (to.name === 'login' && to.query.sessionCheck !== 'unavailable') {
        let authResponse;
        try {
            authResponse = await authService.validateSession(true);
        } catch (error) {
            if (!error.response || error.response.status >= 500) {
                return { name: 'login', query: { sessionCheck: 'unavailable' } };
            }
            throw error;
        }

        if (!authResponse) return true;

        const roles = getAvailableRoles(authResponse.roles);
        if (roles.length === 1) {
            setActiveRole(roles[0].id);
            return { name: roles[0].routeName };
        }
        if (roles.length > 1) {
            clearActiveRole();
            return { name: 'role-selection' };
        }
        return true;
    }

    const requiresSession = to.meta.requiresAuth || to.meta.requiredRole || to.name === 'role-selection';
    if (!requiresSession) return true;

    const authResponse = await authService.validateSession();
    if (!authResponse) return { name: 'login' };

    const roles = getAvailableRoles(authResponse.roles);
    if (to.meta.requiresAuth && !to.meta.requiredRole) {
        const activeRole = localStorage.getItem('activeRole');
        return roles.some((role) => role.id === activeRole) ? true : { name: 'role-selection' };
    }

    if (to.name === 'role-selection') {
        clearActiveRole();
        if (roles.length === 1) {
            setActiveRole(roles[0].id);
            return { name: roles[0].routeName };
        }
        return true;
    }

    const requestedRole = roles.find((role) => role.id === to.meta.requiredRole);
    if (!requestedRole) {
        return roles.length ? { name: 'role-selection' } : { name: 'login' };
    }

    setActiveRole(requestedRole.id);
    return true;
});

window.addEventListener('auth:unauthorized', () => {
    if (router.currentRoute.value.name !== 'login') {
        void router.replace({ name: 'login' });
    }
});

export default router;
