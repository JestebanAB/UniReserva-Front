<script setup>
import BrandLogo from './BrandLogo.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAvailableRoles, getStoredAuthResponse, getActiveRole } from '../../services/roleService';
import { authService } from '../../services/authService';

const router = useRouter();
const menuIsOpen = ref(false);
const menuUserIsOpen = ref(false);
const logoutError = ref('');
const canSwitchRoles = getAvailableRoles(getStoredAuthResponse()?.roles).length > 1;
const authResponse = getStoredAuthResponse();
const nickname = authResponse?.nickname || '';
const firstName = authResponse?.names?.trim().split(/\s+/)[0] || '';
const homeRouteName = getActiveRole()?.routeName || 'role-selection';

const toggleMenu = () => {
    menuIsOpen.value = !menuIsOpen.value;
    menuUserIsOpen.value = false;
};

const toggleMenuUser = () => {
    menuUserIsOpen.value = !menuUserIsOpen.value;
};

const closeMenus = () => {
    menuIsOpen.value = false;
    menuUserIsOpen.value = false;
};

const logout = async () => {
    logoutError.value = '';
    try {
        await authService.logout();
        closeMenus();
        await router.replace({ name: 'login' });
    } catch {
        logoutError.value = 'No se pudo cerrar la sesión con el servidor. Inténtalo de nuevo.';
    }
};
</script>

<template>
    <header class="sticky top-0 z-50 w-full shadow-xl">
        <p v-if="logoutError" role="alert" class="bg-red-100 px-4 py-2 text-center text-sm text-red-900">
            {{ logoutError }}
        </p>
        <!-- Logo y navegación -->
        <div class="py-2 px-6 xl:px-20 flex items-center w-full justify-between bg-white">
            <RouterLink :to="{ name: homeRouteName}" aria-label="Ir al inicio de UniReserva" class="inline-flex">
                <BrandLogo />
            </RouterLink>
            <!-- Responsive -->
            <div class="md:hidden flex items-center gap-4">
                <div @click="toggleMenu" class="text-primary" style="opacity:1;transform:none">
                    <Transition mode="out-in" enter-active-class="transition ease-out duration-150"
                        enter-from-class="opacity-0 scale-75 rotate-45" enter-to-class="opacity-100 scale-100 rotate-0"
                        leave-active-class="transition ease-in duration-100"
                        leave-from-class="opacity-100 scale-100 rotate-0"
                        leave-to-class="opacity-0 scale-75 -rotate-45">
                        <a v-if="!menuIsOpen" key="menu-icon" class="cursor-pointer lg:hidden">
                            <icon-bi-list width="30" height="30" />
                        </a>
                        <a v-else="menuIsOpen" key="close-icon" class="cursor-pointer lg:hidden">
                            <icon-bi-x width="30" height="30" />
                        </a>
                    </Transition>
                </div>
            </div>
            <!-- Nav Base -->
            <div class="hidden items-center gap-2 md:flex">
                <RouterLink v-if="canSwitchRoles" :to="{ name: 'role-selection' }"
                    class="rounded-lg border border-primary px-4 py-2 font-bold text-primary transition hover:bg-primary hover:text-white">
                    Cambiar de rol
                </RouterLink>
                <div class="relative">
                    <button type="button" :aria-expanded="menuUserIsOpen" aria-haspopup="true" @click="toggleMenuUser"
                        :class="menuUserIsOpen ? 'bg-primary text-white' : 'bg-secondary text-white'"
                        class="flex items-center justify-center gap-2 rounded-lg  px-4 py-2 font-bold text-white transition-colors hover:bg-primary">
                        <icon-bi-person-circle width="20" height="20" />
                        {{ nickname || firstName || 'Usuario' }}
                        <icon-bi-chevron-compact-up v-if="menuUserIsOpen" width="15" height="15" />
                        <icon-bi-chevron-compact-down v-else width="15" height="15" />
                    </button>
                    <Transition enter-active-class="transition ease-out duration-150"
                        enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition ease-in duration-100"
                        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                        <div v-if="menuUserIsOpen"
                            class="absolute right-0 z-50 mt-2 flex w-48 flex-col gap-2 rounded-xl bg-primary p-3 shadow-xl">
                            <RouterLink :to="{ name: 'user-information' }"
                                class="rounded-lg bg-secondary px-3 py-2 text-center text-sm font-bold text-white transition-colors hover:bg-tertiary"
                                @click="closeMenus">
                                Mi perfil
                            </RouterLink>
                            <button type="button"
                                class="rounded-lg bg-white px-3 py-2 text-sm font-bold text-secondary transition-colors hover:bg-tertiary hover:text-white"
                                @click="logout">
                                Cerrar sesión
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
        <!-- Nav Responsive-->
        <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
            <div v-if="menuIsOpen" class="md:hidden absolute transition left-0 z-50 flex flex-col justify-center gap-4 w-full px-6 overflow-visible 
                    bg-primary shadow-xl py-4">
                <nav class="flex flex-wrap items-center gap-2">
                    <button type="button" :aria-expanded="menuUserIsOpen" aria-haspopup="true" @click="toggleMenuUser"
                        :class="menuUserIsOpen ? 'bg-tertiary text-white' : 'bg-white text-primary'"
                        class="w-full flex items-center justify-center gap-2 rounded-lg border-primary  px-4 py-2 font-bold text-primary transition hover:bg-primary hover:text-white">
                        <icon-bi-person-circle width="20" height="20" />
                        {{ nickname || firstName || 'Usuario' }}
                        <icon-bi-chevron-compact-up v-if="menuUserIsOpen" width="15" height="15" />
                        <icon-bi-chevron-compact-down v-else width="15" height="15" />
                    </button>
                    <div v-if="menuUserIsOpen" class="w-full flex gap-2">
                        <RouterLink :to="{ name: 'user-information' }"
                            class="w-full flex items-center justify-center rounded-lg bg-secondary px-3 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-secondary"
                            @click="closeMenus">
                            Mi perfil
                        </RouterLink>
                        <button type="button"
                            class="w-full rounded-lg bg-white px-3 py-3 text-sm font-bold text-secondary transition-colors hover:bg-secondary hover:text-white"
                            @click="logout">
                            Cerrar sesión
                        </button>
                    </div>
                    <RouterLink v-if="canSwitchRoles" :to="{ name: 'role-selection' }"
                        class="flex items-center justify-center gap-2 md:px-6 leading-5.5 
                                cursor-pointer w-full rounded-lg bg-secondary px-3 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-secondary"
                        @click="closeMenus">
                        Cambiar rol
                    </RouterLink>
                </nav>
            </div>
        </Transition>
    </header>
</template>

<style scoped></style>