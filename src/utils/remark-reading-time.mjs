import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    
    // On injecte le résultat dans le frontmatter d'Astro
    // On arrondit les minutes pour avoir un entier (ex: 5)
    data.astro.frontmatter.minutesRead = Math.ceil(readingTime.minutes);
  };
}