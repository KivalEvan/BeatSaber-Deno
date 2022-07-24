import logger from './logger.ts';

const tag = (str: string) => {
    return `[settings::${str}]`;
};

class globals {
    #directory = '';

    /** Global map directory.
     *
     * This will be overriden if directory is specified elsewhere.
     */
    get directory() {
        return this.#directory;
    }
    set directory(value: string) {
        value = value.trim();
        if (!(value.endsWith('\\') || value.endsWith('/'))) {
            logger.debug(tag('directory'), `Adding missing end slash`);
            value += '/';
        }
        if (value === '/') {
            value = './';
        }
        this.#directory = value;
        logger.info(tag('directory'), `Global map directory is set to ${this.#directory}`);
    }

    /** Set logging level to filter various information.
     * ```ts
     * 0 -> Verbose
     * 1 -> Debug
     * 2 -> Info
     * 3 -> Warn
     * 4 -> Error
     * 5 -> None
     * ```
     */
    get logLevel() {
        return logger.logLevel;
    }
    set logLevel(value: number) {
        logger.setLevel(value);
    }
}

/** Global settings. */
export default new globals();
