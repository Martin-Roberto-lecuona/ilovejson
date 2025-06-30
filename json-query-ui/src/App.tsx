import React, { useState, useMemo } from 'react';
import { JsonEditor } from './components/JsonEditor';
import { QueryInput } from './components/QueryInput';
import { JsonTable } from './components/JsonTable';
import { JsonPreview } from './components/JsonPreview';
import jmespath from 'jmespath';

function App() {
  const [jsonInput, setJsonInput] = useState('{\n  "people": [\n    { "name": "Alice", "age": 30 },\n    { "name": "Bob", "age": 25 },\n    { "name": "Charlie", "age": 35 }\n  ]\n}');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [jsonArrayKey, setJsonArrayKey] = useState("");
  const [jsonOut, setJsonOut] = useState("")

  const jsonFields = useMemo(() => {
  try {
    const parsed = JSON.parse(jsonInput);
    const entry = Object.entries(parsed).find(
      ([, value]) =>
        Array.isArray(value) && typeof value[0] === "object" && value[0] !== null
    );
    if (entry) {
      const [key, value] = entry;
      setJsonArrayKey(key);
      return Object.keys((value as Record<string, any>[])[0]);
    }
    return [];
  } catch {
    return [];
  }
}, [jsonInput]);

  const handleRun = () => {
    try {
      const json = JSON.parse(jsonInput);
      const result = jmespath.search(json, query);
      setResults(Array.isArray(result) ? result : [result]);
    } catch (err) {
      alert('JSON o Query inválido');
    }
  };

  return (
    <div style={{padding:"4", maxWidth:"100%", margin:"2%"}}>
      <h1 style={{textDecoration:"bold", marginBottom:"2%"}}> Coelsa JSON editor and query</h1>
      <JsonEditor value={jsonInput} onChange={(v) => setJsonInput(v ?? '')} readOnly={false}/>
      <QueryInput setQuery={setQuery} onRun={handleRun} jsonFields={jsonFields} jsonArrayKey={jsonArrayKey} />
      <JsonEditor value={JSON.stringify(results, null, 2)} onChange={()=>("")} readOnly={true}/>
      {/* <JsonTable data={results} /> */}
    </div>
  );
}

export default App;

