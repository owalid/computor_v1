const operator = ["+", "*", "/", "-"];

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

const reduceExpression = (expression) => {
  const rigth_side = expression.split('=')[1];
  const have_pow_char = expression.includes('^');

  const a_right = +rigth_side.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
  let result = "";

  let expression_l = expression.split('=')[0].split(`${have_pow_char ? 'X^' : 'X'}`);
  let expression_r = expression.split('=')[1].split(`${have_pow_char ? 'X^' : 'X'}`);
  expression_l.shift();
  expression_r.shift();

  expression_l_splited = [];
  expression_r_splited = [];
  expression_l_splited.push(a);
  expression_r_splited.push(a_right);
  expression_l.map(item => {
    expression_l_splited.push(+item.split('*').join('').substr(1))
  })
  expression_r.map(item => {
    expression_r_splited.push(+item.split('*').join('').substr(1))
  })
  expression_l_splited.pop()
  expression_r_splited.pop()
  if (expression_l_splited.length > expression_r_splited.length) {
    expression_l_splited.map((item, id) => {
      if (expression_r_splited[id]) {
        result += `${expression_l_splited[id] - expression_r_splited[id]} X^${id}`
      } else {
        result += `${expression_l_splited[id]} X^${id}`
      }
    })
  } else {
    expression_r_splited.map((item, id) => {
      if (expression_l_splited[id]) {
        result += `${expression_r_splited[id] - expression_l_splited[id]} X^${id}`
      } else {
        result += `${expression_r_splited[id]} X^${id}`
      }
    })
  }
  result += "= 0"
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
  let result = {};
  
  if (a !== 0) {
    result.x = b / -a;
  }
  return (result);
}

const degree_2 = (expression) => {
  const have_pow_char = expression.includes('^');
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[1].split(`${have_pow_char ? 'X^2' : 'X2'}`)[0].split('*').join('') || 1;
  const b = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[0].split('*').join('') || 1;
  const c = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
  let delta = (b * b) - (4 * (a * c));
  let result = {};
  result.delta = `${b}² - 4 * ${a} * ${c} = ${delta}`;
  if (delta < 0) {
    const reduce = reducer(b, (2 * a));
    let z1 = `${-reduce.numerator} - ${Math.sqrt(-delta)}i${(reduce.denominator ===  1) ? '' : ' / ' + reduce.denominator }`;
    let z2 = `${-reduce.numerator} + ${Math.sqrt(-delta)}i${(reduce.denominator === 1) ? '' : ' / ' + reduce.denominator }`;
    result.z1 = z1.toString();
    result.z2 = z2.toString();
  } else if (delta > 0) {
    result.x1 = parseFloat((-b - Math.sqrt(delta)) / (2 * a), 3);
    result.x2 = parseFloat((-b + Math.sqrt(delta)) / (2 * a), 3);
  } else {
    result.x0 = parseFloat(-b / (2 * a));
  }
  return (result);
}

// parser("-5 * X^0 - 4 * X^1 - 9.3 * X^2 = 1 * X^0")
// console.log("------------------------------------------------------------------------------------")
parser("8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0")
