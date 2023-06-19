import GhostContentAPI from '@tryghost/content-api'

const { VITE_APP_API_URL, VITE_APP_CONTENT_API_KEY } = import.meta.env;
const re = /notaryexam-([a-zA-Z0-9_.&/]*)(?:-([a-zA-Z0-9_]*))?/;

class GhostPlugin {
    constructor() {
        this.api = new GhostContentAPI({
            url: VITE_APP_API_URL,
            key: VITE_APP_CONTENT_API_KEY,
            version: "v5.46.1"
        })
    }
    async getQuestionsMeta(retry = 0) {
        try {
            let tags = await this.browseTags()
            tags = tags.filter(tag => tag.name.match(re))
            if (process.env.NODE_ENV !== 'production') tags.map(tag => console.log('tag: ', tag.name, tag))
            this.meta = {
                states: tags.reduce((states, tag) => ({ ...states, [tag.name.match(re)?.[1]]: tag.slug }), {})
            }
            if (process.env.NODE_ENV !== 'production') console.log(this.meta);
            return this.meta
        } catch (error) {
            if (retry < 3) {
                retry += 1
                return this.getQuestionsMeta(retry);
            }
        }
    }
    async getQuestions(state, retry = 0) {
        await this.getQuestionsMeta();
        const stateSlug = this.meta.states[state];

        try {
            let filter = `tag:${stateSlug}`
            let posts = await this.api.posts.browse({ filter, limit: 'all' })
            
            return posts.map(post => ({
                id: post.id,
                title: post.title,
                image: post.feature_image,
                html: post.html
            }))
        } catch (err) {
            if (retry < 3) {
                retry += 1
                return this.getQuestionsMeta(state, retry);
            }
            console.error(err);
        }
    }
    async get(slug, retry = 0) {
        try {
            let post = await this.api.posts.read({ slug })
            return post
        } catch (error) {
            if (retry < 3) {
                retry += 1;
                return this.get(slug, retry);
            }
            console.error(error)
        }
    }
    async browseTags(filter, retry = 0) {
        try {
            let tags = await this.api.tags.browse({ filter })
            return tags
        } catch (error) {
            if (retry < 3) {
                retry += 1;
                return this.browseTags(filter, retry);
            }
            console.error(error)
        }
    }
}

export default {
    async install(app) {
        app.config.globalProperties.$ghost = new GhostPlugin();
    }
};