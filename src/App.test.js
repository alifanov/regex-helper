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

test('guess alnum pattern with exception before', () => {
  expect(guessNumberAlphaPattern(['aa111bb', 'bb222aa'], 'A good code is aa111bb and bb222aa but ff222aa is a bad code')).toEqual(/((?!ff)[a-zA-Z]{2}\d{3}[a-zA-Z]{2})/g);
});

test('guess alnum pattern with multiple exception before', () => {
  expect(guessNumberAlphaPattern(['aa111bb', 'bb222aa'], 'A good code is aa111bb and bb222aa but ff222aa and ee222aa is a bad code')).toEqual(/((?!ff)(?!ee)[a-zA-Z]{2}\d{3}[a-zA-Z]{2})/g);
});

test('guess alnum pattern with exception after', () => {
  expect(guessNumberAlphaPattern(['aa111bb', 'bb222aa'], 'A good code is aa111bb and bb222aa but aa222cc is a bad code')).toEqual(/([a-zA-Z]{2}\d{3}(?!cc)[a-zA-Z]{2})/g);
});

test('guess alnum pattern with multiple exception after', () => {
  expect(guessNumberAlphaPattern(['aa111bb', 'bb222aa'], 'A good code is aa111bb and bb222aa but aa222cc and aa222ee are a bad code')).toEqual(/([a-zA-Z]{2}\d{3}(?!cc)(?!ee)[a-zA-Z]{2})/g);
});

test('guess alnum pattern with multiple duplicates exception after', () => {
  expect(guessNumberAlphaPattern(['aa111bb', 'bb222aa'], 'A good code is aa111bb and bb222aa but aa222cc and aa222ee are a bad code aa222ee are a bad code')).toEqual(/([a-zA-Z]{2}\d{3}(?!cc)(?!ee)[a-zA-Z]{2})/g);
});
