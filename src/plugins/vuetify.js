/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
// import 'vuetify/styles';
import '@/settings.scss'

// Composables
import { createVuetify } from 'vuetify';
import { aliases, md } from 'vuetify/iconsets/md';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md
        }
    },
    theme: {
        themes: {
            light: {
                colors: {
                    'primary-darken-3': '#000E14',
                    'primary-darken-2': '#001B29',
                    'primary-darken-1': '#00283D',
                    'primary': '#003049',
                    'primary-lighten-1': '#004266',
                    'primary-lighten-2': '#00507a',
                    'primary-lighten-3': '#005d8f',
                    'secondary': '#C1121F',
                    'tertiary': '#669BBC',
                    'quaternary': '#FDF0D5'
                },
            },
        },
    },
    components: {
        ...components,
        VDataTable,
        VSkeletonLoader
    },
    directives,
});
