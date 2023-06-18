<template>
    <v-container class="d-flex flex-column justify-center align-center">
        <v-table class="mt-16">
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
                    <td>{{ scantron.score.right }}/{{ totalExamQuestions }} ({{ scantron.score.percent }}%)</td>
                </tr>
            </tbody>
        </v-table>
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