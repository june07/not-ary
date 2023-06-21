<template>
    <v-container class="d-flex justify-center fill-height" :class="smAndDown ? 'px-0' : ''">
        <not-ary-exam v-if="!finished" @finished="finished = true" @started="start = false" :reset="reset"></not-ary-exam>
        <exam-results v-else @retest="retest"></exam-results>
    </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { useDisplay } from "vuetify"
import { useAppStore } from '@/store/app'

import NotAryExam from '../components/NotAryExam.vue'
import ExamResults from '../components/ExamResults.vue'

const reset = ref(false)
const start = ref(false)
const finished = ref(false)
const { smAndDown } = useDisplay()

function retest() {
    reset.value = true
    finished.value = false
}
</script>
