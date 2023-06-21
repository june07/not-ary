<template>
    <v-container class="h-100 d-flex justify-center" :class="{ 'my-0 py-0': smAndDown }">
        <v-sheet v-if="Object.values(scantrons).length" width="100%">
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
                        <td class="d-flex align-center" :class="{ 'pa-2': smAndDown }">
                            <span v-if="smAndDown" class="text-body-2">{{ index + 1 }}</span>
                            <span v-else class="mr-4">{{ index + 1 }}</span>
                            <div class="ml-auto">
                                <v-btn v-if="$route.name === 'account' && scantron.score.wrong > 0" size="small" variant="text" @click="emit('selected', scantron)" icon="loupe" density="compact"></v-btn>
                                <share-menu icon density="compact" size="small" :title="title(scantron)"></share-menu>
                            </div>
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
import { computed, getCurrentInstance, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import { useDisplay } from "vuetify"

import ShareMenu from './ShareMenu.vue'

const emit = defineEmits(['selected'])
const { $api } = getCurrentInstance().appContext.config.globalProperties
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
    const { pass, percent } = scantron.score

    return percent >= 90 ? `I just scored ${percent}% at Not-Ary.com!🔥` : `I just ${pass ? 'passed' : 'finished'} my practice Notary Exam on Not-Ary.com.📢`
}
function syncState() {
    if (!Object.entries(store.states)?.length) return

    const examState = {
        scantronsByState: Object.entries(store.states)
            .filter(kv => Object.values(kv[1].examsTaken).length)
            .reduce((scantronsByState, kv) => ({ ...scantronsByState, [kv[0]]: kv[1].examsTaken }), {})
    }
    
    if (JSON.stringify(examState.scantronsByState) === '{}') return
    if (JSON.stringify(examState) === JSON.stringify(store.lastExamState)) return

    $api.sync({ examState })
}
onMounted(() => {
    syncState()
})
</script>