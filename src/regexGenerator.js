import _ from 'lodash';

export const deduplicateTokens = tokens => [...new Set(tokens)];

export const exportTokens = (pattern, text) => {
  const tokens = [];
  let match = pattern.exec(text);

  while (match !== null) {
    tokens.push(match[1]);
    match = pattern.exec(text);
  }

  return tokens;
};

export default function generateRegexPattern(tokens, text) {
  const naivePattern = new RegExp(tokens.length > 1 ? `(${tokens.join('|')})` : tokens, 'g');

  const textWithoutMarkup = text.replace('<', '').replace('>', '');

  const wordPattern = /([a-zA-Z]+)/mg;
  const numberPattern = /(\d+)/mg;
  const datePattern = /(\d{1,2}[.-]\d{1,2}[.-]\d{2,4})/mg;
  const hashPattern = /([a-zA-Z\d]+)/mg;

  const patternCandidates = [
    numberPattern,
    datePattern,
    wordPattern,
    hashPattern,
  ];

  for (const patternCandidate of patternCandidates) {
    const extractedTokens = deduplicateTokens(exportTokens(patternCandidate, textWithoutMarkup));
    if (_.isEqual(tokens, extractedTokens)) {
      return patternCandidate;
    }
  }

  return naivePattern;
};