class Joke extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (!this.rendered) {
            this.#setStyles();
            this.#render();
            this.rendered = true;
        }
    }

    /**
     * Sets the custom element
     */
    #render() {
        const wrapper = document.createElement('div');
        const setupH2 = this.#setTextElement('h2', this.getAttribute('setup'), 'setup');
        const punchlineH2 = this.#setTextElement('h2', this.getAttribute('punchline'), 'punchline');
        wrapper.classList.add('joke');
        wrapper.append(setupH2, punchlineH2);
        this.shadowRoot.append(wrapper);
    }

    /**
     * Sets an h2 tag containing any given text
     * @param {string} tag The tag
     * @param {string} text The text
     * @param {string} [className = undefined] The class name
     * @returns The h2 tag
     */
    #setTextElement(tag, text, className) {
        const element = document.createElement(tag);
        element.classList.add(className);
        element.innerText = text;
        return element;
    }

    /**
     * Sets a link element for the styles
     */
    #setStyles() {
        const root = location.href;
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `${root}/styles/style.css`);
        this.shadowRoot.append(link);
    }
}

customElements.define('app-joke', Joke);
