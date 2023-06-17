/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import auth from './auth';
import vuetify from './vuetify';
import pinia from '../store';
import router from '../router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import api from './api';
import ghost from './ghost.plugin';
import clipboard from './clipboard.plugin';

pinia.use(piniaPluginPersistedstate);

export function registerPlugins(app) {
    app
        .use(ghost)
        .use(auth.$auth)
        .use(vuetify)
        .use(pinia)
        .use(router)
        .use(api);
    
    app.provide('hasRole', auth.hasRole);
    app.provide('signup', auth.signup);
    app.provide('login', auth.login);
    app.provide('loginFresh', () => auth.login({ prompt: 'login' }));
    app.provide('logout', auth.logout);
    app.provide('clipboard', clipboard);
}
