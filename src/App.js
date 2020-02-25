import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'


import './App.css';


import generateRegexPattern, {exportTokens, deduplicateTokens} from "./RegexGenerator";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.tokenPattern = /{([^}]*)}/g;

    const initialText = 'my postcode is {BC123DO}\nthis is your postcode {aa321sd}\nthis is wrong postcode aa132ee';
    const tokens = this._getTokens(initialText);

    this.state = {
      initialText,
      text: initialText,
      pattern: this._getPattern(tokens, initialText),
      patternCopied: false,
      tokens: tokens,
      inProgress: false
    };
    this.contentEditable = React.createRef();
    this._handleChange = this._handleChange.bind(this);
    this._guessPattern = this._guessPattern.bind(this);
  }

  _getHighlightedTokensText() {
    let result = this.state.text.replace(/{/g, '').replace(/}/g, '');
    for (const token of this.state.tokens) {
      result = result.replace(token, `<span class="badge badge-success">${token}</span>`)
    }
    return result.replace(/\n/g, '<br/>');
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
  }

  _guessPattern(){
    const text = this.state.text;
    this.setState({inProgress: true});
    setTimeout(() => {
      const tokens = this._getTokens(text);
      if (tokens.length > 0) {
        const pattern = this._getPattern(tokens, text);
        if (pattern) {
          this.setState(s => ({pattern, tokens, inProgress: false}));
        }
      }
    });
  }

  render() {
    const {inProgress} = this.state;
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
          <a className="navbar-brand" href="/"><h1>Regex Helper</h1></a>
        </nav>
        <div className='container'>
          <div className='block'>
            Use <code>{'{'}{'}'}</code> brackets to wrap tokens you want to extract from text
          </div>
          <div className="block">
            <textarea className='textArea form-control' defaultValue={this.state.initialText} rows={5} onChange={this._handleChange}/>
          </div>

          <div className="block">
            <button key='run_btn' className={`btn btn-${inProgress ? 'secondary' : 'success'}`} disabled={inProgress} onClick={this._guessPattern}>{inProgress ? 'Generating...' : 'Generate pattern'}</button>
          </div>

          <div className="jumbotron">
            <div className='output' dangerouslySetInnerHTML={{__html: this._getHighlightedTokensText()}}/>
          </div>
          {this.state.pattern && (<div>
            <p>Seems your pattern is: <code>{this.state.pattern.toString()}</code> <CopyToClipboard text={this.state.pattern}
                                                                                                    onCopy={() => {
                                                                                                      this.setState({patternCopied: true});
                                                                                                      setTimeout(() => this.setState({patternCopied: false}), 1000)
                                                                                                    }}>
              <FontAwesomeIcon icon={faCopy} />
            </CopyToClipboard>         {this.state.patternCopied ? <span style={{color: 'grey'}}>Copied</span> : null}
            </p>
          </div>)}
          <div className="complain-guide text-center">
            <p>Please, don't hesitate to create <a href="https://github.com/alifanov/regex-helper/issues">issues on Github</a></p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
