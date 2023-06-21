<template>
    <v-container class="h-100 d-flex flex-column align-center" :class="smAndDown ? 'px-0' : ''">
        <div class="text-h5 mb-8">Account</div>
        <exam-history @selected="selected => scantron = selected"></exam-history>
        <past-exam :scantron="scantron" @close="scantron = undefined"></past-exam>
    </v-container>
</template>
<script setup>
import { useDisplay } from "vuetify"
import { ref, onMounted, getCurrentInstance } from 'vue'

import ExamHistory from '../components/ExamHistory.vue'
import PastExam from '../components/PastExam.vue'

const scantron = ref()
const { smAndDown } = useDisplay()
const { $api } = getCurrentInstance().appContext.config.globalProperties

onMounted(() => {
    $api.sync();
})
</script>
