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

const pow = (number, pow) => {
  let result;
  while (pow > 0) {
    result = number * number;
    pow--;
  }
  return result;
}

const parser = (expression) => {
  expression = expression.trim();
  expression = expression.split(' ').join('');
  expression = expression.toUpperCase()
  if (expression.includes('=') && expression.split('=')[1] !== 0) {
    console.log("reduceExpression");
  }

  let degree_number;
  if (expression.includes('^')) {
    const split_degree = expression.split('^')
    degree_number = +split_degree[split_degree.length - 1].charAt(0);
  } else {
    const split_degree = expression.split('X')
    degree_number = +split_degree[split_degree.length - 1].charAt(0);
  }
  let result =  {degree_number: degree_number}
  if (degree_number === 2) {
    result.solutions = degree_2(expression);
  } else if (degree_number === 1) {
    result.solutions = degree_1(expression);
  } else {
    console.log("sorry")
  }
  console.log(result)
}

const degree_1 = (expression) => {
  const have_pow_char = expression.includes('^');
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[0].split('*').join('') || 0;
  const b = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1 || 0;
  let result = {};

  if (a > 0) {
    result.x = b / a;
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

parser("111 X0 + 14 X1 + 1 X2")