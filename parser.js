const operator = ["+", "*", "/", "-"];

const sqrt = (number) => {
  let lo = 0, hi = number;
  while(lo <= hi) {
    let mid = Math.floor((lo + hi) / 2);
    if (mid * mid > number) {
      hi = mid - 1;
    } else {
      lo = mid + 1;
    } 
  }
  return hi;
}

let gcd = (num, denom) => {
  return denom ? gcd(denom, num % denom) : num;
};

const reducer = (numerator, denominator) => {
  return { numerator: numerator / gcd(numerator, denominator), denominator: denominator / gcd(numerator, denominator) }
}

const reduceExpression = (expression, degree, degree_number_right) => {
  const rigth_side = expression.split('=')[1];
  const have_pow_char = expression.includes('^');

  console.log(degree)
  const a_right = +rigth_side.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;

  const b_right = (degree_number_right >= 1) ? +rigth_side.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[0].split('*').join('') : null;
  const b = (degree >= 1) ? +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[0].split('*').join('') || 1 : null;

  const c_right = (degree_number_right === 2) ? +rigth_side.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[1].split(`${have_pow_char ? 'X^2' : 'X2'}`)[0].split('*').join('') : null;
  const c = (degree === 2) ? +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[1].split(`${have_pow_char ? 'X^2' : 'X2'}`)[0].split('*').join('') || 1 : null;

  let result = { first_part: `${a - a_right}X^0`, second_part: `${b}X^1`, third_part: `${c}X^2` };

  if (degree >= 1 && b_right) {
    result.second_part = `${b - b_right}X^1`
  }
  if (degree === 2 && c_right) {
    result.third_part = `${c - c_right}X^2`
  }
  return (result.first_part + result.second_part || '' + result.third_part || '');
}

const pow = (number, pow) => {
  let result;
  while (pow > 0) {
    result = number * number;
    pow--;
  }
  return result;
}

const parser = (expression) => {
  let have_two_expr = (expression.includes('=') && expression.split('=')[1] !== 0)
  expression = expression.trim();
  expression = expression.split(' ').join('');
  expression = expression.toUpperCase();

  let degree_number_left;
  if (expression.includes('^')) {
    const split_degree = expression.split('^')
    degree_number_left = +split_degree[split_degree.length - (have_two_expr) ? 2 : 1].charAt(0);
    degree_number_right = (have_two_expr) ? +split_degree[split_degree.length - 1].charAt(0) : null;
  } else {
    const split_degree = expression.split('X')
    degree_number_left = +split_degree[split_degree.length - (have_two_expr) ? 2 : 1].charAt(0);
    degree_number_right = (have_two_expr) ? +split_degree[split_degree.length - 1].charAt(0) : null;
  }
  let result =  { degree_number: degree_number_left, reduced: null }
  if (have_two_expr) {
    result.reduced = reduceExpression(expression, result.degree_number, degree_number_right);
    expression = result.reduced;
  }
  if (result.degree_number === 2) {
    result.solutions = degree_2(expression);
  } else if (result.degree_number === 1) {
    result.solutions = degree_1(expression);
  } else if (result.degree_number === 0) {
    result.solutions = degree_0(expression);
  } else {
    console.log("sorry")
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

  if (a > 0) {
    result.x = b / -a;
  }
  return (result);
}

const degree_2 = (expression) => {
  const have_pow_char = expression.includes('^');
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[1].split(`${have_pow_char ? 'X^2' : 'X2'}`)[0].split('*').join('') || 1;
  const b = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[0].split('*').join('') || 1;
  const c = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
  console.log(a, b, c)
  let delta = pow(b, 2) - (4 * (a * c));
  let result = {};

  if (delta < 0) {
    const reduce = reducer(b, (2* a));
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

parser("5 * X^0 + 4 * X^1 = 4 * X^0")
