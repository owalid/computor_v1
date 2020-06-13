const separator = ["+", "*", "/", "-"];

const sqrt = (number) => {
  var lo = 0, hi = number;
    while(lo <= hi) {
      var mid = Math.floor((lo + hi) / 2);
      if (mid * mid > number) hi = mid - 1;
      else lo = mid + 1;
    }
    return hi;
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
  if (expression.includes('=') && expression.split('=')[1] !== 0) {
    console.log("reduceExpression");
  }

  const split_degree = expression.split('^')
  const degree_number = +split_degree[split_degree.length - 1].charAt(0);

  if (degree_number === 2) {
    degree_2(expression);
  } else if (degree_number === 1) {
    degree_1(expression);
  } else {
    console.log("sorry")
  }
}

const degree_1 = (expression) => {
  const a = +expression.split("X^0")[1].split("X^1")[0].split('*').join('') || 0;
  const b = +expression.split("X^0")[0].split('*').join('') || 1 || 0;
  let result = {}

  if (a > 0) {
    result.x = b / a;
  }
}

const degree_2 = (expression) => {
  const a = +expression.split("X^0")[1].split("X^1")[1].split("X^2")[0].split('*').join('') || 1;
  const b = +expression.split("X^0")[1].split("X^1")[0].split('*').join('') || 1;
  const c = +expression.split("X^0")[0].split('*').join('') || 1;
  let delta = pow(b, 2) - (4 * (a * c));
  let result = {};

  if (delta < 0) {
    let z1 = `${-b} - ${Math.sqrt(-delta)}i / ${(2 * a)}`;
    let z2 = `${-b} + ${Math.sqrt(-delta)}i / ${(2 * a)}`;
    result.z1 = z1.toString();
    result.z2 = z2.toString();
  } else if (delta > 0) {
    result.x1 = parseFloat((-b - Math.sqrt(delta)) / (2 * a), 3)
    result.x2 = parseFloat((-b + Math.sqrt(delta)) / (2 * a), 3)
  } else {
    result.x0 = parseFloat(-b / (2 * a))
  }
  console.log(result)
}

parser("5 * X^0 + 14 * X^1 + 11 * X^2")