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

// const reduceExpression2 = (expression, degree, degree_right) => {
//   const rigth_side = expression.split('=')[1];
//   const have_pow_char = expression.includes('^');

//   const a_right = +rigth_side.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
//   const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
//   let result = { first_part: `${(degree_right < degree) ? a - a_right : a_right - a}X^0`, second_part: false, third_part: false };

//   let expression_2 = expression.split(`${have_pow_char ? 'X^' : 'X'}`);
//   expression_2.shift()
//   let is_right = false;
//   expression_l = [];
//   expression_r = [];
//   // parser("8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0")
//   expression_l.push(a)
//   console.log(expression_2)
//   expression_2.map((item, idk) => {
//     if (((item.includes('=') && item.split('=')[1] !== 0) || is_right) && item) {
//       is_right = true;
//       expression_r.push(+item.split('=').join('').split('*').join('').substr(1))
//     } else {
//       expression_l.push(+item.split('*').join('').substr(1))
//     }
//   })
//   console.log(expression_l)
//   console.log(expression_r)
// }

const reduceExpression = (expression, degree, degree_right) => {
  const rigth_side = expression.split('=')[1];
  const have_pow_char = expression.includes('^');

  const a_right = +rigth_side.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1;
  let result = { first_part: `${(degree_right < degree) ? a - a_right : a_right - a}X^0`, second_part: false, third_part: false };
  let result_f = "";

  let expression_l = expression.split('=')[0].split(`${have_pow_char ? 'X^' : 'X'}`);
  let expression_r = expression.split('=')[1].split(`${have_pow_char ? 'X^' : 'X'}`);
  expression_l.shift()
  expression_r.shift()
  let is_right = false;
  expression_l_split = [];
  expression_r_split = [];
  // parser("8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0")
  expression_l_split.push(a);
  expression_r_split.push(a_right);
  // console.log(expression_l)
  // console.log(expression_r)
  expression_l.map((item, idk) => {
    expression_l_split.push(+item.split('*').join('').substr(1))
  })
  expression_r.map(item => {
    expression_r_split.push(+item.split('*').join('').substr(1))
  })
  expression_l_split.pop()
  expression_r_split.pop()
  if (expression_l_split.length > expression_r_split.length) {
    expression_l_split.map((item, id) => {
      if (expression_r_split[id]) {
        result_f += `${expression_l_split[id] - expression_r_split[id]} X^${id} `
      } else {
        result_f += `${expression_l_split[id]} X^${id} `
      }
    })
  } else {
    expression_r_split.map((item, id) => {
      if (expression_l_split[id]) {
        result_f += `${expression_r_split[id] - expression_l_split[id]} X^${id} `
      } else {
        result_f += `${expression_r_split[id]} X^${id} `
      }
    })
  }
  result_f += "= 0"
  console.log(result_f)
  return result_f;
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
