<template>
    <v-app-bar :order="order" flat max-height="60px" class="mb-4">
        <template v-slot:prepend>
            <div :class="{ 'ml-4': !smAndDown }" class="d-flex justify-center mt-2">
                <icon-base iconName="not-ary" height="32" width="32" viewBox="0 0 64 64">
                    <icon-not-ary></icon-not-ary>
                </icon-base>
            </div>
        </template>
        <v-app-bar-title @click="$router.push('/')" style="cursor: pointer" class="font-italic font-weight-light">
            Not-Ary.com
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="!smAndDown && isAuthenticated" variant="plain" to="/account" :size="smAndDown ? 'x-small' : 'small'" class="mr-4 text-primary-lighten-3">Account</v-btn>
        <v-btn variant="plain" icon size="x-small" id="theme" @click="$emit('theme')">
            <v-icon color="primary-lighten-3" :icon="store.theme === 'light' ? 'light_mode' : 'dark_mode'"></v-icon>
        </v-btn>
        <!-- auth menu start -->
        <div v-if="isAuthenticated">
            <v-menu offset="50">
                <template v-slot:activator="{ props }">
                    <v-btn :size="smAndDown ? 'small' : ''" v-bind="props" class="mx-2" :append-icon="isAuthenticated ? 'more_vert' : 'login'">
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
                    <v-btn variant="text" :size="smAndDown ? 'x-small' : ''" v-bind="props" :class="!smAndDown ? 'mr-4' : 'px-0'">
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
        <v-spacer v-if="smAndDown"></v-spacer>
        <!-- no auth menu end -->
    </v-app-bar>
</template>
<style scoped>
.mobile {
    max-width: fit-content;
}
</style>
<script>
import { inject, ref } from "vue"
import { useDisplay } from "vuetify"
import { useAuth0 } from "@auth0/auth0-vue"
import { useAppStore } from '@/store/app'

import IconBase from './IconBase.vue'
import IconNotAry from "./IconNotAry.vue"

export default {
    name: "NavBar",
    setup() {
        const { smAndDown } = useDisplay()
        const { user, isAuthenticated } = useAuth0()
        const signup = inject("signup")
        const login = inject("login")
        const logout = inject("logout")
        const store = useAppStore()

        return {
            store,
            user,
            isAuthenticated,
            smAndDown,
            signup,
            login,
            logout,
        }
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
            document.cookie = `__secure-canary=1; Domain=not-ary.com; SameSite=None; Secure; Expires=2147483647;`
            this.$backend.axiosCache.defaults.headers.common["x-environment"] =
                "canary"
            this.$router.go()
        },
        disableCanaryVersion() {
            document.cookie = `__secure-canary=0; Domain=not-ary.com; SameSite=None; Secure; Expires=2147483647;`
            this.$backend.axiosCache.defaults.headers.common["x-environment"] =
                "stable"
            this.$router.go()
        },
        dialogSaveHandler() {

        }
    }
}
</script>