<template>
    <v-container class="h-100 d-flex justify-center" :class="{ 'my-0 py-0': smAndDown }" v-if="scantron">
        <v-sheet width="100%">
            <div class="text-overline d-flex align-center text-no-wrap">exam {{ examId }}<v-divider class="ml-2"></v-divider>
                <v-btn @click="emit('close')" variant="text" size="small">close</v-btn>
            </div>
            <v-chip class="d-flex justify-end mr-16" variant="tonal" :size="smAndDown ? 'small' : ''" label>summary<v-icon end icon="summarize" color="primary-lighten-3" :class="!smAndDown ? 'my-2 mr-2' : ''"></v-icon></v-chip>
            <p class="ml-16">You {{ pass ? 'passed' : 'failed' }} practice exam <span class="text-overline">{{ examId }}</span> started on {{ startDate }} at {{ startTime }}, with {{ right }}/{{ totalExamQuestions }} correct answers for an overall score of <span :class="percent > 90 ? 'text-green' : 'text-red'">{{ percent }}%</span>.</p>
            <p class="ml-16 my-6">Review your incorrect choices below and learn from your mistakes.</p>
            <v-chip class="d-flex justify-end mr-16 mt-4" variant="tonal" :size="smAndDown ? 'small' : ''" label>review<v-icon end icon="fact_check" color="primary-lighten-3" :class="!smAndDown ? 'my-2 mr-2' : ''"></v-icon></v-chip>
            <div class="wrong" v-for="(wrongAnswer, id) of wrongAnswers" :index="id">
                <div v-if="getQuestion(id).order" class="text-overline d-flex align-center text-no-wrap ml-16">Question #{{ getQuestion(id).order }}</div>
                <div class="my-2 ml-8 font-weight-bold">{{ wrongAnswer.question }}</div>
                <v-radio-group :model-value="wrongAnswer.text" readonly>
                    <div class="d-flex align-center" v-for="option in getOptions(id)">
                        <v-icon :color="Object.keys(option)[0] === 'right' ? 'green' : 'red'" :icon="Object.keys(option)[0] === 'right' ? 'check_box' : 'disabled_by_default'"></v-icon>
                        <v-radio :class="{ 'mobile-radio': smAndDown }" :value="Object.values(option)[0]" color="red">
                            <template v-slot:label>
                                <span v-if="Object.values(option)[0] === wrongAnswer" class="text-red">{{ Object.values(option)[0] }}</span>
                                <span v-else-if="Object.keys(option)[0] === 'right'" class="font-weight-bold font-italic text-decoration-underline">{{ Object.values(option)[0] }}</span>
                                <span v-else>{{ Object.values(option)[0] }}</span>
                            </template>
                        </v-radio>
                    </div>
                </v-radio-group>
            </div>
            <v-btn @click="emit('close')" variant="tonal">close</v-btn>
        </v-sheet>
    </v-container>
</template>
<style>
.mobile-radio {
    border: dotted;
    border-color: #000E14;
    border-width: 1px;
    border-radius: 8px;
    margin: 1px;
}
</style>
<script setup>
import { computed } from 'vue'
import { useDisplay } from "vuetify"
import Hashids from 'hashids'

const hashids = new Hashids('not-ary.com')
const props = defineProps({
    scantron: Object
})
const { smAndDown } = useDisplay()
const startDate = computed(() => new Date(props.scantron?.timeStarted).toLocaleDateString())
const startTime = computed(() => new Date(props.scantron?.timeStarted).toLocaleTimeString())
const percent = computed(() => props.scantron?.score.percent)
const right = computed(() => props.scantron?.score.right)
const totalExamQuestions = computed(() => props.scantron?.totalExamQuestions)
const pass = computed(() => props.scantron?.score.pass)
const examId = computed(() => hashids.encode(props.scantron?.timeStarted))
const wrongAnswers = computed(() => props.scantron?.answers && Object.entries(props.scantron.answers)
    .reduce((wrongAnswers, kv) => {
        const id = kv[0]
        const answer = kv[1]
        const matchingQuestion = props.scantron.questions.find(q => q.id === id)

        if (Object.keys(answer)[0] !== 'wrong') return wrongAnswers
        return { ...wrongAnswers, [id]: { ...matchingQuestion, text: kv[1].wrong } }
    }, {}))

console.log(wrongAnswers)
const questions = computed(() => props.scantron.questions)
const getQuestion = (id) => questions.value.find(q => q.id === id)
const getOptions = (id) => {
    const options = questions.value.find(q => q.id === id)?.options
    return options ? [
        { right: options.right },
        ...options.wrong.map(wrong => ({ wrong }))
    ] : undefined
}
const emit = defineEmits(['close'])
</script>