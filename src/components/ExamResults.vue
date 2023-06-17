<template>
    <v-container class="h-100 d-flex flex-column justify-center align-center">
        <div v-if="scantron.score?.pass">
            <p class="text-h5">🎉Congratulations, you <span class="text-uppercase text-green">passed</span>!</p>
            <p>
                You got {{ right }} of {{ totalExamQuestions }} correct, for a score of {{ percent === 100 ? '💯' : `${percent.toFixed(2)}` }}% 🔥
            </p>
        </div>
        <div v-else>
            <p>Don't worry, even though you didn't pass the {{ store.states[state].name }} Notary Practice Exam, you
                <span v-if="freeExamsRemaining">still have {{ freeExamsRemaining }} free practice exams</span>
                <span v-else>can <a href="#" @click="signup">create a free account</a> for unlimited practice exams</span>
            </p>
            <p>
                You got {{ right }} of {{ totalExamQuestions }} correct, for a score of {{ percent.toFixed(2) }}%. A score of %70 is
                required to pass. Review your choices below against the correct answers and retake the practice exam when
                you're ready!
            </p>
        </div>

        <v-table class="mt-16">
            <thead>
                <tr>
                    <th class="text-left">
                        Number
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
                    <td>{{ new Date(scantron.timeFinished).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) }}</td>
                    <td>{{ formatTime(scantron.timeFinished - scantron.timeStarted) }}</td>
                    <td>{{ scantron.score.right }}/{{ totalExamQuestions }} ({{ scantron.score.percent }}%)</td>
                </tr>
            </tbody>
        </v-table>

        <v-btn @click="emit('retest')" class="mt-8">Test Again</v-btn>
    </v-container>
</template>
<script setup>
import { useAppStore } from '@/store/app'
import { computed, inject } from 'vue'

const emit = defineEmits(['retest'])

const signup = inject("signup")
const scantrons = computed(() => store.states[props.state].examsTaken)
const right = computed(() => store.states[props.state].scantron.score.right)
const percent = computed(() => store.states[props.state].scantron.score.percent)
const totalExamQuestions = computed(() => store.states[props.state].scantron.totalExamQuestions)
const freeExamsRemaining = computed(() => Math.max(3 - Object.keys(scantrons).length, 0))
const store = useAppStore()
const props = defineProps({
    state: {
        type: String,
        default: 'ca'
    }
})
const scantron = computed(() => store.states[props.state].scantron)

function formatTime(timeInSeconds) {
    const seconds = Math.floor(timeInSeconds % 60)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const formattedSeconds = String(seconds).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')

    return `${formattedMinutes}m:${formattedSeconds}s`
}
</script>