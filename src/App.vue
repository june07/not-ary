<template>
    <v-app ref="not-ary" :class="{ 'blur': showCredits }" :theme="store.theme">
        <nav-bar order="-1" v-if="! /nonav/.test($route.name) && mounted" @theme="themeHandler" />
        <v-navigation-drawer order="2" width="200" floating v-if="! /nonav/.test($route.name) && mounted"></v-navigation-drawer>
        <v-main>
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </v-main>
        <v-navigation-drawer order="2" width="200" floating location="right" v-if="! /nonav/.test($route.name) && mounted"></v-navigation-drawer>
        <nav-footer order="-1" @credits="creditButtonHandler" v-if="! /nonav/.test($route.name) && mounted" />

        <v-overlay v-model="showCredits" class="d-flex justify-center align-center h-100">
            <div class="d-flex flex-column text-center font-weight-light">
                <h4 v-click-outside="onClickOutside" class="text-capitalize text-h3 font-weight-light mb-4">Attributions and
                    Credits</h4>
                <div v-for="credit of credits" v-bind:key="credit" v-html="credit"></div>
            </div>
        </v-overlay>
        <v-snackbar color="primary" text :timeout="-1" v-model="notice" style="opacity: 0.9" @click="notice = !notice">
            <v-row>
                <v-col cols="1" class="d-flex align-center justify-center">
                    <span class="material-icons-outlined">info</span>
                </v-col>
                <v-col cols="10" class="d-flex align-center justify-center">
                    <span @click="$router.go()" class="font-weight-light" v-bind:class="xsOnly ? 'caption' : ''" style="cursor: pointer">Reload to update to the newest app version.</span>
                </v-col>
                <v-col cols="1" class="d-flex align-center justify-center">
                    <v-btn variant="plain" :size="xsOnly ? 'x-small' : ''" @click="clickHandler"> x </v-btn>
                </v-col>
            </v-row>
        </v-snackbar>
    </v-app>
</template>
<style>
.blur {
    filter: blur(2px);
}
</style>
<script setup>
import { ref, provide, computed, getCurrentInstance, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import { useRoute } from 'vue-router'

import NavFooter from './components/NavFooter.vue'
import NavBar from './components/NavBar.vue'
import { watch } from 'vue'

const route = useRoute()
const store = useAppStore()
const vm = getCurrentInstance()
const { $api } = vm.appContext.config.globalProperties
const version = ref()
const mounted = ref(false)
const notice = ref(false)
const lastBuild = ref()
const showCredits = ref(false)
const showCreditsDebounce = ref(true)
const credits = ref([])
const versionCheckIntervalId = ref()

const checkVersion = async () => {
    const newestBuild = await $api.buildInfo()

    if (!newestBuild?.build_date) {
        return
    }
    version.value = newestBuild.commit_sha
    if (
        lastBuild.value &&
        lastBuild.value?.build_date !== newestBuild.build_date
    ) {
        notice.value = true
    } else {
        lastBuild.value = newestBuild
    }
}
const creditButtonHandler = function () {
    showCredits.value = !showCredits.value
    showCreditsDebounce.value = false
    setTimeout(() => showCreditsDebounce.value = true, 500)
}
const onClickOutside = function () {
    if (showCreditsDebounce.value) showCredits.value = false
}
function themeHandler() {
    store.theme = store.theme === "light" ? "dark" : "light"
}
watch(
    () => route.query.theme,
    async newTheme => {
        if (/light|dark/.test(newTheme)) {
            store.theme = newTheme
        }
    }
)
onMounted(() => {
    setTimeout(() => mounted.value = true, 500)
    checkVersion()
    versionCheckIntervalId.value = setInterval(checkVersion, 60000)
})

</script>