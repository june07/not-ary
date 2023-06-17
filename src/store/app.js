// Utilities
import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
    state: () => ({
        theme: 'light',
        states: {
            ca: {
                name: 'California',
                lastUpdate: undefined,
                data: undefined,
                scantron: {
                    timeStarted: undefined,
                    timeFinished: undefined,
                    timeTotal: 0,
                    answers: {},
                    currentIndex: 0,
                    score: undefined,
                    totalExamQuestions: 0,
                    submitted: false
                },
                examsTaken: {}
            }
        }
    }),
    actions: {
        resetScantron() {
            this.states.ca.scantron = {
                timeStarted: undefined,
                timeFinished: undefined,
                timeTotal: 0,
                answers: {},
                currentIndex: 0
            }
        },
        saveScantron() {
            this.states.ca.examsTaken[this.states.ca.scantron.timeFinished] = this.states.ca.scantron
        }
    },
    persist: true,
})
