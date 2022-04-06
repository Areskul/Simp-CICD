import colors from "picocolors";
import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL, URL } from "url";
import resolve from "resolve";
import { builtinModules } from "module";
import type { FSWatcher } from "chokidar";
import { performance } from "perf_hooks";
import { parse as parseUrl, URLSearchParams } from "url";

export function slash(p: string): string {
  return p.replace(/\\/g, "/");
}

// Strip valid id prefix. This is prepended to resolved Ids that are
// not valid browser import specifiers by the importAnalysis plugin.

export const flattenId = (id: string): string =>
  id.replace(/(\s*>\s*)/g, "__").replace(/[\/\.:]/g, "_");

export const normalizeId = (id: string): string =>
  id.replace(/(\s*>\s*)/g, " > ");

//TODO: revisit later to see if the edge case that "compiling using node v12 code to be run in node v16 in the server" is what we intend to support.
const builtins = new Set([
  ...builtinModules,
  "assert/strict",
  "diagnostics_channel",
  "dns/promises",
  "fs/promises",
  "path/posix",
  "path/win32",
  "readline/promises",
  "stream/consumers",
  "stream/promises",
  "stream/web",
  "timers/promises",
  "util/types",
  "wasi"
]);

export function isBuiltin(id: string): boolean {
  return builtins.has(id.replace(/^node:/, ""));
}

export function moduleListContains(
  moduleList: string[] | undefined,
  id: string
): boolean | undefined {
  return moduleList?.some((m) => m === id || id.startsWith(m + "/"));
}

export const bareImportRE = /^[\w@](?!.*:\/\/)/;
export const deepImportRE = /^([^@][^/]*)\/|^(@[^/]+\/[^/]+)\//;

export let isRunningWithYarnPnp: boolean;
try {
  isRunningWithYarnPnp = Boolean(require("pnpapi"));
} catch {}

const ssrExtensions = [".js", ".cjs", ".json", ".node"];

// set in bin/vite.js
const filter = process.env.VITE_DEBUG_FILTER;

const DEBUG = process.env.DEBUG;

interface DebuggerOptions {
  onlyWhenFocused?: boolean | string;
}

export type ViteDebugScope = `vite:${string}`;

export const isWindows = os.platform() === "win32";

const VOLUME_RE = /^[A-Z]:/i;

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

/**
 * Check if dir is a parent of file
 *
 * Warning: parameters are not validated, only works with normalized absolute paths
 *
 * @param dir - normalized absolute path
 * @param file - normalized absolute path
 * @returns true if dir is a parent of file
 */
export function ensureVolumeInPath(file: string): string {
  return isWindows ? path.resolve(file) : file;
}

export const queryRE = /\?.*$/s;
export const hashRE = /#.*$/s;

export const cleanUrl = (url: string): string =>
  url.replace(hashRE, "").replace(queryRE, "");

export const externalRE = /^(https?:)?\/\//;
export const isExternalUrl = (url: string): boolean => externalRE.test(url);

export const dataUrlRE = /^\s*data:/i;
export const isDataUrl = (url: string): boolean => dataUrlRE.test(url);

export const virtualModuleRE = /^virtual-module:.*/;
export const virtualModulePrefix = "virtual-module:";

const knownJsSrcRE = /\.((j|t)sx?|mjs|vue|marko|svelte|astro)($|\?)/;
export const isJSRequest = (url: string): boolean => {
  url = cleanUrl(url);
  if (knownJsSrcRE.test(url)) {
    return true;
  }
  if (!path.extname(url) && !url.endsWith("/")) {
    return true;
  }
  return false;
};

const knownTsRE = /\.(ts|mts|cts|tsx)$/;
const knownTsOutputRE = /\.(js|mjs|cjs|jsx)$/;
export const isTsRequest = (url: string) => knownTsRE.test(cleanUrl(url));
export const isPossibleTsOutput = (url: string) =>
  knownTsOutputRE.test(cleanUrl(url));
export function getPotentialTsSrcPaths(filePath: string) {
  const [name, type, query = ""] = filePath.split(
    /(\.(?:[cm]?js|jsx))(\?.*)?$/
  );
  const paths = [name + type.replace("js", "ts") + query];
  if (!type.endsWith("x")) {
    paths.push(name + type.replace("js", "tsx") + query);
  }
  return paths;
}

const importQueryRE = /(\?|&)import=?(?:&|$)/;
const trailingSeparatorRE = /[\?&]$/;
export const isImportRequest = (url: string): boolean =>
  importQueryRE.test(url);
export function removeImportQuery(url: string): string {
  return url.replace(importQueryRE, "$1").replace(trailingSeparatorRE, "");
}

export function injectQuery(url: string, queryToInject: string): string {
  // encode percents for consistent behavior with pathToFileURL
  // see #2614 for details
  let resolvedUrl = new URL(url.replace(/%/g, "%25"), "relative:///");
  if (resolvedUrl.protocol !== "relative:") {
    resolvedUrl = pathToFileURL(url);
  }
  let { protocol, pathname, search, hash } = resolvedUrl;
  if (protocol === "file:") {
    pathname = pathname.slice(1);
  }
  pathname = decodeURIComponent(pathname);
  return `${pathname}?${queryToInject}${search ? `&` + search.slice(1) : ""}${
    hash ?? ""
  }`;
}

const timestampRE = /\bt=\d{13}&?\b/;
export function removeTimestampQuery(url: string): string {
  return url.replace(timestampRE, "").replace(trailingSeparatorRE, "");
}

export async function asyncReplace(
  input: string,
  re: RegExp,
  replacer: (match: RegExpExecArray) => string | Promise<string>
): Promise<string> {
  let match: RegExpExecArray | null;
  let remaining = input;
  let rewritten = "";
  while ((match = re.exec(remaining))) {
    rewritten += remaining.slice(0, match.index);
    rewritten += await replacer(match);
    remaining = remaining.slice(match.index + match[0].length);
  }
  rewritten += remaining;
  return rewritten;
}

export function timeFrom(start: number, subtract = 0): string {
  const time: number | string = performance.now() - start - subtract;
  const timeString = (time.toFixed(2) + `ms`).padEnd(5, " ");
  if (time < 10) {
    return colors.green(timeString);
  } else if (time < 50) {
    return colors.yellow(timeString);
  } else {
    return colors.red(timeString);
  }
}

/**
 * pretty url for logging.
 */
export function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value != null;
}

interface LookupFileOptions {
  pathOnly?: boolean;
  rootDir?: string;
}

export function lookupFile(
  dir: string,
  formats: string[],
  options?: LookupFileOptions
): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return options?.pathOnly ? fullPath : fs.readFileSync(fullPath, "utf-8");
    }
  }
  const parentDir = path.dirname(dir);
  if (
    parentDir !== dir &&
    (!options?.rootDir || parentDir.startsWith(options?.rootDir))
  ) {
    return lookupFile(parentDir, formats, options);
  } else {
    return undefined;
  }
}

const splitRE = /\r?\n/;

const range: number = 2;

export function pad(source: string, n = 2): string {
  const lines = source.split(splitRE);
  return lines.map((l) => ` `.repeat(n) + l).join(`\n`);
}

export function posToNumber(
  source: string,
  pos: number | { line: number; column: number }
): number {
  if (typeof pos === "number") return pos;
  const lines = source.split(splitRE);
  const { line, column } = pos;
  let start = 0;
  for (let i = 0; i < line - 1; i++) {
    if (lines[i]) {
      start += lines[i].length + 1;
    }
  }
  return start + column;
}

export function numberToPos(
  source: string,
  offset: number | { line: number; column: number }
): { line: number; column: number } {
  if (typeof offset !== "number") return offset;
  if (offset > source.length) {
    throw new Error(
      `offset is longer than source length! offset ${offset} > length ${source.length}`
    );
  }
  const lines = source.split(splitRE);
  let counted = 0;
  let line = 0;
  let column = 0;
  for (; line < lines.length; line++) {
    const lineLength = lines[line].length + 1;
    if (counted + lineLength >= offset) {
      column = offset - counted + 1;
      break;
    }
    counted += lineLength;
  }
  return { line: line + 1, column };
}

export function generateCodeFrame(
  source: string,
  start: number | { line: number; column: number } = 0,
  end?: number
): string {
  start = posToNumber(source, start);
  end = end || start;
  const lines = source.split(splitRE);
  let count = 0;
  const res: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue;
        const line = j + 1;
        res.push(
          `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${
            lines[j]
          }`
        );
        const lineLength = lines[j].length;
        if (j === i) {
          // push underline
          const pad = start - (count - lineLength) + 1;
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start
          );
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + 1;
        }
      }
      break;
    }
  }
  return res.join("\n");
}

export function writeFile(
  filename: string,
  content: string | Uint8Array
): void {
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filename, content);
}

/**
 * Use instead of fs.existsSync(filename)
 * #2051 if we don't have read permission on a directory, existsSync() still
 * works and will result in massively slow subsequent checks (which are
 * unnecessary in the first place)
 */
export function isFileReadable(filename: string): boolean {
  try {
    const stat = fs.statSync(filename, { throwIfNoEntry: false });
    return !!stat;
  } catch {
    return false;
  }
}

/**
 * Delete every file and subdirectory. **The given directory must exist.**
 * Pass an optional `skip` array to preserve files in the root directory.
 */
export function emptyDir(dir: string, skip?: string[]): void {
  for (const file of fs.readdirSync(dir)) {
    if (skip?.includes(file)) {
      continue;
    }
    const abs = path.resolve(dir, file);
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs);
      fs.rmdirSync(abs);
    } else {
      fs.unlinkSync(abs);
    }
  }
}

export function copyDir(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    if (srcFile === destDir) {
      continue;
    }
    const destFile = path.resolve(destDir, file);
    const stat = fs.statSync(srcFile);
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

export function ensureWatchedFile(
  watcher: FSWatcher,
  file: string | null,
  root: string
): void {
  if (
    file &&
    // only need to watch if out of root
    !file.startsWith(root + "/") &&
    // some rollup plugins use null bytes for private resolved Ids
    !file.includes("\0") &&
    fs.existsSync(file)
  ) {
    // resolve file to normalized system path
    watcher.add(path.resolve(file));
  }
}

interface ImageCandidate {
  url: string;
  descriptor: string;
}
const escapedSpaceCharacters = /( |\\t|\\n|\\f|\\r)+/g;
export async function processSrcSet(
  srcs: string,
  replacer: (arg: ImageCandidate) => Promise<string>
): Promise<string> {
  const imageCandidates: ImageCandidate[] = srcs
    .split(",")
    .map((s) => {
      const [url, descriptor] = s
        .replace(escapedSpaceCharacters, " ")
        .trim()
        .split(" ", 2);
      return { url, descriptor };
    })
    .filter(({ url }) => !!url);

  const ret = await Promise.all(
    imageCandidates.map(async ({ url, descriptor }) => {
      return {
        url: await replacer({ url, descriptor }),
        descriptor
      };
    })
  );

  return ret.reduce((prev, { url, descriptor }, index) => {
    descriptor ??= "";
    return (prev +=
      url + ` ${descriptor}${index === ret.length - 1 ? "" : ", "}`);
  }, "");
}

function escapeToLinuxLikePath(path: string) {
  if (/^[A-Z]:/.test(path)) {
    return path.replace(/^([A-Z]):\//, "/windows/$1/");
  }
  if (/^\/[^/]/.test(path)) {
    return `/linux${path}`;
  }
  return path;
}

function unescapeToLinuxLikePath(path: string) {
  if (path.startsWith("/linux/")) {
    return path.slice("/linux".length);
  }
  if (path.startsWith("/windows/")) {
    return path.replace(/^\/windows\/([A-Z])\//, "$1:/");
  }
  return path;
}

export function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target];
}

export function toUpperCaseDriveLetter(pathName: string): string {
  return pathName.replace(/^\w:/, (letter) => letter.toUpperCase());
}

export const multilineCommentsRE = /\/\*(.|[\r\n])*?\*\//gm;
export const singlelineCommentsRE = /\/\/.*/g;

export const usingDynamicImport = "undefined";
/**
 * Dynamically import files. It will make sure it's not being compiled away by TS/Rollup.
 *
 * As a temporary workaround for Jest's lack of stable ESM support, we fallback to require
 * if we're in a Jest environment.
 * See https://github.com/vitejs/vite/pull/5197#issuecomment-938054077
 *
 * @param file File path to import.
 */
export const dynamicImport = usingDynamicImport
  ? new Function("file", "return import(file)")
  : require;

export function parseRequest(id: string): Record<string, string> | null {
  const { search } = parseUrl(id);
  if (!search) {
    return null;
  }
  return Object.fromEntries(new URLSearchParams(search.slice(1)));
}

export const blankReplacer = (match: string) => " ".repeat(match.length);
