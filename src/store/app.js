// Utilities
import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
    state: () => ({
        theme: 'light',
        activeState: 'ca',
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
                    submitted: false,
                    inProgress: false
                },
                examsTaken: {}
            }
        }
    }),
    actions: {
        resetScantron() {
            this.states[this.activeState].scantron = {
                timeStarted: undefined,
                timeFinished: undefined,
                timeTotal: 0,
                answers: {},
                currentIndex: 0,
                score: undefined,
                totalExamQuestions: 0,
                submitted: false,
                inProgress: false
            }
        },
        saveScantron() {
            this.states.ca.examsTaken[this.states.ca.scantron.timeFinished] = this.states.ca.scantron
            this.states.ca.freeExamsRemaining = Math.max(3 - Object.keys(this.states[this.activeState].examsTaken).length, 0)
        }
    },
    persist: true,
})
