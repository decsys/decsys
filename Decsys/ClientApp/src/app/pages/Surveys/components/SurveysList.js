import React from "react";

const SurveysList = ({ surveys }) => (
  <ul>
    {surveys.map(s => (
      <li key={s.id}>
        {s.id}: {s.name}
      </li>
    ))}
  </ul>
);

export default SurveysList;
