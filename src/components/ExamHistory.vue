<template>
    <v-container class="h-100 d-flex justify-center align-center">
        <v-sheet v-if="Object.values(scantrons).length" class="mt-16">
            <div class="text-overline ml-n16 d-flex align-center text-no-wrap">exam history<v-divider class="ml-2"></v-divider></div>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            Exam
                        </th>
                        <th class="text-left">
                            Started
                        </th>
                        <th class="text-left">
                            Finished
                        </th>
                        <th class="text-left">
                            Time
                        </th>
                        <th class="text-left">
                            Score
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(scantron, key, index) in scantrons" :key="key">
                        <td>{{ index + 1 }}</td>
                        <td>{{ new Date(scantron.timeStarted).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) }}</td>
                        <td>{{ new Date(scantron.timeFinished).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) }}</td>
                        <td>{{ formatTime((scantron.timeFinished - scantron.timeStarted) / 1000) }}</td>
                        <td>{{ scantron.score.right }}/{{ totalExamQuestions }} <sup :class="scantron.score.pass ? 'text-green' : 'text-red'">({{ scantron.score.percent }}%)</sup></td>
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
</script>