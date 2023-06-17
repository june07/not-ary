class Clipboard {
    constructor() {
        this.debounce = false
    }
    async copy(text) {
        let self = this;
        if (self.debounce) return;
        self.debounce = true;
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.log({error});
            self.debounce = false;
        }
        setTimeout(() => {
            self.debounce = false;
        }, 100);
    }    
}

export default new Clipboard()