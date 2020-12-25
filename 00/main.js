const color = require('./color')

const operator = ["+", "-"];

getMax = (nb1, nb2) => {
  return (nb1 > nb2) ? +nb1 : +nb2
}

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
  return { rest: rest, reduce_sqrt: sqrt_number }
}

const simplifyExpression = (expression, degree) => {
  const have_pow_char = expression.includes('^');
  let expression_splited = {};
  const result = { degree: degree, expression: '' };
  expression = expression.split('=')[0].split(/(?=\+)|(?=\-)/g);
  expression.map(item => {
    item = item.split('*').join('');
    item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
    if (Object.keys(expression_splited).includes(item[1])) {
      expression_splited[+item[1]].number += (isInt(+item[0])) ? +item[0] : 0
    } else {
      if (+item[0] === 0) {
        result.degree--;
      } else {
        expression_splited[+item[1]] = {number: (isInt(+item[0])) ? +item[0] : 0}
      }
    }
  })
  Object.keys(expression_splited).map((item, id) => {
    result.expression += `${(expression_splited[item].number >= 0 && id > 0) ? ' + ' : ' '}${expression_splited[item].number} * X^${item}`
  })
  result.expression = result.expression.trim();
  result.degree = Object.keys(expression_splited).length - 1
  return result;
}

const reduceExpression = (expression, degree) => {
  const have_pow_char = expression.includes('^');
  let expression_l = expression.split('=')[0].split(/(?=\+)|(?=\-)/g);
  let expression_r = expression.split('=')[1].split(/(?=\+)|(?=\-)/g);
  let result = "";

  let expression_l_splited = {};
  let expression_r_splited = {};
  expression_l.map(item => {
    item = item.split('*').join('');
    item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
    expression_l_splited[+item[1]] = {number: +item[0]}
  })
  expression_r.map(item => {
    item = item.split('*').join('');
    item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
    expression_r_splited[+item[1]] = {number: +item[0]}
  })
  if (degree === 0 && Object.keys(expression_l_splited).length === 1 && Object.keys(expression_r_splited).length === 1) {
    if (expression_l_splited['0'].number !== expression_r_splited['0'].number) {
      return { error: "Equation impossible" }
    } else {
      return { message: 'Tout les réels sont solutions' }
    }
  }
  if (Object.keys(expression_l_splited).length >= Object.keys(expression_r_splited).length) {
    Object.keys(expression_l_splited).map(item => {
      if (Object.keys(expression_r_splited).indexOf(item) !== -1) {
        result += `${(expression_l_splited[item].number - expression_r_splited[item].number >= 0) ? '+' : ' '}${expression_l_splited[item].number - expression_r_splited[item].number} * X^${item}`
      } else {
        result += `${(expression_l_splited[item].number >= 0) ? '+' : ' '}${expression_l_splited[item].number} * X^${item}`
      }
    })
  } else {
    Object.keys(expression_r_splited).map(item => {
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

const degree_0 = (expression) => {
  const have_pow_char = expression.includes('^');
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[0].split('*').join('') || 1 || 0;
  let result = {x: a};

  return result;
}

const degree_1 = (expression) => {
  const have_pow_char = expression.includes('^');
  const a = +expression.split(`${have_pow_char ? 'X^0' : 'X0'}`)[1].split(`${have_pow_char ? 'X^1' : 'X1'}`)[0].split('*').join('').replace('+', '').replace(' ', '') || 0;
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
  let expression_splited = {};
  expression.map(item => {
    item = item.replace(' ', '');
    item = item.split('*').join('');
    item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
    index = +(item[1].trim())
    if (item[1] && item[1].trim()) {
      expression_splited[+index] = {number: (isInt(+item[0])) ? +item[0] : 0}
    }
  })
  let a = ((Object.keys(expression_splited).includes(2) || Object.keys(expression_splited).includes('2')) && Object.keys(expression_splited[2]).includes('number')) ? +expression_splited[2].number : 0;
  let b = ((Object.keys(expression_splited).includes(1) || Object.keys(expression_splited).includes('1')) && Object.keys(expression_splited[1]).includes('number')) ? +expression_splited[1].number : 0;
  let c = ((Object.keys(expression_splited).includes(0) || Object.keys(expression_splited).includes('0')) && Object.keys(expression_splited[0]).includes('number')) ? +expression_splited[0].number : 0;
  let delta = (b * b) - (4 * (a * c));
  let result = {};
  result.delta = { value: `${b}² - 4 * ${a} * ${c} = ${delta}`, sign: "" };
  if (delta < 0) {
    result.delta.sign = "Negatif"
    const reduce = reducer(b, (2 * a));
    let z1 = `${-reduce.numerator} - ${sqrt(-delta)}i${(reduce.denominator ===  1) ? '' : ' / ' + reduce.denominator }`;
    let z2 = `${-reduce.numerator} + ${sqrt(-delta)}i${(reduce.denominator === 1) ? '' : ' / ' + reduce.denominator }`;
    result.z1 = z1.toString();
    result.z2 = z2.toString();
  } else if (delta > 0) {
    result.delta.sign = "Positif"
    if (!isInt(parseFloat(sqrt(delta)))) {
      const reduceDelta = reducerSqrt(delta)
      const reduce = reducer(-b, (2 * a));
      if (reduce.numerator < 100 || reduce.denominator < 100) {
        result.reduced_solutions = {}
        result.reduced_solutions.x1_reducer = `${reduce.numerator} - ${(reduceDelta.rest === 0) ? '' : reduceDelta.rest}√${reduceDelta.reduce_sqrt} / ${reduce.denominator}`
        result.reduced_solutions.x2_reducer = `${reduce.numerator} + ${(reduceDelta.rest === 0) ? '' : reduceDelta.rest}√${reduceDelta.reduce_sqrt} / ${reduce.denominator}`
      }
    }
    result.x1 = parseFloat((-b - Math.sqrt(delta)) / (2 * a));
    result.x2 = parseFloat((-b + Math.sqrt(delta)) / (2 * a));
  } else {
    result.delta.sign = "Nul"
    result.x0 = parseFloat(-b / (2 * a));
  }
  return result;
}

cleanExpression = (expression, have_two_expr) => {
  splited_with_equals = expression.split('=')
  expression_l_splited = splited_with_equals[0].split(/(?=\+)|(?=\-)/g);
  let result = ""
  expression_l_splited.map(item => {
    const sign = (operator.includes(item.charAt(0))) ? item.charAt(0) : '+'
    item = item.replace(/(\+)|(\-)/g, '')
    if (item.includes('X') && item.indexOf('X') === item.length - 1) {
      number = item.split('X')[0]
      item = `${number}X^1`
    }
    if (!item.includes('X')) {
      result += `${sign}${item}*X^0`
    } else if (item.includes('X') && !isInt(+item.charAt(0))) {
      result += `${sign}1${item}`
    } else {
      result += `${sign}${item}`
    }
  })
  if (have_two_expr) {
    result += '='
    expression_r_splited = splited_with_equals[1].split(/(?=\+)|(?=\-)/g);
    expression_r_splited.map(item => {
      const sign = (operator.includes(item.charAt(0))) ? item.charAt(0) : '+'
      item = item.replace(/(\+)|(\-)/g, '')
      if (item === 'X') {
        item = '1X^1'
      }
      if (!item.includes('X')) {
        result += `${item}*X^0`
      } else if (item.includes('X') && !isInt(+item.charAt(0))) {
        result += `${sign}1${item}`
      } else {
        result += `${sign}${item}`
      }
    })
  }
  return result
}

getDegrees = (expression, have_two_expr) => {
  splited_with_equals = expression.split('=')
  expression_l_splited = splited_with_equals[0].split(/(?=\+)|(?=\-)/g);
  let cpt_r = 0
  let cpt_l = 0
  expression_l_splited.map(item => {
    item = item.replace(/(\+)|(\-)/g, '')
    const current_degree = item.charAt(item.length - 1)
    if (+current_degree > cpt_l) {
      cpt_l = +current_degree
    }
  })
  if (have_two_expr) {
    expression_r_splited = splited_with_equals[1].split(/(?=\+)|(?=\-)/g);
    expression_r_splited.map(item => {
      item = item.replace(/(\+)|(\-)/g, '')
      const current_degree = item.charAt(item.length - 1)
      if (+current_degree > cpt_r) {
        cpt_r = +current_degree
      }
    })
  }
  return { left: +cpt_l, right: +cpt_r }
}

calculate = (expression) => {
  // try {

    let have_two_expr = (expression.includes('=') && +expression.split('=')[1] !== 0)
    expression = expression.trim();
    expression = expression.split(' ').join('');
    expression = expression.toUpperCase();
    expression = cleanExpression(expression, have_two_expr);
    
    const degrees = getDegrees(expression, have_two_expr)
    let degree_number_left = degrees.left;
    let degree_number_right = degrees.right;
    const biggest_degree = +getMax(degree_number_left, degree_number_right)

    let result =  { degree_number: +biggest_degree, reduced: null }
    if (biggest_degree > 2) {
      return { error: `Polynome de degré : ${result.degree_number}\nVeuillez entrer un polynome de rang inferieur ou egal à 2` }
    }
    if (have_two_expr) {
      result.reduced = reduceExpression(expression, result.degree_number, degree_number_right);
      if ((+degree_number_left === 0 && +degree_number_right === 0) || (typeof result.reduced === 'object' && Object.keys(result.reduced).includes('error'))) {
        return result.reduced
      }
      expression = result.reduced;
      result.degree_number = (degree_number_right > degree_number_left) ? degree_number_right : degree_number_left;
    }
    let simplify_expr = simplifyExpression(expression, result.degree_number);
    result.reduced = simplify_expr.expression;
    expression = simplify_expr.expression;
    if (result.degree_number === 2) {
      result.solutions = degree_2(expression);
      result.delta = result.solutions.delta;
      if (Object.keys(result.solutions).includes('reduced_solutions')) {
        result.reduced_solutions = result.solutions.reduced_solutions;
        delete result.solutions.reduced_solutions;
      }
      delete result.solutions.delta;
    } else if (result.degree_number === 1) {
      result.solutions = degree_1(expression);
    } else if (result.degree_number === 0) {
      result.error = "Equation impossible..."
    }
    return result;
  // } catch (e) {
  //   return { error: "Erreur de format" }
  // }
  }
  
  
  const args = process.argv.slice(2);
  if (args.length === 1) {
    color.colog(`\nEquation: ${args[0]}\n`, "lblue")
    const res = calculate(args[0])
    if (Object.keys(res).includes("error")) {
      color.colog(res.error, "red")
    } else if (Object.keys(res).includes("message")) {
      color.colog(res.message, "green")
    } else {
      color.colog(`Polynome de degré : ${res.degree_number}\n`, "lcyan")
    color.colog(`Expression simplifié: ${res.reduced} = 0\n`, "lcyan")
    if (Object.keys(res).includes("delta") && res.delta) {
      color.colog(`Δ : ${res.delta.value}`, "lmagenta")
      color.colog(`Signe de delta: ${res.delta.sign}\n`, "lmagenta")
    }
    color.colog("Solutions:", "green")
    for (const [key, value] of Object.entries(res.solutions)) {
      color.colog(`${key}: ${value}`, "lgreen")
    }
  }
} else {
  color.colog("Veuillez entrer une equation bien formaté.\nExemple: \"5X^2 - X + 3 * X^1 - 1 X^2 = 0\"\nUsage: node main.js \"<Equation>\"", "red")
}


// Degré 0:
// 5 * X^0 = 5 * X^0 // possible
// 4 * X^0 = 8 * X^0 // impossible

// Degré 1:
// 5 * X^0 = 4 * X^0 + 7 * X^1

// Degré 2:
// 5 * X^0 + 13 * X^1 + 3 * X^2 = 1 * X^0 + 1 * X^1 // positif
// 6 * X^0 + 11 * X^1 + 5 * X^2 = 1 * X^0 + 1 * X^1 // null
// 5 * X^0 + 3 * X^1 + 3 * X^2 = 1 * X^0 + 0 * X^1 // négatif