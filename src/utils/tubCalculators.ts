import type { DocumentData } from "firebase/firestore";
import type { TubInterface } from "../interfaces/tubInterface";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function calculateLanguagePairs(
  rawWords: DocumentData[]
): TubInterface[] {
  const pairsMap: Record<string, { count: number; ids: string[] }> = {};
  rawWords.forEach(({ fromLanguage, toLanguage, id }) => {
    const pairKey = `${fromLanguage.trim()} - ${toLanguage.trim()}`;
    if (!pairsMap[pairKey]) {
      pairsMap[pairKey] = { count: 0, ids: [] };
    }
    pairsMap[pairKey].count++;
    pairsMap[pairKey].ids.push(id);
  });
  return Object.entries(pairsMap).map(([pair, { count, ids }]) => ({
    text: pair,
    count,
    ids,
  }));
}

export function calculateCategoryItems(
  rawWords: DocumentData[]
): TubInterface[] {
  const categoriesMap: Record<string, { count: number; ids: string[] }> = {};
  rawWords.forEach(({ category, fromLanguage, toLanguage, id }) => {
    const categoryKey = `${category
      .trim()
      .toLowerCase()}|${fromLanguage.trim()}-${toLanguage.trim()}`;
    if (!categoriesMap[categoryKey]) {
      categoriesMap[categoryKey] = { count: 0, ids: [] };
    }
    categoriesMap[categoryKey].count++;
    categoriesMap[categoryKey].ids.push(id);
  });
  return Object.entries(categoriesMap).map(([key, { count, ids }]) => {
    const [category] = key.split("|");
    return {
      text: capitalize(category),
      count,
      ids,
    };
  });
}

// TESTS VITEST
// import { describe, it, expect } from 'vitest';
// import { calculateLanguagePairs, calculateCategoryItems } from '../utils';

// describe('calculateLanguagePairs', () => {
//   it('should correctly count language pairs', () => {
//     const rawWords = [
//       { fromLanguage: 'English', toLanguage: 'Spanish', id: '1' },
//       { fromLanguage: 'English', toLanguage: 'Spanish', id: '2' },
//       { fromLanguage: 'French', toLanguage: 'German', id: '3' },
//     ];

//     const result = calculateLanguagePairs(rawWords);
//     expect(result).toEqual([
//       { text: 'English - Spanish', count: 2, ids: ['1', '2'] },
//       { text: 'French - German', count: 1, ids: ['3'] },
//     ]);
//   });
// });

// describe('calculateCategoryItems', () => {
//   it('should correctly count category items', () => {
//     const rawWords = [
//       { category: 'Animals', fromLanguage: 'English', toLanguage: 'Spanish', id: '1' },
//       { category: 'Animals', fromLanguage: 'English', toLanguage: 'Spanish', id: '2' },
//       { category: 'Food', fromLanguage: 'French', toLanguage: 'German', id: '3' },
//     ];

//     const result = calculateCategoryItems(rawWords);
//     expect(result).toEqual([
//       { text: 'Animals', count: 2, ids: ['1', '2'] },
//       { text: 'Food', count: 1, ids: ['3'] },
//     ]);
//   });

//   it('should capitalize category names', () => {
//     const rawWords = [
//       { category: 'vehicles', fromLanguage: 'English', toLanguage: 'Spanish', id: '4' },
//     ];

//     const result = calculateCategoryItems(rawWords);
//     expect(result[0].text).toBe('Vehicles');
//   });
// });
