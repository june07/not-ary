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
        <v-btn variant="plain" icon size="x-small" id="theme" @click="$emit('theme')">
            <v-icon color="primary-lighten-3" :icon="store.theme === 'light' ? 'light_mode' : 'dark_mode'"></v-icon>
        </v-btn>
        <v-menu :close-on-content-click="settingsCloseOnContentClick" @update:modelValue="settingsCloseOnContentClick = true">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="plain" icon size="x-small">
                    <v-icon color="primary-lighten-3" icon="settings"></v-icon>
                </v-btn>
            </template>
            <v-list nav>
                <v-list-subheader class="text-overline">settings</v-list-subheader>
                <v-list-item @click="store.showAnswers = !store.showAnswers">
                    <v-list-item-title class="text-capitalize">{{ store.showAnswers ? 'hide answers' : 'show answers' }}</v-list-item-title>
                    <template v-slot:prepend>
                        <v-icon color="primary-lighten-3" :icon="store.showAnswers ? 'visibility_off' : 'visibility'"></v-icon>
                    </template>
                </v-list-item>
                <v-list-item @mouseover="settingsCloseOnContentClick = false">
                    <div class="d-flex align-center">
                        <v-list-item-title class="text-capitalize mr-4">exam length</v-list-item-title>
                        <v-list-item-action end>
                            <v-text-field v-model="store.examLength" density="compact" hide-details variant="outlined"></v-text-field>
                        </v-list-item-action>
                    </div>
                    <template v-slot:prepend>
                        <v-icon color="primary-lighten-3" icon="straighten"></v-icon>
                    </template>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @mouseover="settingsCloseOnContentClick = false" v-if="!showDeveloperSettings" @click="store.showDeveloperSettings = !store.showDeveloperSettings">
                    <v-list-item-title class="">Show Developer Settings</v-list-item-title>
                    <template v-slot:prepend>
                        <v-icon color="primary-lighten-3" icon="developer_mode"></v-icon>
                    </template>
                </v-list-item>
                <div v-else>
                    <v-list-subheader class="d-flex text-overline">developer<a style="text-decoration: none" href="#" class="ml-2 text-caption" @click="store.showDeveloperSettings = !store.showDeveloperSettings">(hide developer settings)</a></v-list-subheader>
                    <v-list-item @click="clearLocalStorage">
                        <v-list-item-title class="">Clear localStorage</v-list-item-title>
                        <template v-slot:prepend>
                            <v-icon color="red" icon="delete_forever"></v-icon>
                        </template>
                        <template v-slot:append>
                            <v-progress-circular indeterminate v-if="progress" size="small" width="1"></v-progress-circular>
                        </template>
                    </v-list-item>
                </div>
            </v-list>
        </v-menu>
        <!-- auth menu start -->
        <div v-if="isAuthenticated">
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn :size="smAndDown ? 'small' : ''" v-bind="props" class="mx-2" :append-icon="isAuthenticated ? 'more_vert' : 'login'">
                        <v-avatar :size="smAndDown ? 'x-small' : 'small'">
                            <v-img contain :src="user.picture" :alt="user.name" />
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list :density="smAndDown ? 'compact' : undefined" nav>
                    <v-list-subheader>Signed in as <span class="font-weight-bold">{{ user.name }}</span></v-list-subheader>
                    <v-list-item to="/account">
                        <v-list-item-title>Account</v-list-item-title>
                        <template v-slot:prepend>
                            <v-icon color="primary-lighten-3" icon="manage_accounts"></v-icon>
                        </template>
                    </v-list-item>
                    <v-list-item @click="logout">
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
            <v-menu>
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
        <!-- no auth menu end -->
    </v-app-bar>
</template>
<style scoped>
.mobile {
    max-width: fit-content;
}
</style>
<script>
import { ref, inject, computed } from "vue"
import { useDisplay } from "vuetify"
import { useAuth0 } from "@auth0/auth0-vue"
import { useAppStore, resetStore } from '@/store/app'

import IconBase from './IconBase.vue'
import IconNotAry from "./IconNotAry.vue"

export default {
    name: "NavBar",
    setup() {
        const progress = ref(false)
        const { smAndDown } = useDisplay()
        const { user, isAuthenticated } = useAuth0()
        const signup = inject("signup")
        const login = inject("login")
        const logout = inject("logout")
        const store = useAppStore()
        const examLength = computed(() => store.examLength)
        const editExamLength = ref(false)
        const settingsCloseOnContentClick = ref(true)
        const showDeveloperSettings = computed(() => store.showDeveloperSettings)

        return {
            store,
            user,
            isAuthenticated,
            smAndDown,
            signup,
            login,
            logout,
            examLength,
            editExamLength,
            settingsCloseOnContentClick,
            showDeveloperSettings,
            progress
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
        clearLocalStorage() {
            this.progress = true
            resetStore()
            setTimeout(() => this.progress = false, 500)
        }
    }
}
</script>