<template>
    <v-container class="d-flex justify-center fill-height" :class="smAndDown ? 'px-0' : ''">
        <exam-history></exam-history>
    </v-container>
</template>
<script setup>
import { useDisplay } from "vuetify"

import ExamHistory from '../components/ExamHistory.vue'

const { smAndDown } = useDisplay()
</script>
