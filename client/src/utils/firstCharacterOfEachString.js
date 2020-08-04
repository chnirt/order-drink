export const firstCharacterOfEachString = (name = '') =>
  name
    .split(' ')
    .map(element => element[0])
    .join('')

export const formatNameWithMaterial = (name = '') =>
  name
    .split(' ')
    .map(element => element[0])
    .join('')
    .slice(0, 3)
