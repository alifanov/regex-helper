import React from 'react';
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
    this.state = {
      text: '',
      pattern: '',
      tokens: [],
    };
    this._handleChange = this._handleChange.bind(this);

    this.tokenPattern = /<([^>]*)>/g;
  }

  _handleChange(e) {
    const text = e.currentTarget.innerText;
    this.setState({text});
    let tokens = deduplicateTokens(exportTokens(this.tokenPattern, text));
    // const lines = text.split(/\r?\n/).filter(v => !!v);
    if (tokens.length > 0) {
      tokens = tokens.map(tp => tp.replace('<', '').replace('>', ''));
      this.setState({tokens});
      const pattern = generateRegexPattern(tokens, text);
      if (pattern) {
        this.setState({pattern});
      }
    }
  }

  render() {
    return (
      <div>
        <div
          className='textArea'
          contentEditable="true"
          data-ph='Type your examples here'
          onInput={this._handleChange}
        ></div>
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
