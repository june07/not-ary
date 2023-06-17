<template>
    <v-container class="h-100 d-flex justify-center" fluid>
        <div v-if="!scantron.timeStarted" class="d-flex flex-column justify-center align-center">
            <p class="mb-8">
                Not-Ary.com hosts the best FREE, <a href="https://github.com/june07/not-ary" rel="noopener" target="_blank">open source</a>, and most up-to-date Notary Exam available!
            </p>
            <p class="text-caption">
                <ul>
                    <li>Full length exam based on official <a :href="handbookURL" rel="noopener" target="_blank">Notary Public Handbook</a></li>
                    <li>Easy to reference, highlighted snippets from the handbook for each question</li>
                    <li>Take the exam 3 times for zero cost without registering, and unlimited times with FREE registration</li>
                    <li>Timed exam just like the real thing</li>
                    <li>See correct answers as you go or wait until the end</li>
                    <li>Much more...</li>
                </ul>
            </p>
            <v-btn @click="start" class="mt-16">start exam</v-btn>
        </div>
        <div v-else>
            <v-row>
                <v-spacer cols="4"></v-spacer>
                <v-col cols="4" id="progress-timer" class="text-center">{{ formatTimer(timer) }}</v-col>
                <v-col cols="4" id="progress-count" class="text-end">{{ currentIndex + 1 }}/{{ totalExamQuestions }}</v-col>
            </v-row>
            <v-progress-linear max="3600" v-model="timer"></v-progress-linear>
            <v-progress-linear :max="totalExamQuestions" v-model="progress" color="green"></v-progress-linear>

            <div class="question ml-16 mt-8">{{ questions[currentIndex].question }}</div>
            <div class="mb-8 mr-16 text-end"><v-btn class="hint" size="x-small" variant="plain" prepend-icon="menu_book"
                    @click="overlays.hint = !overlays.hint">show hint</v-btn></div>

            <div class="choices">
                <v-radio-group :model-value="answers[questions[currentIndex].id]">
                    <v-radio v-for="choice in choices" :key="Object.values(choice)[0]" :label="Object.values(choice)[0]"
                        :value="choice" @change="markAnswer(choice)"></v-radio>
                </v-radio-group>
            </div>

            <div class="d-flex justify-center">
                <v-btn @click="MODE === 'production' ? overlays.reset = !overlays.reset : reset()" variant="plain" size="x-small" class="my-auto">reset</v-btn>
                <v-btn @click="prev" class="" :disabled="currentIndex < 1">prev</v-btn>
                <v-btn @click="next" class="" :disabled="currentIndex + 1 === totalExamQuestions">next</v-btn>
                <v-btn @click="submit" :variant="!finished ? 'plain' : undefined" size="x-small"
                    :disabled="!finished || submitted" class="my-auto ml-2">submit</v-btn>
            </div>
        </div>

        <v-overlay v-model="overlays.hint">
            <v-container fluid class="d-flex justify-center align-center" style="width: 100vh; height: 100vh">
                <v-img :src="questions[currentIndex].image" v-click-outside="onclickOutside"></v-img>
            </v-container>
        </v-overlay>
        <v-overlay v-model="overlays.reset" class="d-flex justify-center align-center">
            <v-container>
                <v-sheet rounded="lg" class="pa-4 flex-column">
                    <div class="mb-2 text-center">Reset exam progress?</div>
                    <div>
                        <v-btn variant="text" class="mr-2" @click="reset">confirm</v-btn>
                        <v-btn variant="text" class="ml-2" @click="overlays.reset = false">cancel</v-btn>
                    </div>
                </v-sheet>
            </v-container>
        </v-overlay>
    </v-container>
</template>
<script setup>
import * as cheerio from 'cheerio'
import { useAppStore } from '@/store/app'
import { ref, computed, onMounted, getCurrentInstance, onBeforeUnmount } from 'vue'

const { MODE } = import.meta.env
const { $ghost } = getCurrentInstance().appContext.config.globalProperties
const store = useAppStore()
const emit = defineEmits(['finished', 'started'])
const props = defineProps({
    state: {
        type: String,
        default: 'ca'
    },
    start: Boolean
})
const choices = computed(() => shuffleArray([
    { right: store.states[props.state].questions[currentIndex.value].options.right },
    ...store.states[props.state].questions[currentIndex.value].options.wrong.map(wrong => ({ wrong }))
]))
const interval = ref()
const overlays = ref({
    hint: false,
    reset: false
})
const handbookURL = computed(() => `https://notary.cdn.sos.${props.state.toLocaleLowerCase()}.gov/forms/notary-handbook-current.pdf`)
const submitted = computed(() => store.states[props.state]?.scantron.submitted)
const finished = computed(() => currentIndex.value === totalExamQuestions.value - 1 && Object.keys(scantron.value.answers).length === totalExamQuestions.value)
const totalExamQuestions = computed(() => store.states[props.state]?.scantron.totalExamQuestions)
const currentIndex = computed(() => store.states[props.state]?.scantron.currentIndex)
const answers = computed(() => store.states[props.state]?.scantron.answers)
const timer = computed(() => store.states[props.state].scantron.timeTotal)
const scantron = computed(() => store.states[props.state].scantron)
const progress = computed(() => Object.keys(store.states[props.state]?.scantron.answers).length)
const data = computed(() => store.states[props.state]?.data)
const lastUpdate = computed(() => store.states[props.state]?.lastUpdate)
const questions = computed(() => store.states[props.state]?.questions)
async function update() {
    if (import.meta.env.mode !== 'production' || !data.value || (lastUpdate.value + 86_400_000) < Date.now()) {
        store.states[props.state].lastUpdate = Date.now()
        store.states[props.state].data = await $ghost.getQuestions(props.state)
    }
}
function onclickOutside() {
    overlays.value.hint = false
}
function startTimer() {
    interval.value = setInterval(() => store.states[props.state].scantron.timeTotal += 1, 1000)
}
function start() {
    store.states[props.state].questions = shuffleArray(data.value.map((d) => parse(d))).slice(0, MODE === 'production' ? 45 : 3)
    store.states[props.state].scantron.timeStarted = Date.now()
    store.states[props.state].scantron.totalExamQuestions = store.states[props.state].questions.length
    startTimer()
}
function markAnswer(answer) {
    store.states[props.state].scantron.answers[questions.value[currentIndex.value].id] = answer
}
function reset() {
    overlays.value.reset = false
    overlays.value.hint = false
    store.resetScantron()
}
function prev() {
    store.states[props.state].scantron.currentIndex -= 1
}
function next() {
    store.states[props.state].scantron.currentIndex += 1
}
function submit() {
    clearInterval(interval.value)
    store.states[props.state].scantron.timeFinished = Date.now()
    store.states[props.state].scantron.score = Object.values(store.states[props.state].scantron.answers).reduce((score, answer) => {
        score[Object.keys(answer)[0]] += 1
        return score
    }, { right: 0, wrong: 0, pass: false, percent: undefined })
    store.states[props.state].scantron.score.percent = store.states[props.state].scantron.score.right / totalExamQuestions.value * 100
    if (store.states[props.state].scantron.score.percent > 0.70) {
        store.states[props.state].scantron.score.pass = true
    }
    store.saveScantron()
    submitted.value = true
    emit('finished')
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    const index = array.map(a => Object.values(a)[0]).findIndex(a => /of the above/i.test(a))
    if (index !== -1) {
        const ota = array.splice(index, 1)
        array = [...array, ...ota]
    }
    return array
}
function parse(data) {
    const $ = cheerio.load(data.html)

    return {
        id: data.id,
        question: $('.kg-toggle-heading-text').text(),
        options: {
            wrong: $('.kg-toggle-content > ul > li').filter((index, el) => !$(el).find('strong').length).get().map(el => $(el).text()),
            right: $('.kg-toggle-content > ul > li > strong > em').text()
        },
        image: $('img').attr('src')
    }
}
function formatTimer(timeInSeconds) {
    const seconds = Math.floor(timeInSeconds % 60)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const formattedSeconds = String(seconds).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}
onMounted(() => {
    update()
    if (store.states[props.state].scantron.timeStarted) {
        startTimer()
    }
    if (props.start) {
        store.resetScantron();
        emit('started')
    }
})
onBeforeUnmount(() => {
    clearInterval(interval.value)
})
</script>