<template>
    <v-app-bar :order="order" flat max-height="60px" class="mb-4">
        <v-spacer v-if="!smAndDown" style="max-width: 200px"></v-spacer>
        <v-toolbar-title style="max-width: fit-content; cursor: pointer" @click="$router.push('/')">
            <div class="d-flex align-center" :class="smAndDown ? '': 'mr-8'" to="/">
                <icon-base iconName="not-ary" height="32" width="32" viewBox="0 0 64 64">
                    <icon-not-ary></icon-not-ary>
                </icon-base>
                <div class="font-italic font-weight-light">Not-Ary.com</div>
            </div>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn variant="plain" icon size="small" id="theme" @click="$emit('theme')">
            <v-icon color="primary-lighten-3" :icon="store.theme === 'light' ? 'light_mode' : 'dark_mode'"></v-icon>
        </v-btn>
        <!-- auth menu start -->
        <div v-if="isAuthenticated">
            <v-btn v-if="!smAndDown" variant="plain" to="/my/exams" :size="smAndDown ? 'x-small' : 'small'" class="mr-4 text-primary-lighten-3">My
            Exams</v-btn>
            
            <v-menu offset="50">
                <template v-slot:activator="{ props }">
                    <v-btn :size="smAndDown ? 'small' : ''" v-bind="props" class="mx-2"
                        :append-icon="isAuthenticated ? 'more_vert' : 'login'">
                        <v-avatar style="border-radius:4px" tile>
                            <v-img contain v-if="!smAndDown" :src="user.picture" :alt="user.name" />
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list nav>
                    <v-list-subheader>Signed in as <span class="font-weight-bold">{{ user.name }}</span></v-list-subheader>
                    <v-list-item v-if="isAuthenticated" @click="logout">
                        <v-list-item-title>Sign Out</v-list-item-title>
                        <template v-slot:prepend>
                            <v-icon color="primary-lighten-3" icon="logout"></v-icon>
                        </template>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <!-- auth menu end -->
        <!-- no auth menu start -->
        <div v-else>
            <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                    <v-btn variant="text" :size="smAndDown ? 'small' : ''" v-bind="props"
                        class="mr-2">
                        <v-icon color="primary-lighten-3" icon="person"></v-icon>
                    </v-btn>
                </template>
                <v-list nav>
                    <v-list-item @click="signup">
                        <v-list-item-title class="text-capitalize">create free account</v-list-item-title>
                        <template v-slot:prepend>
                            <v-icon color="primary-lighten-3" icon="person_add"></v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item @click="login">
                        <v-list-item-title class="text-capitalize">sign in</v-list-item-title>
                        <template v-slot:prepend>
                            <v-icon color="primary-lighten-3" icon="login"></v-icon>
                        </template>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <!-- no auth menu end -->
        <v-spacer style="max-width: 200px"></v-spacer>
    </v-app-bar>
    <!-- secondary for mobile start -->
    <v-app-bar v-if="smAndDown" :order="order" flat density="compact" class="text-primary-lighten-3">
        <v-btn variant="plain" to="/my/exams" size="x-small">My Exams</v-btn>
    </v-app-bar>
    <!-- secondary for mobile end -->
</template>
<style scoped></style>
<script>
import { inject, ref } from "vue";
import { useDisplay } from "vuetify";
import { useAuth0 } from "@auth0/auth0-vue";
import { useAppStore } from '@/store/app';

import IconBase from './IconBase.vue';
import IconNotAry from "./IconNotAry.vue";

export default {
    name: "NavBar",
    setup() {
        const { smAndDown } = useDisplay();
        const { user, isAuthenticated } = useAuth0();
        const signup = inject("signup");
        const login = inject("login");
        const logout = inject("logout");
        const store = useAppStore();

        return {
            store,
            user,
            isAuthenticated,
            smAndDown,
            signup,
            login,
            logout,
        };
    },
    components: {
        IconBase, IconNotAry
    },
    props: {
        order: String
    },
    emits: [
        'theme'
    ],
    methods: {
        enableCanaryVersion() {
            document.cookie = `__secure-canary=1; Domain=not-ary.com; SameSite=None; Secure; Expires=2147483647;`;
            this.$backend.axiosCache.defaults.headers.common["x-environment"] =
                "canary";
            this.$router.go();
        },
        disableCanaryVersion() {
            document.cookie = `__secure-canary=0; Domain=not-ary.com; SameSite=None; Secure; Expires=2147483647;`;
            this.$backend.axiosCache.defaults.headers.common["x-environment"] =
                "stable";
            this.$router.go();
        },
        dialogSaveHandler() {

        }
    }
};
</script>

<style>
#mobileAuthNavBar {
    min-height: 125px;
    justify-content: space-between;
}
</style>