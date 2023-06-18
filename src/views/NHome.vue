<template>
    <v-container class="d-flex justify-center fill-height" :class="xs ? 'px-0' : ''">
        <div class="text-h5">{{ year }} {{ store.states[store.activeState].name }} Notary Practice Exam</div>
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
const store = useAppStore()
const { xs } = useDisplay()
const year = (new Date()).getFullYear()

function retest() {
    finished.value = false
    reset.value = true
}
</script>
