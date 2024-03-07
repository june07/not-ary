<template>
    <v-card :max-width="smAndDown ? '95vw' : undefined" class="pa-8 mt-8" rounded="xl" :elevation="smAndDown ? 0 : 1">
        <p class="font-weight-bold text-caption">Not-Ary.com is enabled by a single developer. Please consider giving.</p>
        <div class="my-8">
            <v-row v-for="coin of crypto" class="text-caption">
                <v-col :cols="2" class="py-0 text-end">{{ smAndDown ? coin.abr : coin.name }}</v-col>
                <v-col :cols="10" class="py-0" :style="smAndDown ? 'font-size: smaller' : ''">{{ coin.address }}</v-col>
            </v-row>
        </div>
        <div class="d-flex" :class="smAndDown ? 'justify-center mb-n8' : 'justify-end'">
            <v-btn name="paypal-recurring" href="https://www.paypal.com/donate/?hosted_button_id=CKAXEZWZDP8DC" target="_blank" rel="noreferrer" text="paypal" class="mr-5" variant="outlined" density="compact" color="blue" />
        </div>
        <iframe :style="smAndDown ? 'transform: scale(0.6); transform-origin: left; margin-left: -20px' : ''" src="https://github.com/sponsors/june07/card" title="Sponsor june07" height="225" width="600" style="border: 0;"></iframe>
    </v-card>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { smAndDown } = useDisplay()
const crypto = [
    { name: 'Bitcoin', abr: 'BTC', address: 'bc1q4kwrjnx3h0v894vlp6d9l3efwv0jtddnjukrpm' },
    { name: 'Ethereum', abr: 'ETH', address: '0x69F3C9210091A0E5cb7D01459683447173D4BDDA' },
    { name: 'Tron', abr: 'TRX', address: 'TSnfddQqAkFRZFabL5LnHWCu3qNZLv2p7G' },
]
</script>