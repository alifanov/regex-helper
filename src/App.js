import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';


import './App.css';


import generateRegexPattern, {exportTokens, deduplicateTokens} from "./RegexGenerator";

const Checkbox = ({key, label, handleChange}) => {
  return (<label>
    <input type="checkbox" onChange={handleChange}/>
    {label}
  </label>)
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.tokenPattern = /{([^}]*)}/g;

    const initialText = 'my postcode is {BC123DO}\nthis is your postcode {aa321sd}';
    const tokens = this._getTokens(initialText);

    this.state = {
      initialText,
      text: initialText,
      pattern: this._getPattern(tokens, initialText),
      patternCopied: false,
      tokens: tokens,
    };
    this.contentEditable = React.createRef();
    this._handleChange = this._handleChange.bind(this);

  }

  _getHighlightedTokensText() {
    let result = this.state.text;
    for (const token of this.state.tokens) {
      result = result.replace(token, `<span class="matched">${token}</span>`)
    }
    return result.replace('\n', '<br/>');
  }

  _getTokens(text) {
    return deduplicateTokens(exportTokens(this.tokenPattern, text));
  }

  _getPattern(tokens, text) {
    return generateRegexPattern(tokens.map(tp => tp.replace(/{/g, '').replace(/}/g, '')), text);
  }

  _handleChange(e) {
    const text = e.target.value;
    this.setState({text});
    let tokens = this._getTokens(text);
    // const lines = text.split(/\r?\n/).filter(v => !!v);
    if (tokens.length > 0) {
      this.setState({tokens});
      const pattern = this._getPattern(tokens, text);
      if (pattern) {
        this.setState({pattern});
      }
    }
  }

  render() {
    return (
      <div>
        <textarea className='textArea' onChange={this._handleChange}>{this.state.initialText}</textarea>
        <div className='output' dangerouslySetInnerHTML={{__html: this._getHighlightedTokensText()}}/>
        {this.state.pattern && (<div>
          <p>Seems your pattern is: <b>{this.state.pattern.toString()}</b> <CopyToClipboard text={this.state.pattern}
                                                                                            onCopy={() => {
                                                                                              this.setState({patternCopied: true});
                                                                                              setTimeout(() => this.setState({patternCopied: false}), 1000)
                                                                                            }}>
            <button>Copy to clipboard</button>
          </CopyToClipboard>         {this.state.patternCopied ? <span style={{color: 'red'}}>Copied</span> : null}
          </p>
          {/*{this.state.tokens.map((t, i) => <div>{t}: {["number", "text", "date"].map(_type => <Checkbox key={i}*/}
          {/*                                                                                              label={_type}/>)}</div>)}*/}
        </div>)}
      </div>
    );
  }
}

export default App;
