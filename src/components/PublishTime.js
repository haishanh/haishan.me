import React from 'react';
import tinytime from 'tinytime';

const template = tinytime('{MMMM} {DD}, {YYYY}');

export default ({ date }) => {
  const dateStr = template.render(date);
  return (
    <time dateTime={date.toISOString()} itemProp="datePublished">
      {dateStr}
    </time>
  );
};
