<template>
    <v-container class="h-100 d-flex flex-column justify-center align-center">
        <div v-if="scantron.score?.pass">
            <p class="text-h5">🎉Congratulations, you <span class="text-uppercase text-green">passed</span>!</p>
            <p>
                You got {{ right }} of {{ totalExamQuestions }} correct, for a score of {{ percent === 100 ? '💯' : `${percent}` }}% 🔥
            </p>
        </div>
        <div v-else>
            <p class="mb-4">
                A score of 70% is required to pass and you got {{ right }} of {{ totalExamQuestions }} correct, for a score of <span class="text-red">{{ percent }}%</span>. Review your choices below against the correct answers and retake the practice exam when
                you're ready!
            </p>
            <p>And don't worry, even though you didn't pass the {{ store.states[store.activeState].name }} Notary Practice Exam, you
                <span v-if="freeExamsRemaining">still have <span class="font-weight-bold">unlimited FREE</span> practice exams!</span>
                <span v-else>can <a href="#" @click="signup">create a free account</a> for unlimited practice exams</span>
            </p>
        </div>

        <div class="text-no-wrap mt-2">Please Share<share-menu icon size="small"></share-menu></div>
        <!-- <router-link style="text-decoration: none" to="/support"><span class="text-overline text-red mr-2">Support Not-Ary.com</span><v-icon icon="toll" color="black" size="small"></v-icon></router-link> -->
        <support-sheet />
        <exam-history @scantrons="scantrons"></exam-history>

        <v-btn @click="emit('retest')" class="mt-8">Test Again</v-btn>
    </v-container>
</template>
<script setup>
import { useAppStore } from '@/store/app'
import { ref, computed, inject, onBeforeUnmount, onMounted } from 'vue'

import ExamHistory from './ExamHistory.vue'
import ShareMenu from './ShareMenu.vue'
import SupportSheet from '@/components/SupportSheet.vue'

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