import React from 'react';
import ContentEditable from 'react-contenteditable'

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

    const initialText = 'my postcode is {BC123DO}';
    const tokens = this._getTokens(initialText);

    this.state = {
      text: initialText,
      pattern: this._getPattern(tokens, initialText),
      tokens: tokens,
    };
    this.contentEditable = React.createRef();
    this._handleChange = this._handleChange.bind(this);

  }

  _getTokens(text){
    return deduplicateTokens(exportTokens(this.tokenPattern, text));
  }

  _getPattern(tokens, text){
    return generateRegexPattern(tokens.map(tp => tp.replace('<', '').replace('>', '')), text);
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
        <ContentEditable
          className='textArea'
          innerRef={this.contentEditable}
          html={this.state.text}
          disabled={false}
          onChange={this._handleChange}
          tagName='article'
           />
        {this.state.pattern && (<div>
          <p>It seems like: {this.state.pattern.toString()}</p>
          {/*{this.state.tokens.map((t, i) => <div>{t}: {["number", "text", "date"].map(_type => <Checkbox key={i}*/}
          {/*                                                                                              label={_type}/>)}</div>)}*/}
        </div>)}
      </div>
    );
  }
}

export default App;
