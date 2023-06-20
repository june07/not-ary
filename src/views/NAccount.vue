<template>
    <v-container class="h-100 d-flex flex-column align-center" :class="smAndDown ? 'px-0' : ''">
        <div class="text-h5 mb-8">Account</div>
        <exam-history></exam-history>
    </v-container>
</template>
<script setup>
import { useDisplay } from "vuetify"
import { onMounted, getCurrentInstance } from 'vue'

import ExamHistory from '../components/ExamHistory.vue'

const { smAndDown } = useDisplay()
const { $api } = getCurrentInstance().appContext.config.globalProperties

onMounted(() => {
    $api.sync();
})
</script>
