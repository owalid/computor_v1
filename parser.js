const operator = ["+", "-"];

const sqrt = (number) => {
  let result;
  let x1 = number / 2;
      
  while (result !== x1) {
      result = x1;
      x1 = (result + (number / result)) / 2;
  }
  return result;
}

let gcd = (num, denom) => {
  return denom ? gcd(denom, num % denom) : num;
};

const reducer = (numerator, denominator) => {
  return { numerator: numerator / gcd(numerator, denominator), denominator: denominator / gcd(numerator, denominator) }
}

function isInt(n) {
  return n % 1 === 0;
}

const reducerSqrt = (sqrt_number) => {
  let rest = 0;
  let i = 2;
  while (i * i <= sqrt_number) {
    if (sqrt_number % (i * i) === 0) {
      sqrt_number = sqrt_number / (i * i);
      rest = rest * i;
    }
    i++;
  }
  return {rest: rest, reduce_sqrt: sqrt_number};
}

const simplifyExpression = (expression, degree) => {
  const have_pow_char = expression.includes('^');
  const expression_splited = {};
  const result = {degree: degree, expression: ''};
  expression = expression.split('=')[0].split(/(?=\+)|(?='-')/g);
  expression.map(item => {
    item = item.split('*').join('');
    item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
    expression_splited[item[1].trim()] = {number: +item[0]}
  })
  console.log((Object.keys(expression_splited).length - 1).toString())
  if (expression_splited[(Object.keys(expression_splited).length - 1).toString()].number === 0) {
    delete expression_splited[(Object.keys(expression_splited).length - 1).toString()];
    result.degree--;
  }
  Object.keys(expression_splited).map((item, id) => {
    result.expression += `${(expression_splited[item].number >= 0) ? '+' : ' '}${expression_splited[item].number} * X^${item}`
  })
  result.expression = result.expression.trim();
  return result;
}

const reduceExpression = (expression) => {
  const have_pow_char = expression.includes('^');
  let expression_l = expression.split('=')[0].split(/(?=\+)|(?='-')/g);
  let expression_r = expression.split('=')[1].split(/(?=\+)|(?='-')/g);
  let result = "";

  expression_l_splited = {};
  expression_r_splited = {};
  expression_l.map(item => {
    item = item.split('*').join('');
    item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
    expression_l_splited[item[1]] = {number: +item[0]}
  })
  expression_r.map(item => {
    item = item.split('*').join('');
    item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
    expression_r_splited[item[1]] = {number: +item[0]}
  })
  if (Object.keys(expression_l_splited).length >= Object.keys(expression_r_splited).length) {
    Object.keys(expression_l_splited).map((item, id) => {
      if (Object.keys(expression_r_splited).indexOf(item) !== -1) {
        result += `${(expression_l_splited[item].number - expression_r_splited[item].number >= 0) ? '+' : ' '}${expression_l_splited[item].number - expression_r_splited[item].number} * X^${item}`
      } else {
        result += `${(expression_l_splited[item].number >= 0) ? '+' : ' '}${expression_l_splited[item].number} * X^${item}`
      }
    })
  } else {
    Object.keys(expression_r_splited).map((item, id) => {
      console.log(expression_r_splited)
      console.log(expression_l_splited)
      if (Object.keys(expression_l_splited).indexOf(item) !== -1 && expression_l_splited[item].number) {
        if (+expression_l_splited[item].number > 0) {
          result += `${(expression_r_splited[item].number - expression_l_splited[item].number >= 0) ? '+' : ' '}${expression_r_splited[item].number - expression_l_splited[item].number} * X^${item}`
        } else {
          result += `${(expression_r_splited[item].number + expression_l_splited[item].number >= 0) ? '+' : ' '}${expression_r_splited[item].number + expression_l_splited[item].number} * X^${item}`
        }
      } else {
        result += `${(expression_r_splited[item].number >= 0) ? '+' : ' '}${expression_r_splited[item].number} * X^${item}`
      }
    })
  }
  result += " = 0"
  return result;
}

const parser = (expression) => {
  let have_two_expr = (expression.includes('=') && expression.split('=')[1] !== 0)
  expression = expression.trim();
  expression = expression.split(' ').join('');
  expression = expression.toUpperCase();

  let degree_number_left;
  if (expression.includes('^')) {
    const split_degree = expression.split('^');
    const index = (have_two_expr) ? 2 : 1;
    degree_number_left = +split_degree[split_degree.length - index].charAt(0);
    degree_number_right = (have_two_expr) ? +split_degree[split_degree.length - 1].charAt(0) : null;
  } else {
    const split_degree = expression.split('X');
    const index = (have_two_expr) ? 2 : 1;
    degree_number_left = +split_degree[split_degree.length - index].charAt(0);
    degree_number_right = (have_two_expr) ? +split_degree[split_degree.length - 1].charAt(0) : null;
  }
  let result =  { degree_number: degree_number_left, reduced: null }
  if (have_two_expr) {
    result.reduced = reduceExpression(expression, result.degree_number, degree_number_right);
    expression = result.reduced;
    result.degree_number = (degree_number_right > degree_number_left) ? degree_number_right : degree_number_left;
  }
  let tmp = simplifyExpression(expression, result.degree_number);
  result.reduced = tmp.expression;
  expression = tmp.expression;
  result.degree_number = tmp.degree;
  if (result.degree_number === 2) {
    result.solutions = degree_2(expression);
  } else if (result.degree_number === 1) {
    result.solutions = degree_1(expression);
  } else if (result.degree_number === 0) {
    result.solutions = degree_0(expression);
  } else {
    console.log("sorry", result)
  }
  console.log(result)
}

const degree_0 = (expression) => {
  const have_pow_char = expression.includes('^');
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1 || 0;
  let result = {};

  return result.x = a;
}

const degree_1 = (expression) => {
  const have_pow_char = expression.includes('^');
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[0].split('*').join('') || 0;
  const b = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1 || 0;
  let result = { x: 0 };
  if (a !== 0) {
    result.x = - b / a;
  }
  return (result);
}

const degree_2 = (expression) => {
  const have_pow_char = expression.includes('^');
  expression = expression.split('=')[0].split(/(?=\+)|(?=-)/g);
  expression_splited = {};
  expression.map(item => {
    item = item.split('*').join('');
    item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
    if (item[1] && item[1].trim()) {
      expression_splited[+(item[1].trim())] = {number: +item[0]}
    }
  })
  let a = +expression_splited[2].number;
  let b = +expression_splited[1].number;
  let c = +expression_splited[0].number;
  let delta = (b * b) - (4 * (a * c));
  let result = {};
  result.delta = `${b}² - 4 * ${a} * ${c} = ${delta}`;
  if (delta < 0) {
    const reduce = reducer(b, (2 * a));
    let z1 = `${-reduce.numerator} - ${sqrt(-delta)}i${(reduce.denominator ===  1) ? '' : ' / ' + reduce.denominator }`;
    let z2 = `${-reduce.numerator} + ${sqrt(-delta)}i${(reduce.denominator === 1) ? '' : ' / ' + reduce.denominator }`;
    result.z1 = z1.toString();
    result.z2 = z2.toString();
  } else if (delta > 0) {
    if (!isInt(parseFloat(sqrt(delta)))) {
      const reduceDelta = reducerSqrt(delta)
      const reduce = reducer(-b, (2 * a));
      if (reduce.numerator < 100 || reduce.denominator < 100) {
        result.x1_reducer = `${reduce.numerator} - ${(reduceDelta.rest === 0) ? '' : reduceDelta.rest}√${reduceDelta.reduce_sqrt} / ${reduce.denominator}`
        result.x2_reducer = `${reduce.numerator} + ${(reduceDelta.rest === 0) ? '' : reduceDelta.rest}√${reduceDelta.reduce_sqrt} / ${reduce.denominator}`
      }
    }
    result.x1 = parseFloat((-b - Math.sqrt(delta)) / (2 * a));
    result.x2 = parseFloat((-b + Math.sqrt(delta)) / (2 * a));
  } else {
    result.x0 = parseFloat(-b / (2 * a));
  }
  return (result);
}

// parser("5 * X^0 + 4 * X^1 - 5 * X^2 = 0")
// parser("4 * X^0 + 4 * X^1 - 9.3 * X^2 = 0")
parser(" - 8 X^0 + 0 * X^1 = 0")
// console.log("------------------------------------------------------------------------------------")
// parser("5 * X^0 + 4 * X^1 - 1 * X^2 = 2*X^2")
