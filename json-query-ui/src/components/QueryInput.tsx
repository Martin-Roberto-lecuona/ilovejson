import React, { useState, useEffect } from 'react';

interface Props {
  setQuery: (q: string) => void;
  onRun: () => void;
  jsonFields: string[];
  jsonArrayKey: string;
}

const operators = [
  { label: "es igual a", value: "==" },
  { label: "es distinto de", value: "!=" },
  { label: "es mayor que", value: ">" },
  { label: "es menor que", value: "<" },
  { label: "contiene", value: "contains" },
];

export const QueryInput: React.FC<Props> = ({ setQuery, onRun, jsonFields,jsonArrayKey }) => {
  const [field, setField] = useState(jsonFields[0] || "");
  const [operator, setOperator] = useState("==");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!field) return;
    let query = "";
    if (operator === "contains") {
      query = `${jsonArrayKey}[?contains(${field}, '${value}')]`;
    } else if (isNaN(Number(value))) {
      query = `${jsonArrayKey}[?${field} ${operator} '${value}']`;
    } else {
      query = `${jsonArrayKey}[?${field} ${operator} \`${value}\`]`;
    }
    setQuery(query);
  }, [field, operator, value, setQuery, jsonArrayKey]);

  useEffect(() => {
    if (!jsonFields.includes(field)) {
      setField(jsonFields[0] || "");
    }
  }, [jsonFields, field]);

  return (
    <div className="my-4 flex flex-wrap gap-2 items-center">
      <span className="text-sm">Mostrar personas donde</span>
      <select value={field} onChange={(e) => setField(e.target.value)} className="border p-2 rounded">
        {jsonFields.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      <select value={operator} onChange={(e) => setOperator(e.target.value)} className="border p-2 rounded">
        {operators.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
      </select>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-2 rounded"
        placeholder="valor"
      />
      <button onClick={onRun} className="bg-blue-600 text-white px-4 rounded">
        Filtrar
      </button>
    </div>
  );
};