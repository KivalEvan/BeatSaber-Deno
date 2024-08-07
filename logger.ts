// deno-lint-ignore-file no-explicit-any
// i got super annoyed about dependencies that i decided to yoink it from deno
function getCode(open: number, close: number) {
   return {
      open: `\x1b[${open}m`,
      close: `\x1b[${close}m`,
      regexp: new RegExp(`\\x1b\\[${close}m`, 'g'),
   };
}

function run(str: string, code: ReturnType<typeof getCode>): string {
   return `${code.open}${str.replace(code.regexp, code.open)}${code.close}`;
}

function yellow(str: string): string {
   return run(str, getCode(33, 39));
}

function red(str: string): string {
   return run(str, getCode(31, 39));
}

function dim(str: string): string {
   return run(str, getCode(2, 22));
}

enum LogLevels {
   VERBOSE,
   DEBUG,
   INFO,
   WARN,
   ERROR,
   NONE,
}

// really simple logger
export class Logger {
   static readonly LogLevels = LogLevels;

   static LogPrefixes: Map<LogLevels, string> = new Map<LogLevels, string>([
      [LogLevels.VERBOSE, 'VERBOSE'],
      [LogLevels.DEBUG, 'DEBUG'],
      [LogLevels.INFO, 'INFO'],
      [LogLevels.WARN, yellow('WARN')],
      [LogLevels.ERROR, red('!!ERROR!!')],
      [LogLevels.NONE, 'NONE'],
   ]);

   #logLevel = LogLevels.INFO;
   #tagPrint: (tags: string[], level: LogLevels) => string = (tags, level) =>
      `${Logger.LogPrefixes.get(level)} ${dim('>')} [${dim(tags.join('::'))}]`;
   #untagged = 'script';

   set logLevel(value: LogLevels) {
      this.#logLevel = value;
      this.tInfo(
         ['logger', 'logLevel'],
         `Log level set to ${Logger.LogPrefixes.get(value)}`,
      );
   }
   get logLevel(): LogLevels {
      return this.#logLevel;
   }

   set tagPrint(fn: (tags: string[], level: LogLevels) => string) {
      this.#tagPrint = fn;
      this.tInfo(['logger', 'tagPrint'], `Update tag print function`);
   }
   get tagPrint(): (tags: string[], level: LogLevels) => string {
      return this.#tagPrint;
   }

   set untagged(value: string) {
      this.#untagged = value.trim();
      this.tInfo(
         ['logger', 'untagged'],
         `Update untagged string to ${this.#untagged}`,
      );
   }
   get untagged(): string {
      return this.#untagged;
   }

   private log(level: LogLevels, tags: string[], args: any[]) {
      if (level < this.#logLevel) return;

      const tag = this.tagPrint(tags, level);
      if (tag) args.unshift(tag);

      switch (level) {
         case LogLevels.DEBUG:
            return console.debug(...args);
         case LogLevels.INFO:
            return console.info(...args);
         case LogLevels.WARN:
            return console.warn(...args);
         case LogLevels.ERROR:
            return console.error(...args);
         default:
            return console.log(...args);
      }
   }

   /**
    * Set logging level to filter various information.
    * ```ts
    * 0 -> Verbose
    * 1 -> Debug
    * 2 -> Info
    * 3 -> Warn
    * 4 -> Error
    * 5 -> None
    * ```
    */
   setLevel(level: LogLevels) {
      level = Math.min(Math.max(level, 0), 5);
      this.#logLevel = level;
      this.tInfo(
         ['logger', 'setLevel'],
         `Log level set to ${Logger.LogPrefixes.get(level)}`,
      );
   }

   tVerbose(tags: string[], ...args: any[]) {
      this.log(LogLevels.VERBOSE, tags, args);
   }

   tDebug(tags: string[], ...args: any[]) {
      this.log(LogLevels.DEBUG, tags, args);
   }

   tInfo(tags: string[], ...args: any[]) {
      this.log(LogLevels.INFO, tags, args);
   }

   tWarn(tags: string[], ...args: any[]) {
      this.log(LogLevels.WARN, tags, args);
   }

   tError(tags: string[], ...args: any[]) {
      this.log(LogLevels.ERROR, tags, args);
   }

   verbose(...args: any[]) {
      this.tVerbose([this.#untagged], ...args);
   }

   debug(...args: any[]) {
      this.tDebug([this.#untagged], ...args);
   }

   info(...args: any[]) {
      this.tInfo([this.#untagged], ...args);
   }

   warn(...args: any[]) {
      this.tWarn([this.#untagged], ...args);
   }

   error(...args: any[]) {
      this.tError([this.#untagged], ...args);
   }
}

const globalLog: Logger = new Logger();
/** Simple logging system. */
export default globalLog;
