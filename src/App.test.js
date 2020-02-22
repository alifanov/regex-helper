import React from 'react';

import {exportTokens, deduplicateTokens, guessNumberAlphaPattern} from "./RegexGenerator";

test('exportTokens', () => {
  expect(exportTokens(/{([^}]*)}/g, 'My code {asd}')).toEqual(['asd']);
});

test('deduplicateTokens', () => {
  expect(deduplicateTokens(['asd', 'asd', 'a'])).toEqual(['asd', 'a']);
});

test('deduplicateTokens', () => {
  expect(guessNumberAlphaPattern(['aa111bb'], 'Code is aa111bb')).toEqual(/([a-zA-Z]{2,2}\d{3,3}[a-zA-Z]{2,2})/g);
});
