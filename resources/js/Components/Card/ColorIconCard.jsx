import React from 'react';
import { formatNumber } from "chart.js/helpers";

// Dictionnaire des couleurs autorisées
const colorMap = {
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  gray: 'bg-gray-500 text-white',
  orange: 'bg-orange-500 text-white',
  indigo: 'bg-indigo-500 text-white',
  purple: 'bg-purple-500 text-white',
  teal: 'bg-teal-500 text-white',
  amber: 'bg-amber-500 text-white',
};

const colorTextMap = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  yellow: 'text-yellow-400',
  gray: 'text-gray-500',
  orange: 'text-orange-500',
  indigo: 'text-indigo-500',
  purple: 'text-purple-500',
  teal: 'text-teal-500',
  amber: 'text-amber-500',
};


function ColorIconCard({ id, title, icon, color = 'gray', montant, devise }) {
  const colorClasses = colorMap[color] || colorMap['gray'];
  const colorTextClasses = colorTextMap[color] || colorTextMap['gray'];

  return (
    <div
      key={id}
      className={`rounded p-5 sm:grid flex justify-between flex-wrap gap-2 ${colorClasses}`}
    >
      <div className="flex gap-5">
        <div className={`rounded-full w-fit h-fit bg-white p-1 ${colorTextClasses}`}>
          {icon}
        </div>
        <div>{title.toUpperCase()}</div>
      </div>

      <div className="flex gap-1 border-2 p-2 rounded w-fit">
        <div className="lg:text-3xl text-xl font-bold">
          {formatNumber(montant)}
        </div>
        {devise && <div className="self-end">{devise}</div>}
      </div>
    </div>
  );
}

export default ColorIconCard;
