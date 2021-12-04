class Joke extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.rendered) {
            this.#render();
            this.rendered = true;
        }
    }

    /**
     * Sets the custom element
     */
    #render() {
        const shadow = this.attachShadow({ mode: 'closed' });
        const wrapper = document.createElement('div');
        const setupH2 = this.#setTextElement('h2', this.getAttribute('setup'), 'setup');
        const punchlineH2 = this.#setTextElement('h2', this.getAttribute('punchline'), 'punchline');
        const link = this.#setStyles();

        wrapper.classList.add('joke');
        wrapper.append(setupH2, punchlineH2);
        shadow.append(link, wrapper);
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
     * @returns The link element
     */
    #setStyles() {
        const root = location.href;
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `${root}/styles/style.css`);
        return link;
    }
}

customElements.define('app-joke', Joke);
