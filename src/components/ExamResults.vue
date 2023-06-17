<template>
    <v-container class="h-100 d-flex justify-center" fluid>
        <div v-if="scantron.score.pass">
            <p class="text-h5">🎉Congratulations, you <span class="text-uppercase text-green">passed</span>!</p>
            <p>
                You got {{ right }} of {{ totalExamQuestions }} correct, for a score of {{ percent === 100 ? '💯' :
                    `${percent} 🔥` }}%
            </p>
        </div>
        <div v-else>
            <p>Don't worry, even though you didn't pass the {{ store.states[state].name }} Notary Practice Exam, you still
                have {{ freeExamsRemaining }} free practice exams</p>
            <p>
                You got {{ right }} of {{ totalExamQuestions }} correct, for a score of %{{ percent }}. A score of %70 is
                required to pass. Review your choices below against the correct answers and retake the practice exam when
                you're ready!
            </p>
        </div>

        <v-spacer></v-spacer>
        <v-table>
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
                <tr v-for="(scantron, index) in scantrons" :key="index">
                    <td>{{ index }}</td>
                    <td>{{ scantron.timeFinished }}</td>
                    <td>{{ scantron.timeTotal }}</td>
                    <td>{{ scantron.score.right }}/{{ totalExamQuestions }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-container>
</template>
<script setup>
import { useAppStore } from '@/store/app'
import { ref, computed, onMounted } from 'vue'

const right = computed(() => store.states[props.state].scantron.score.right)
const percent = computed(() => store.states[props.state].scantron.score.percent)
const totalExamQuestions = computed(() => store.states[props.state].scantron.totalExamQuestions)
const freeExamsRemaining = computed(() => 3 - store.states[props.state].totalExamsTaken)
const store = useAppStore()
const props = defineProps({
    state: {
        type: String,
        default: 'ca'
    }
})
const scantron = computed(() => store.states[props.state].scantron)
</script>