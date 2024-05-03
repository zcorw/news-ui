import React, { useState } from 'react';
import parser from './parser'
import Steps from './components/Steps'

function App() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        console.log(reader.result)
        console.log(parser(reader.result as string))
      }
    }
  }
  const [step] = useState(1)
  return (
    <div className="App">
      <header className="App-header">
        <Steps step={step} />
      </header>
      <div className='App-body'>
        
      </div>
    </div>
  );
}

export default App;
