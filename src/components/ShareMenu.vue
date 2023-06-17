<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" :size="size" :icon="icon" :color="color">
                <slot></slot>
            </v-btn>
        </template>
        <v-list class="rounded-xl">
            <v-list-item v-for="type in data.networks" :key="type.network" density="compact">
                <v-btn :size="size" variant="text" @click="$emit('copy')" v-if="type.network === 'copy'">
                    <v-icon class="mr-2" small>content_copy</v-icon>{{ type.name }}
                </v-btn>
                <v-btn :size="size" variant="text" :href="url" target="_blank" rel="noopener" v-else-if="type.network === 'tab'">
                    <v-icon class="mr-2" small>tab</v-icon>{{ type.name }}
                </v-btn>
                <ShareNetwork v-else url="https://blog.not-ary.com" :network="type.network" :title="data.sharing.title"
                    :description="data.sharing.description" :quote="data.sharing.quote" :hashtags="data.sharing.hashtags"
                    :twitterUser="data.sharing.twitterUser">
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
import { ShareNetwork } from 'vue-social-sharing';

import IconBase from './IconBase';
import IconTwitter from './IconTwitter';
import IconWhatsapp from './IconWhatsapp';

defineProps({
    url: String,
    copy: String,
    size: String,
    icon: Boolean,
    color: String,
});
defineEmits(['copy'])
const data = {
    sharing: {
        title: 'shareTitle',
        description: 'shareDescription',
        quote: 'shareQuote',
        hashtags: 'shareHashtags',
        twitterUser: "june07",
    },
    networks: [
        {
            network: "tab",
            name: "Open Tab",
            icon: "tab",
        },
        {
            network: "copy",
            name: "Copy Link",
            icon: "content_copy",
        },
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
};
</script>
