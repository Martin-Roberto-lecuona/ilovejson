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

  const jsonFields_old = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      // Buscar la primera propiedad que sea un array de objetos
      const firstArray = Object.values(parsed).find(
        (v) => Array.isArray(v) && typeof v[0] === 'object' && v[0] !== null
      );
      const rta = Array.isArray(firstArray) && firstArray.length > 0 && typeof firstArray[0] === 'object' && firstArray[0] !== null
      ? Object.keys(firstArray[0])
      : [];
      console.log("-------------------");
      console.log(rta);
      console.log("-------------------");
      return rta
    } catch {
      return [];
    }
  }, [jsonInput]);

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
    <div className="p-4 max-w-5xl mx-auto m-50">
      <h1 className="text-xl font-bold mb-4">Coelsa JSON editor and query</h1>
      <JsonEditor value={jsonInput} onChange={(v) => setJsonInput(v ?? '')} readOnly={false}/>
      <QueryInput setQuery={setQuery} onRun={handleRun} jsonFields={jsonFields} jsonArrayKey={jsonArrayKey} />
      <JsonEditor value={JSON.stringify(results, null, 2)} onChange={(v) => setJsonInput(v ?? '')} readOnly={true}/>
      <JsonTable data={results} />
    </div>
  );
}

export default App;

