<template>
    <v-container class="h-100 d-flex justify-center align-center pa-0">
        <v-sheet v-if="Object.values(scantrons).length" class="mt-16" width="100%">
            <div class="text-overline d-flex align-center text-no-wrap">exam history<v-divider class="ml-2"></v-divider></div>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left" :class="{ 'pa-0': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">#</span>
                            <span v-else>Exam</span>
                        </th>
                        <th class="text-left" :class="{ 'pa-0': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">Start</span>
                            <span v-else>Started</span>
                        </th>
                        <th class="text-left" :class="{ 'pa-0': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">Finish</span>
                            <span v-else>Finished</span>
                        </th>
                        <th class="text-left" :class="{ 'pa-0': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">Time</span>
                            <span v-else>Time</span>
                        </th>
                        <th class="text-left" :class="{ 'pa-0': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">Score</span>
                            <span v-else>Score</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(scantron, key, index) in scantrons" :key="key">
                        <td :class="{ 'pa-2': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">{{ index + 1 }}</span>
                            <span v-else>{{ index + 1 }}</span><share-menu icon size="small" :title="title(scantron)"></share-menu>
                        </td>
                        <td :class="{ 'pa-2': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">{{ new Date(scantron.timeStarted).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
                            <span v-else>{{ new Date(scantron.timeStarted).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) }}</span>
                        </td>
                        <td :class="{ 'pa-2': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">{{ new Date(scantron.timeFinished).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
                            <span v-else>{{ new Date(scantron.timeFinished).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) }}</span>
                        </td>
                        <td :class="{ 'pa-2 text-body-2': smAndDown }">{{ formatTime((scantron.timeFinished - scantron.timeStarted) / 1000) }}</td>
                        <td :class="{ 'pa-2 text-body-2': smAndDown }">{{ scantron.score.right }}/{{ totalExamQuestions }} <sup :class="scantron.score.pass ? 'text-green' : 'text-red'">({{ scantron.score.percent }}%)</sup></td>
                    </tr>
                </tbody>
            </v-table>
        </v-sheet>
        <div v-else>
            <v-btn to="/">Start your first test exam</v-btn>
        </div>
    </v-container>
</template>
<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import { useDisplay } from "vuetify"

import ShareMenu from './ShareMenu.vue'

const { smAndDown } = useDisplay()
const store = useAppStore()
const scantrons = computed(() => store.states[store.activeState].examsTaken)
const totalExamQuestions = computed(() => store.states[store.activeState].scantron.totalExamQuestions)

function formatTime(timeInSeconds) {
    const seconds = Math.floor(timeInSeconds % 60)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const formattedSeconds = String(seconds).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')

    return `${formattedMinutes}m:${formattedSeconds}s`
}
function title(scantron) {
    const { pass, percent } = scantron.score;

    return percent >= 90 ? `I just scored ${percent}% at Not-Ary.com!🔥` : `I just ${pass ? 'passed' : 'finished'} my practice Notary Exam on Not-Ary.com.📢`
}
</script>