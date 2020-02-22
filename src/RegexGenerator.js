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

const guessNumberAlphaPattern = (tokens, text) => {
  const numberOfDigitsInTokens = tokens.map(t => (t.match(/\d/g) || []).length);
  const minNumberInTokens = _.min(numberOfDigitsInTokens);
  const maxNumberInTokens = _.max(numberOfDigitsInTokens);

  const numberOfAlphaInTokens = tokens.map(t => (t.match(/[a-zA-Z]/g) || []).length);
  const minAlphaInTokens = _.min(numberOfAlphaInTokens);
  const maxAlphaInTokens = _.max(numberOfAlphaInTokens);

  const numberPatternPart = `\d{${minNumberInTokens},${maxNumberInTokens}`;
  const alphaNumberPart = `[a-zA-Z]{${minAlphaInTokens},${maxAlphaInTokens}`;

  for (const patternString of [
    `${numberPatternPart}${alphaNumberPart}`,
    `${alphaNumberPart}${numberPatternPart}`,
    `${numberPatternPart}${alphaNumberPart}${numberPatternPart}${alphaNumberPart}`,
    `${alphaNumberPart}${numberPatternPart}${alphaNumberPart}${numberPatternPart}`,
    `${numberPatternPart}${alphaNumberPart}${numberPatternPart}${alphaNumberPart}${numberPatternPart}${alphaNumberPart}`,
    `${alphaNumberPart}${numberPatternPart}${alphaNumberPart}${numberPatternPart}${alphaNumberPart}${numberPatternPart}`,
  ]) {
    const extractedTokens = deduplicateTokens(exportTokens(new RegExp(patternString), text));
    if (_.isEqual(tokens, extractedTokens)) {
      return new RegExp(patternString);
    }

  }
};

export default function generateRegexPattern(tokens, text) {
  const naivePattern = new RegExp(tokens.length > 1 ? `(${tokens.join('|')})` : tokens, 'g');

  const textWithoutMarkup = text.replace('{', '').replace('}', '');

  const wordPattern = /([a-zA-Z]+)/mg;
  const numberPattern = /(\d+)/mg;
  const datePattern = /(\d{1,2}[.-]\d{1,2}[.-]\d{2,4})/mg;
  const hashPattern = /(\d+[a-zA-Z]+\w*|[a-zA-Z]+\d+\w*)/mg;
  const ipPattern = /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})/mg;
  const ipv6Pattern = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/mg;
  const emailPattern = /([^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+)/mg;
  const macAddressPattern = /[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}/mg;
  const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/mg;
  const phoneNumberPattern = /[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/mg;
  const uuidPattern = /[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/mg;

  const patternCandidates = [
    ipPattern,
    ipv6Pattern,
    phoneNumberPattern,
    numberPattern,
    emailPattern,
    datePattern,
    wordPattern,
    macAddressPattern,
    urlPattern,
    uuidPattern,
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