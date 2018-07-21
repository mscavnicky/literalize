function transposeArray(array) {
  return _.zip.apply(_, array);
}

function toLiteral(term, options) {
  if (_.isArray(term)) {
    var strings = []
    for (var i = 0; i < term.length; i++) {
      strings.push(toLiteral(term[i], options));
    }
    return "[" + strings.join(', ') + "]";
  } else {
    if (options.forceQuotes === true || isNaN(term)) {
      return "'" + term + "'";
    } else {
      return term;
    }
  }
}

function literalize(str, options) {
  options = options || {};
  // XXX This is pretty bad hack. Papaparse does not support spaces by default.
  // We is also not able to override the defaul selection of guess delmiters.
  // There we remove the ASCII character 31 from the list and replace it with space.
  Papa.RECORD_SEP = ' ';

  var results = Papa.parse($.trim(str));
  // TODO Better error handling.
  var data = results.data;
  
  if (options.transpose === true) {
    data = transposeArray(data);
  }
  // Unnest the 1D-arrays which were nested since parsing the CSV.
  if (_.isArray(data) && data.length == 1) {
    data = data[0];
  }
  return toLiteral(data, options);
}
