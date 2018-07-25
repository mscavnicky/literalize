function transposeMatrix(array) {
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
    if (options.quoteNumbers === true || isNaN(term)) {
      return "'" + term + "'";
    } else {
      return term;
    }
  }
}

function occurences(str, part) {
  return str.split(part).length - 1;
}

function literalize(str, options) {
  options = options || {};
  // XXX This is pretty bad hack. Papaparse does not support spaces by default.
  // We is also not able to override the defaul selection of guess delmiters.
  // There we remove the ASCII character 31 from the list and replace it with space.
  Papa.RECORD_SEP = ' ';

  // Simple heuristics to override quote character, as it does not get auto-detected.
  var papaConfig = {}
  if (occurences(str, "'") > occurences(str, '"')) {
    papaConfig.quoteChar = "'";
  }

  var results = Papa.parse($.trim(str), papaConfig);
  // TODO Better error handling.
  var data = results.data;
  
  if (options.transpose === true) {
    data = transposeMatrix(data);
  }
  // Unnest the 1D-arrays which were nested since parsing the CSV.
  if (_.isArray(data) && data.length == 1) {
    data = data[0];
  }
  return toLiteral(data, options);
}
