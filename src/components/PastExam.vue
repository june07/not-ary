<template>
    <v-container class="h-100 d-flex justify-center" :class="{ 'my-0 py-0': smAndDown }" v-if="scantron">
        <v-sheet width="100%">
            <div class="text-overline d-flex align-center text-no-wrap">exam {{ examId }}<v-divider class="ml-2"></v-divider></div>
            <div class="wrong" v-for="(wrongAnswer, id) of wrongAnswers" :index="id">
                <div v-if="getQuestion(id).order" class="text-overline d-flex align-center text-no-wrap ml-16">Question #{{ getQuestion(id).order }}</div>
                <v-radio-group :model-value="wrongAnswer" readonly>
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
        </v-sheet>
    </v-container>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from "vuetify"
import Hashids from 'hashids'

const hashids = new Hashids('not-ary.com')
const props = defineProps({
    scantron: Object
})
const { smAndDown } = useDisplay()
const totalExamQuestions = computed(() => props.scantron?.totalExamQuestions)
const examId = computed(() => hashids.encode(props.scantron?.timeStarted))
const wrongAnswers = computed(() => props.scantron?.answers && Object.entries(props.scantron.answers)
    .reduce((wrongAnswers, kv) => {
        const id = kv[0]
        const answer = kv[1]
        const wrong = Object.keys(answer)[0]

        if (Object.keys(answer)[0] !== 'wrong') return wrongAnswers
        return { ...wrongAnswers, [id]: Object.values(answer)[0] }
    }, {}))
const questions = computed(() => props.scantron.questions)
const getQuestion = (id) => questions.value.find(q => q.id === id)
const getOptions = (id) => {
    const options = questions.value.find(q => q.id === id)?.options
    return options ? [
        { right: options.right },
        ...options.wrong.map(wrong => ({ wrong }))
    ] : undefined
}
</script>