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

export const QueryInput: React.FC<Props> = ({ setQuery, onRun, jsonFields, jsonArrayKey }) => {
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
    <div
      style={{
        marginTop: '16px',
        marginBottom: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center'
      }}
    >
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>CONSULTA:</span>

      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          borderRadius: '6px',
          minWidth: '100px'
        }}
      >
        {jsonFields.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      <select
        value={operator}
        onChange={(e) => setOperator(e.target.value)}
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          borderRadius: '6px',
          minWidth: '120px'
        }}
      >
        {operators.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
      </select>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="valor"
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          borderRadius: '6px',
          minWidth: '160px'
        }}
      />

      <button
        onClick={onRun}
        style={{
          backgroundColor: '#c01c7b',
          color: '#fff',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Filtrar
      </button>
    </div>
  );
};
