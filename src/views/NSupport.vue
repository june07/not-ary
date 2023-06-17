<template>
    <v-container class="d-flex flex-column justify-center" :class="smAndDown ? 'px-0' : ''">
        <div class="text-h5">Support Us</div>
        <v-divider></v-divider>
        <div class="text-body-2 mt-2">Thank you for your support</div>

        <div class="d-flex justify-center my-8">
            <div class="d-flex flex-column grow">
                <v-tooltip location="start" :disabled="smAndDown">
                    <template v-slot:activator="{ props }">
                        <stripe-buy-button v-bind="props" :buy-button-id="VITE_STRIPE_BUY_ID_1" :publishable-key="VITE_STRIPE_PUBLISHABLE_KEY"></stripe-buy-button>
                    </template>
                    <template v-slot:default><img width="300" :src="VITE_STRIPE_BUY_QR_1"></template>
                </v-tooltip>
                <v-tooltip location="start" :disabled="smAndDown">
                    <template v-slot:activator="{ props }">
                        <stripe-buy-button v-bind="props" :buy-button-id="VITE_STRIPE_BUY_ID_5" :publishable-key="VITE_STRIPE_PUBLISHABLE_KEY"></stripe-buy-button>
                    </template>
                    <template v-slot:default><img width="300" :src="VITE_STRIPE_BUY_QR_5"></template>
                </v-tooltip>
                <v-tooltip location="start" :disabled="smAndDown">
                    <template v-slot:activator="{ props }">
                        <stripe-buy-button v-bind="props" :buy-button-id="VITE_STRIPE_BUY_ID_15" :publishable-key="VITE_STRIPE_PUBLISHABLE_KEY"></stripe-buy-button>
                    </template>
                    <template v-slot:default><img width="300" :src="VITE_STRIPE_BUY_QR_15"></template>
                </v-tooltip>
            </div>
            <div v-if="!smAndDown" class="d-flex flex-column">
                <v-tooltip :disabled="smAndDown">
                    <template v-slot:activator="{ props }">
                        <stripe-buy-button v-bind="props" :buy-button-id="VITE_STRIPE_BUY_ID_ONE_TIME" :publishable-key="VITE_STRIPE_PUBLISHABLE_KEY"></stripe-buy-button>
                    </template>
                    <template v-slot:default><img width="300" :src="VITE_STRIPE_BUY_QR_ONE_TIME"></template>
                </v-tooltip>
            </div>
        </div>
        <div v-if="smAndDown" class="d-flex justify-center my-8">
            <v-tooltip :disabled="smAndDown">
                <template v-slot:activator="{ props }">
                    <stripe-buy-button v-bind="props" :buy-button-id="VITE_STRIPE_BUY_ID_ONE_TIME" :publishable-key="VITE_STRIPE_PUBLISHABLE_KEY"></stripe-buy-button>
                </template>
                <template v-slot:default><img width="300" :src="VITE_STRIPE_BUY_QR_ONE_TIME"></template>
            </v-tooltip>
        </div>

        <div :class="smAndDown ? 'mx-4' : ''">
            <p class="my-8">
                Your generous contribution will help us continue the development and maintenance of Not-ary.com. Here's how your
                donation will be used:
            <ol class="my-4" :class="smAndDown ? 'mx-8 text-caption' : ''">
                <li><b>Enhancing the Website:</b> We are dedicated to continually improving notary-exam.com by adding new features, improving the user experience, and expanding the content to cover a wider range of topics related to the Notary Exams. Your support will enable us to invest in the necessary resources and tools to make the website even better.</li>

                <li><b>Content Creation:</b> Developing high-quality practice exams requires time and effort. With your contribution, we can allocate resources to create in-depth study resources that will benefit notary exam candidates in their preparation journey.</li>

                <li><b>Technical Upgrades and Maintenance:</b> Technology is constantly evolving, and it is crucial for us to stay up-to-date to provide a seamless experience for our users. Your support will help us invest in technical upgrades, server maintenance, and security enhancements to ensure that notary-exam.com remains accessible and reliable for all users.</li>

                <li><b>Server and Hosting Costs:</b> Running a website involves ongoing expenses for server hosting, domain registration, and bandwidth. Your donation will help cover these operational costs, ensuring that notary-exam.com remains available to users around the world.</li>
            </ol>
            <p class="my-8">
                Your donation, no matter the size, will make a significant impact in supporting the growth and development of Not-ary.com. I am grateful for your support in our mission to provide valuable resources to aspiring notaries.</p>
            <p class="my-8">
                Thank you for being a part of the Not-ary.com community!</p>
            <p class="my-8">Best regards,</p>
            <p class="my-2">Adrian Wardell</p>
            <p class="my-2">Founder, Not-ary.com</p>
            </p>
        </div>
    </v-container>
</template>
<script setup>
import { onMounted } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

const {
    VITE_STRIPE_PUBLISHABLE_KEY,
    VITE_STRIPE_BUY_ID_1,
    VITE_STRIPE_BUY_QR_1,
    VITE_STRIPE_BUY_ID_5,
    VITE_STRIPE_BUY_QR_5,
    VITE_STRIPE_BUY_ID_15,
    VITE_STRIPE_BUY_QR_15,
    VITE_STRIPE_BUY_ID_ONE_TIME,
    VITE_STRIPE_BUY_QR_ONE_TIME
} = import.meta.env

onMounted(() => {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/buy-button.js'
    script.async = true
    document.head.appendChild(script)
})
</script>
