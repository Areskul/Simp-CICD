import type { Config } from "@type/index";
export declare const useHooks: (config?: Config | undefined) => {
    makeHook: (config: Config) => void;
    printHooks: () => void;
    build: () => Promise<void>;
    generateOutputs: (bundle: any) => Promise<void>;
};
/**
 * Parses the config and sets git hooks
 * @param {string} projectRootPath
 * @param {string[]} [argv]
 */
declare function setHooksFromConfig(config: any): void;
/**
 * Creates or replaces an existing executable script in .git/hooks/<hook> with provided command
 * @param {string} hook
 * @param {string} command
 * @param {string} projectRoot
 * @private
 */
declare function setHook(hook: any, command: any): void;
/**
 * Deletes all git hooks
 * @param {string} projectRoot
 */
declare function removeHooks(): void;
/**
 * Removes the pre-commit hook from .git/hooks
 * @param {string} hook
 * @param {string} projectRoot
 * @private
 */
declare function removeHook(hook: any): void;
export { setHooksFromConfig, setHook, removeHooks, removeHook };
