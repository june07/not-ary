<template>
    <v-container class="h-100 d-flex flex-column align-center" fluid>
        <div :class="smAndDown ? 'text-body-1' : 'text-h5'" class="mb-8">{{ year }} {{ store.states[store.activeState].name }} Notary Practice Exam</div>
        <div v-if="!scantron.timeStarted && !store.states[store.activeState].scantron.timeFinished" class="d-flex flex-column justify-center align-center">
            <p class="mb-8">
                Not-Ary.com has the best FREE, <a href="https://github.com/june07/not-ary" rel="noopener" target="_blank">open source</a>, and most up-to-date Notary Exam available!
            </p>
            <p class="text-caption">
            <ul :class="{ 'mx-2': smAndDown }">
                <li>Full length exam based on official <a :href="handbookURL" rel="noopener" target="_blank">Notary Public Handbook</a></li>
                <li>Easy to reference, highlighted, text-to-speech snippets from the handbook for each question</li>
                <li>Take the exam 3 times FREE without registering, and unlimited times with FREE registration</li>
                <li>Timed exam just like the real thing so you can measure your progress</li>
                <li>See correct answers as you go or wait until the end</li>
                <li>Much more...</li>
            </ul>
            </p>
            <v-btn v-if="freeExamsRemaining || isAuthenticated" @click="start" class="mt-16">start exam</v-btn>
            <v-btn v-else @click="signup" class="text-capitalize">create free account / sign in</v-btn>
        </div>
        <div v-else>
            <v-row>
                <v-spacer cols="4"></v-spacer>
                <v-col cols="4" id="progress-timer" class="text-center">{{ formatTimer(timer) }}</v-col>
                <v-col cols="4" id="progress-count" class="text-end">{{ currentIndex + 1 }}/{{ totalExamQuestions }}</v-col>
            </v-row>
            <v-progress-linear max="3600" v-model="timer"></v-progress-linear>
            <v-progress-linear :max="totalExamQuestions" v-model="progress" color="green"></v-progress-linear>

            <div v-if="MODE !== 'production'">{{ questions[currentIndex].title }}</div>
            <div class="question ml-16 mt-8">{{ questions[currentIndex].question }}</div>
            <div class="mb-8 mr-16 text-end"><v-btn class="hint" size="x-small" variant="plain" prepend-icon="menu_book" @click="overlays.hint = !overlays.hint">show hint</v-btn></div>

            <div class="choices">
                <v-radio-group :model-value="answers[questions[currentIndex].id]">
                    <div class="d-flex align-center" v-for="choice in choices" :key="Object.values(choice)[0]">
                        <v-icon v-if="showAnswers && answers[questions[currentIndex].id]" :color="choice.right ? 'green' : 'red'" :icon="choice.right ? 'check_box' : 'disabled_by_default'"></v-icon>
                        <v-radio :label="Object.values(choice)[0]" :value="choice" @change="markAnswer(choice)"></v-radio>
                    </div>
                </v-radio-group>
            </div>

            <div class="d-flex justify-center">
                <v-btn @click="MODE === 'production' ? overlays.reset = !overlays.reset : reset()" variant="plain" size="x-small" class="my-auto">reset</v-btn>
                <v-btn @click="prev" class="" :disabled="currentIndex < 1">prev</v-btn>
                <v-btn @click="next" class="" :disabled="currentIndex + 1 === totalExamQuestions">next</v-btn>
                <v-btn @click="submit" :variant="!finished ? 'plain' : undefined" size="x-small" :disabled="!finished || submitted" class="my-auto ml-2">submit</v-btn>
            </div>
        </div>

        <v-overlay v-model="overlays.image" class="d-flex justify-center align-center">
            <v-container v-click-outside="onclickOutside" style="width: 90vh; height: 90vh">
                <v-img :src="overlays.image"></v-img>
            </v-container>
        </v-overlay>
        <v-overlay v-model="overlays.hint" class="d-flex justify-center align-center">
            <v-sheet rounded="lg" class="pa-2 mx-auto" v-click-outside="onclickOutside" :width="smAndDown ? '98%' : 800">
                <div class="ma-4 d-flex">
                    <v-icon icon="quiz" class="mr-4"></v-icon>
                    <div id="overlay-question">{{ questions[currentIndex].question }}</div>
                </div>
                <v-img max-height="800" :src="questions[currentIndex].image" @dblclick="fullSize" v-touch:tap.stop="fullSize"></v-img>
                <div class="d-flex align-center text-no-wrap">
                    <v-btn variant="text" size="x-small" @click="listen('question')" :disabled="synth.speaking" prepend-icon="hearing">question</v-btn>
                    <v-btn variant="text" size="x-small" @click="listen" :disabled="synth.speaking || !questions[currentIndex].callout" prepend-icon="hearing">answer</v-btn>
                    <v-progress-linear indeterminate class="speaking-progress mt-1" height="1" color="primary-lighten-3" v-if="synth.speaking && !smAndDown"></v-progress-linear>
                </div>
                <v-progress-linear indeterminate class="speaking-progress mt-1" height="1" color="primary-lighten-3" v-if="synth.speaking && smAndDown"></v-progress-linear>
            </v-sheet>
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
<style>
.speaking-progress {
    max-width: 50%;
}
</style>
<script setup>
import * as cheerio from 'cheerio'
import { useAppStore } from '@/store/app'
import { ref, computed, onMounted, getCurrentInstance, onBeforeUnmount, inject, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuth0 } from '@auth0/auth0-vue'

const year = (new Date()).getFullYear()
const { user, isAuthenticated } = useAuth0()
const signup = inject("signup")
const { smAndDown } = useDisplay()
const { MODE } = import.meta.env
const { $ghost } = getCurrentInstance().appContext.config.globalProperties
const store = useAppStore()
const emit = defineEmits(['finished', 'started', 'reset'])
const props = defineProps({
    reset: Boolean
})
const choices = computed(() => shuffleArray(store.states[store.activeState].scantron.questions ? [
    { right: store.states[store.activeState].scantron.questions[currentIndex.value].options.right },
    ...store.states[store.activeState].scantron.questions[currentIndex.value].options.wrong.map(wrong => ({ wrong }))
] : []))
const interval = ref()
const overlays = ref({
    hint: false,
    reset: false,
    image: false
})
const synth = window.speechSynthesis
const showAnswers = computed(() => store.showAnswers)
const freeExamsRemaining = computed(() => store.freeExamsRemaining)
const handbookURL = computed(() => `https://notary.cdn.sos.${store.activeState.toLocaleLowerCase()}.gov/forms/notary-handbook-current.pdf`)
const submitted = computed(() => store.states[store.activeState]?.scantron.submitted)
const finished = computed(() => Object.keys(scantron.value.answers).length === totalExamQuestions.value)
const totalExamQuestions = computed(() => store.states[store.activeState]?.scantron.totalExamQuestions)
const currentIndex = computed(() => store.states[store.activeState]?.scantron.currentIndex)
const answers = computed(() => store.states[store.activeState]?.scantron.answers)
const timer = computed(() => store.states[store.activeState].scantron.timeTotal)
const scantron = computed(() => store.states[store.activeState].scantron)
const progress = computed(() => Object.keys(store.states[store.activeState]?.scantron.answers).length)
const data = computed(() => store.states[store.activeState]?.data)
const lastUpdate = computed(() => store.states[store.activeState]?.lastUpdate)
const questions = computed(() => store.states[store.activeState]?.scantron.questions)
async function update() {
    if (import.meta.env.mode !== 'production' || !data.value || (lastUpdate.value + 86_400_000) < Date.now()) {
        store.states[store.activeState].lastUpdate = Date.now()
        store.states[store.activeState].data = await $ghost.getQuestions(store.activeState)
    }
}
function onclickOutside() {
    Object.values(overlays.value).map(overlay => overlay = false)
    synth.cancel()
}
function startTimer() {
    if (interval.value) {
        clearInterval(interval.value)
    }
    interval.value = setInterval(() => store.states[store.activeState].scantron.timeTotal += 1, 1000)
}
function start() {
    store.states[store.activeState].scantron.questions = shuffleArray(data.value.map((d) => parse(d))).slice(0, isAuthenticated ? store.examLength : Math.min(45, store.examLength))
    store.states[store.activeState].scantron.timeStarted = Date.now()
    store.states[store.activeState].scantron.totalExamQuestions = store.states[store.activeState].scantron.questions.length
    startTimer()
    emit('started')
}
function markAnswer(answer) {
    store.states[store.activeState].scantron.answers[questions.value[currentIndex.value].id] = answer
}
function reset() {
    overlays.value.reset = false
    overlays.value.hint = false
    store.resetScantron()
    emit('reset')
}
function prev() {
    store.states[store.activeState].scantron.currentIndex -= 1
}
function next() {
    store.states[store.activeState].scantron.currentIndex += 1
}
function submit() {
    clearInterval(interval.value)
    store.states[store.activeState].scantron.timeFinished = Date.now()
    store.states[store.activeState].scantron.score = Object.values(store.states[store.activeState].scantron.answers).reduce((score, answer) => {
        score[Object.keys(answer)[0]] += 1
        return score
    }, { right: 0, wrong: 0, pass: false, percent: undefined })
    store.states[store.activeState].scantron.score.percent = Number(store.states[store.activeState].scantron.score.right / totalExamQuestions.value * 100).toFixed(2)
    if (store.states[store.activeState].scantron.score.percent >= 70) {
        store.states[store.activeState].scantron.score.pass = true
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
        title: data.title,
        question: $('.kg-toggle-heading-text').text(),
        options: {
            wrong: $('.kg-toggle-content > ul > li').filter((index, el) => !$(el).find('strong').length).get().map(el => $(el).text()),
            right: $('.kg-toggle-content > ul > li > strong > em').text() || $('.kg-toggle-content > ul > li > em > strong').text()
        },
        image: $('img').attr('src'),
        callout: $('.kg-callout-text').text()
    }
}
function formatTimer(timeInSeconds) {
    const seconds = Math.floor(timeInSeconds % 60)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const formattedSeconds = String(seconds).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}
const highlight = (text, from, to) => {
    let replacement = highlightBackground(text.slice(from, to))
    return text.substring(0, from) + replacement + text.substring(to)
}
const highlightBackground = sample => `<span style="font-weight: bold">${sample}</span>`
function listen(text) {
    const { question, callout } = questions.value[currentIndex.value]
    const utterance = new SpeechSynthesisUtterance(text === 'question' ? question : callout)
    const originalText = document.querySelector('#overlay-question').innerText

    if (text === 'question') {
        // callout is an image that has been pre-highlighted.
        utterance.addEventListener('boundary', event => {
            const { charIndex, charLength } = event
            document.querySelector('#overlay-question').innerHTML = highlight(originalText, charIndex, charIndex + charLength)
        })
    }

    synth.speak(utterance)
}
function fullSize() {
    if (!questions.value[currentIndex.value]?.image) return
    overlays.value.image = questions.value[currentIndex.value].image;
}
onMounted(() => {
    update()
    if (store.states[store.activeState].scantron.timeStarted && !store.states[store.activeState].scantron.timeFinished) {
        startTimer()
    } else if (store.states[store.activeState].scantron.score) {
        emit('finished')
    }
    if (props.reset) {
        reset()
    }
})
onBeforeUnmount(() => {
    clearInterval(interval.value)
})
</script>