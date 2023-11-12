const isEmptyString = (str) => {
  return !str || str.length === 0 || str.trim().length === 0;
};

const isEmptyObject = (obj) => { 
  return !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);
};

const isEmptyArray = (arr) => {
  return !arr || arr.length === 0;
};

const isMatching = (str, regex) => {
  return regex.test(str);
};

const isValidRequestBody = (body, validField) => {
  return !isEmptyObject(body) && Object.keys(body).length === validField.length && Object.keys(body).every((key) => validField.includes(key));
}

export default { isEmptyString, isEmptyObject, isEmptyArray, isMatching, isValidRequestBody };