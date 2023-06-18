<template>
    <v-container class="h-100 d-flex flex-column justify-center align-center">
        <div v-if="scantron.score?.pass">
            <p class="text-h5">🎉Congratulations, you <span class="text-uppercase text-green">passed</span>!</p>
            <p>
                You got {{ right }} of {{ totalExamQuestions }} correct, for a score of {{ percent === 100 ? '💯' : `${percent}` }}% 🔥
            </p>
        </div>
        <div v-else>
            <p>Don't worry, even though you didn't pass the {{ store.states[store.activeState].name }} Notary Practice Exam, you
                <span v-if="freeExamsRemaining">still have {{ freeExamsRemaining }} free practice exams</span>
                <span v-else>can <a href="#" @click="signup">create a free account</a> for unlimited practice exams</span>
            </p>
            <p>
                You got {{ right }} of {{ totalExamQuestions }} correct, for a score of {{ percent }}%. A score of %70 is
                required to pass. Review your choices below against the correct answers and retake the practice exam when
                you're ready!
            </p>
        </div>

        <exam-history @scantrons="scantrons"></exam-history>

        <v-btn @click="emit('retest')" class="mt-8">Test Again</v-btn>
    </v-container>
</template>
<script setup>
import { useAppStore } from '@/store/app'
import { computed, inject, onBeforeUnmount } from 'vue'

import ExamHistory from './ExamHistory.vue'

const emit = defineEmits(['retest'])

const signup = inject("signup")
const scantrons = computed(() => store.states[store.activeState].examsTaken)
const right = computed(() => store.states[store.activeState].scantron.score?.right)
const percent = computed(() => store.states[store.activeState].scantron.score?.percent)
const totalExamQuestions = computed(() => store.states[store.activeState].scantron.totalExamQuestions)
const freeExamsRemaining = computed(() => store.freeExamsRemaining)
const store = useAppStore()
const scantron = computed(() => store.states[store.activeState].scantron)

onBeforeUnmount(() => emit('retest'))
</script>