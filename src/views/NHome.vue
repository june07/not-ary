<template>
    <v-container class="d-flex justify-center fill-height" :class="xs ? 'px-0' : ''">
        <div class="text-h5">{{ year }} {{ store.states[state].name }} Notary Practice Exam</div>
        <not-ary-exam v-if="!finished" :state="state" @finished="finished = true" @started="start = false" :start="start"></not-ary-exam>
        <exam-results v-else :state="state" @retest="retest"></exam-results>
    </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { useDisplay } from "vuetify"
import { useAppStore } from '@/store/app'

import NotAryExam from '../components/NotAryExam.vue'
import ExamResults from '../components/ExamResults.vue'

const start = ref(false)
const finished = ref(false)
const store = useAppStore()
const { xs } = useDisplay()
const year = (new Date()).getFullYear()
const state = 'ca'

function retest() {
    finished.value = false
    start.value = true
}
</script>
