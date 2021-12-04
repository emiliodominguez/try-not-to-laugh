import FaceApiService from './face-api.service.js';
import JokesService from './jokes.service.js';

export default class GameService {
    #jokesWrapper;
    #video;
    #jokesService;
    #faceApiService;
    #gameConfig;

    /**
     * The game service
     */
    constructor() {
        this.#jokesWrapper = document.querySelector('#jokes-wrapper');
        this.#video = document.querySelector('#video');
        this.#jokesService = new JokesService();
        this.#faceApiService = new FaceApiService(this.#video);
        this.#gameConfig = Object.seal({
            initialized: false,
            jokesAmount: 5,
            jokesDuration: 10, // seconds
            happinessThreshold: 0.85, // 0 - 1
            won: false
        });

        // Sets the custom property for the punchline reveal animation delay
        document.documentElement.style.setProperty(
            '--punchline-reveal',
            `${(this.#gameConfig.jokesDuration / 3) * 1000}ms`
        );
    }

    /**
     * Initializes the game
     */
    async init() {
        const jokes = this.#jokesService.getRandomJokes(this.#gameConfig.jokesAmount);

        this.#gameConfig.initialized = true;
        document.body.classList.add('game-initialized');

        for (const joke of jokes) {
            this.#jokesWrapper.innerHTML = '';

            const passed = await this.#setJoke(joke);

            if (!passed) {
                this.#gameConfig = { ...this.#gameConfig, initialized: false };
                break;
            }
        }

        this.#jokesWrapper.innerHTML = '';
        this.#gameConfig = { ...this.#gameConfig, initialized: false };
        document.body.classList.remove('game-initialized');
    }

    /**
     * Sets the current joke
     * @param {Object} joke The joke
     * @param {number} joke.id The joke's id
     * @param {string} joke.type The joke's type
     * @param {string} joke.setup The joke's setup
     * @param {string} joke.punchline The joke's punchline
     * @returns A promise that resolves true or false depending if the player laughs or not
     */
    #setJoke(joke) {
        return new Promise((resolve, _) => {
            const jokeElement = document.createElement('app-joke');
            jokeElement.setAttribute('setup', joke.setup);
            jokeElement.setAttribute('punchline', joke.punchline);
            this.#jokesWrapper.append(jokeElement);

            // The joke passes after 3 seconds
            let timeout = setTimeout(() => {
                resolve(true);
                clearInterval(interval);
            }, this.#gameConfig.jokesDuration * 1000);

            // Get face recognition detections, if happiness is over 0.85 the player loses
            let interval = setInterval(() => {
                const detections = this.#faceApiService.detections;

                if (detections.length > 0 && detections[0].expressions) {
                    if (detections[0].expressions.happy > this.#gameConfig.happinessThreshold) {
                        clearTimeout(timeout);
                        clearInterval(interval);
                        resolve(false);
                    }
                }
            }, 100);
        });
    }
}
