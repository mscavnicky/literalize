function transposeArray(array) {
  return _.zip.apply(_, array);
}

function toLiteral(term) {
  if (_.isArray(term)) {
    var strings = []
    for (var i = 0; i < term.length; i++) {
      strings.push(toLiteral(term[i]));
    }
    return "[" + strings.join(', ') + "]";
  } else {
    if (isNaN(term)) {
      return "'" + term + "'";
    } else {
      return term;
    }
  }
}

function literalize(str, transpose) {
  var results = Papa.parse(str);
  // TODO Better error handling.
  var data = results.data;
  
  if (transpose) {
    data = transposeArray(data);
  }
  // Unnest the 1D-arrays which were nested since parsing the CSV.
  if (_.isArray(data) && data.length == 1) {
    data = data[0];
  }
  return toLiteral(data);
}
