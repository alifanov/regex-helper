import React from 'react';

import {exportTokens, deduplicateTokens, guessNumberAlphaPattern} from "./RegexGenerator";

test('exportTokens', () => {
  expect(exportTokens(/{([^}]*)}/g, 'My code {asd}')).toEqual(['asd']);
});

test('deduplicateTokens', () => {
  expect(deduplicateTokens(['asd', 'asd', 'a'])).toEqual(['asd', 'a']);
});

test('guess alnum pattern', () => {
  expect(guessNumberAlphaPattern(['aa111bb'], 'Code is aa111bb')).toEqual(/([a-zA-Z]{2}\d{3}[a-zA-Z]{2})/g);
});

test('guess alnum pattern with exception', () => {
  expect(guessNumberAlphaPattern(['aa111bb', 'bb222aa'], 'A good code is aa111bb and bb222aa but ff222aa is a bad code')).toEqual(/((?!ff)[a-zA-Z]{2}\d{3}[a-zA-Z]{2})/g);
});
