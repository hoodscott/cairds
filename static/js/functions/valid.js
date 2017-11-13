function validatePlayerParams(params) {
  let valid = true;
  params[0].forEach(function(param, i) {
    if (typeof(param) !== "boolean" || (i === 5 && typeof(param) !== "number")) {
      valid = false;
    }
  });
  return valid;
}
function validatePileParams(params) {
  let valid = true;
  if (params.length !== 4) { return false;}
  for (let i = 0; i < 4; i++) {
    if (params[i].length !== 13) { return false;}
    for (let j = 0; j < 13; j++) {
      params[i][j].forEach(function(param,k) {
        if ((k !== 5 && typeof(param) !== "boolean") || (k === 5 && typeof(param) !== "number")) {
          console.log(param + " " + k)
          console.log(typeof(param) !== "boolean")
          console.log(k === 5)
          console.log(typeof(param) !== "number")
          valid = false;
        }
      });
    }
  }
  return valid;
}
