/**
 * filters.js
 * Small helper utilities for filtering and deriving metadata from the programs list.
 *
 * Usage (ES module):
 * import { filterByQuery, filterByLanguage, uniqueLanguages } from './filters.js';
 */

/**
 * Filter a list of program objects by a free-text query.
 * Matches title, description, and language (case-insensitive).
 * @param {Array<{id:string,title:string,description:string,lang:string}>} list
 * @param {string} query
 * @returns {Array} filtered list
 */
export function filterByQuery(list, query) {
  if (!query) return Array.from(list);
  const q = String(query).trim().toLowerCase();
  return list.filter(p =>
    (p.title && p.title.toLowerCase().includes(q)) ||
    (p.description && p.description.toLowerCase().includes(q)) ||
    (p.lang && p.lang.toLowerCase().includes(q))
  );
}

/**
 * Filter by language. If lang is falsy or "all", returns original list.
 * @param {Array} list
 * @param {string} lang
 * @returns {Array}
 */
export function filterByLanguage(list, lang) {
  if (!lang || lang.toLowerCase() === 'all') return Array.from(list);
  const target = lang.toLowerCase();
  return list.filter(p => (p.lang || '').toLowerCase() === target);
}

/**
 * Return a sorted array of unique languages present in the list.
 * @param {Array} list
 * @returns {Array<string>}
 */
export function uniqueLanguages(list) {
  const set = new Set();
  for (const p of list) {
    if (p && p.lang) set.add(p.lang);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
