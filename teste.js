function rot13(str) {
  const KEY = 13;
  const FIRST_LETTER = 65;
  const LAST_LETTER = 91;
  const newString = [];

  for (let i = 0; i < str.length; i++) {
    if (/\w|\s+/.test(str[i])) {
      if (str.charCodeAt(i) - KEY < FIRST_LETTER) {
        const diff = FIRST_LETTER - (str.charCodeAt(i) - KEY);
        newString.push(LAST_LETTER - Math.abs(diff));
      } else {
        newString.push(str.charCodeAt(i) - KEY);
      }
    }
  }
  const stringToArray = String.fromCharCode(...newString).split('-');
  let arrayToString = stringToArray.join(' ');

  const patternForSpecialCharacter = /[!@#$%^&\*()_\+{}\[\]:;<>,.?~]/;
  const indice = str.search(patternForSpecialCharacter);
  if (indice !== -1) {
    arrayToString += str[indice];
  }
  return arrayToString;
}

console.log(rot13('SERR PBQR PNZC!'));
// console.log('A'.charCodeAt(0));
