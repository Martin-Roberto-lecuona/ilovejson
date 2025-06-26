import React from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

interface Props {
  data: any;
}

export const JsonPreview: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-4 border rounded p-2 bg-gray-100 text-sm">
      <JSONPretty data={data} />
    </div>
  );
};