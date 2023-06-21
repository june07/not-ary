<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :density="density" variant="text" :size="size" :icon="icon" :color="color">
                <slot><v-icon size="small">share</v-icon></slot>
            </v-btn>
        </template>
        <v-list class="rounded-xl">
            <v-list-item v-for="type in networks" :key="type.network" density="compact">
                <ShareNetwork :url="url" :network="type.network" :title="title" :description="data.sharing.description" :quote="data.sharing.quote" :hashtags="data.sharing.hashtags" :twitterUser="data.sharing.twitterUser">
                    <v-icon class="mr-2" :color="type.color" v-if="!type.network.match(/twitter|whatsapp/)">
                        <span class="material-icons">{{ type.icon }}</span>
                    </v-icon>
                    <icon-base class="mr-2" v-else :icon-name="type.name">
                        <icon-twitter v-if="type.network.match(/twitter/)"></icon-twitter>
                        <icon-whatsapp v-if="type.network.match(/whatsapp/)"></icon-whatsapp>
                    </icon-base>
                    <span>{{ type.name }}</span>
                </ShareNetwork>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
<style scoped>
a {
    text-decoration: none !important;
}
</style>
<script setup>
import { computed } from 'vue'
import { ShareNetwork } from 'vue-social-sharing'

import IconBase from './IconBase'
import IconTwitter from './IconTwitter'
import IconWhatsapp from './IconWhatsapp'

const props = defineProps({
    url: {
        type: String,
        default: document.location.origin
    },
    size: String,
    icon: Boolean,
    color: String,
    title: String,
    density: String
})
defineEmits(['copy'])
const networks = computed(() => data.networks)
const title = computed(() => props.title || 'Not-Ary.com')

const data = {
    sharing: {
        description: 'Level up your skills, stay updated with the latest laws, and master the art of notarization.',
        quote: 'Share and help others ace the exam with confidence!',
        hashtags: '#Notary,#NotaryPublic,#NotaryServices,#MobileNotary,#NotaryLife,#NotarySigningAgent,#NotaryStamp,#Notarization,#LegalServices,#DocumentSigning,#CertifiedNotary,#NotaryCommunity,#NotaryLove,#NotaryBusiness,#NotaryLifeBalance',
        twitterUser: "june07",
    },
    networks: [
        {
            network: "email",
            name: "Email",
            icon: "email",
            color: "#333333",
        },
        {
            network: "facebook",
            name: "Facebook",
            icon: "facebook",
            color: "#1877f2",
        },
        {
            network: "sms",
            name: "SMS",
            icon: "sms",
            color: "#333333",
        },
        {
            network: "twitter",
            name: "Twitter",
            icon: "",
            color: "#1da1f2",
        },
        {
            network: "whatsapp",
            name: "Whatsapp",
            icon: "",
            color: "#25d366",
        },
    ],
}
</script>
