import { authGuard, createAuth0 } from "@auth0/auth0-vue"

const { VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENTID } =
    import.meta.env

const $auth = createAuth0({
    domain: VITE_AUTH0_DOMAIN,
    clientId: VITE_AUTH0_CLIENTID,
    authorizationParams: {
        redirect_uri: window.location.origin,
    },
})

const signup = async function () {
    await $auth.logout()
    $auth.loginWithRedirect({
        authorizationParams: {
            screen_hint: "signup",
        },
    })
}
const login = function (options = { prompt: "none" }) {
    $auth.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin + "/?returnTo=/account",
            ...options,
        },
    })
}
const logout = function () {
    $auth.logout({
        logoutParams: {
            returnTo: window.location.origin,
        },
    })
    document.cookie = `__secure-session=; Domain=not-ary.com; SameSite=None; Secure; Expires=1181137020;`
}

export default {
    authGuard,
    $auth,
    signup,
    login,
    logout,
}
