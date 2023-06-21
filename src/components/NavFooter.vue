<template>
    <v-footer class="py-0" style="max-height: 50px" v-if="store.username">
        <v-spacer style="max-width: 200px"></v-spacer>
        <div class="text-caption"><span class="font-weight-bold text-uppercase">username: </span>{{ store.username }}</div>
        <v-spacer style="max-width: 200px"></v-spacer>
    </v-footer>
    <v-footer name="footer" :order="props.order" class="text-center d-flex flex-column"
        style="max-height: 100px; z-index: 1010">
        <div class="d-flex">
            <v-btn v-for="link in links" :key="link" variant="text" class="mx-2" rounded="xl"
                :href="link.href" :to="link.to" target="_blank">
                <span v-html="stylize(link.name)"></span>
            </v-btn>
        </div>

        <v-divider></v-divider>

        <div class="d-flex">
            <v-btn :class="smAndDown ? 'pb-6 pt-2' : ''" v-for="secondaryLink in secondaryLinks" :key="secondaryLink" color="secondary" variant="plain" class="mx-2" rounded="xl" size="x-small"
                :href="secondaryLink.href" :to="secondaryLink.to" :target="secondaryLink.target || '_self'">
                <span v-html="secondaryLink.name"></span>
            </v-btn>
        </div>

        <v-divider></v-divider>

        <div class="d-flex align-center mt-auto">
            <v-icon class="mr-1" size="x-small">copyright</v-icon>{{ new Date().getFullYear() }}<span
                class="ml-1 text-uppercase font-weight-thin">Not-Ary.com</span>
        </div>
    </v-footer>
</template>
<style></style>
<script setup>
import { useDisplay } from 'vuetify'

import { useAppStore } from '@/store/app'

const { smAndDown } = useDisplay()
const store = useAppStore()
const links = [
    { name: "About", href: "https://about.not-ary.com" },
    { name: "Privacy", href: "https://privacy.not-ary.com" },
    { name: "Terms", href: "https://terms.not-ary.com" },
    { name: "Contact", href: "mailto:support@not-ary.com" },
    // { name: "Credits", click: () => this.$emit('credits') }
]
const secondaryLinks = [
    { name: "Support Not-Ary.com", to: "/support" },
]
const props = defineProps({
    order: String
})
const stylize = (text) => {
    return text.split('').map(l => /[notary]/i.test(l) ? l : smAndDown.value ? '' : `<span class="font-weight-light">${l}</span>`).join('\n')
}
// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['credits'])
</script>
