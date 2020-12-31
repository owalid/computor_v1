const color = require('./color')

const operator = ["+", "-"];

const isNotFloat = (n) => {
  return n % 1 === 0;
}
// if is Int
const isInt = (n) => {
  return !isNaN(n)
}

// get max of two numbers
const getMax = (nb1, nb2) => {
  return (nb1 > nb2) ? +nb1 : +nb2
}

 // home_made sqrt
const sqrt = (number) => {
  let result;
  let x1 = number / 2;
      
  while (result !== x1) {
    result = x1;
    x1 = (result + (number / result)) / 2;
  }
  return result;
}

// get gcd
const gcd = (num, denom) => {
  return denom ? gcd(denom, num % denom) : num;
}

// reducer and get numerator and denominator
const reducer = (numerator, denominator) => { 
  return {
    numerator: numerator / gcd(numerator, denominator),
    denominator: denominator / gcd(numerator, denominator)
  }
}

// reduce sqrt and return rest and the reducce_sqrt
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

// Algorithme for polynome of degree 1
const degree_1 = (expression) => {
  expression = expression.split('=')[0].split(/(?=\+)|(?=-)/g);
  let expression_splited = {};
  expression.map(item => { // get tab of expression like expression_splited[0] return coefficient of X^0
    item = item.replace(' ', '');
    item = item.split('*').join('');
    item = item.split('X^');
    index = +(item[1].trim())
    if (item[1] && item[1].trim()) {
      expression_splited[+index] = { number: (isInt(+item[0])) ? +item[0] : 0 }
    }
  })
  let a = ((Object.keys(expression_splited).includes(1) || Object.keys(expression_splited).includes('1')) && Object.keys(expression_splited[1]).includes('number')) ? +expression_splited[1].number : 0;
  let b = ((Object.keys(expression_splited).includes(0) || Object.keys(expression_splited).includes('0')) && Object.keys(expression_splited[0]).includes('number')) ? +expression_splited[0].number : 0;
  let result = { x: 0 };
  if (a !== 0) {
    result.x = - b / a;
  }
  return (result);
}

// Algorithme for polynome of degree 2
const degree_2 = (expression) => {
  expression = expression.split('=')[0].split(/(?=\+)|(?=-)/g);
  let expression_splited = {};
  expression.map(item => { // get tab of expression like expression_splited[0] return coefficient of X^0
    item = item.replace(' ', '');
    item = item.split('*').join('');
    item = item.split('X^');
    index = +(item[1].trim())
    if (item[1] && item[1].trim()) {
      expression_splited[+index] = { number: (isInt(+item[0])) ? +item[0] : 0 }
    }
  })
  let a = ((Object.keys(expression_splited).includes(2) || Object.keys(expression_splited).includes('2')) && Object.keys(expression_splited[2]).includes('number')) ? +expression_splited[2].number : 0;
  let b = ((Object.keys(expression_splited).includes(1) || Object.keys(expression_splited).includes('1')) && Object.keys(expression_splited[1]).includes('number')) ? +expression_splited[1].number : 0;
  let c = ((Object.keys(expression_splited).includes(0) || Object.keys(expression_splited).includes('0')) && Object.keys(expression_splited[0]).includes('number')) ? +expression_splited[0].number : 0;
  let delta = (b * b) - (4 * (a * c));
  let result = {};
  result.delta = { value: `${b}² - 4 * ${a} * ${c} = ${delta}`, sign: '' }; // get delta
  if (delta < 0) {
    result.delta.sign = "Negatif"
    // const reduce = reducer(b, (2 * a)); // reduce expression
    let z1 = `${-b} - √${-delta}i / ${(2 * a)}`
    let z2 = `${-b} + √${-delta}i / ${(2 * a)}`
    result.z1 = z1.toString();
    result.z2 = z2.toString();
  } else if (delta > 0) {
    result.delta.sign = "Positif"
    if (!isInt(parseFloat(sqrt(delta)))) {
      const reduceDelta = reducerSqrt(delta) // reduce delta
      const reduce = reducer(-b, (2 * a));
      if (reduce.numerator < 100 || reduce.denominator < 100) { // if we have interesting numerator or denominator
        result.reduced_solutions = {}
        result.reduced_solutions.x1_reducer = `${reduce.numerator} - ${(reduceDelta.rest === 0) ? '' : reduceDelta.rest}c${reduceDelta.reduce_sqrt} / ${reduce.denominator}`
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

// which allows to simplify the expression to have only one coefficient per degree.
const simplifyExpression = (expression) => {
  const have_pow_char = expression.includes('^');
  let expression_splited = {};
  let result = ''
  expression = expression.split('=')[0].split(/(?=\+)|(?=\-)/g);
  expression.map(item => {
    if (item !== ' ') {
      item = item.split('*').join('');
      item = item.split(`${have_pow_char ? 'X^' : 'X'}`);
      if (Object.keys(expression_splited).includes(item[1])) { // if number is already exist
        expression_splited[+item[1]].number += (isInt(+item[0])) ? +item[0] : 0
      } else {
        expression_splited[+item[1]] = { number: (isInt(+item[0])) ? +item[0] : 0 }
      }
    }
  })
  Object.keys(expression_splited).map((item, id) => {
    result += `${(expression_splited[item].number >= 0 && id > 0) ? ' + ' : ' '}${expression_splited[item].number} * X^${item}`
  })
  result = result.trim();
  return result;
}

// which allows to reduce the expression when it is not equal to zero
const reduceExpression = (expression, degree) => {
  let expression_l = expression.split('=')[0].split(/(?=\+)|(?=\-)/g);
  let expression_r = expression.split('=')[1].split(/(?=\+)|(?=\-)/g);
  let result = "";
  let expression_l_splited = {};
  let expression_r_splited = {};
  expression_l.map(item => {
    item = item.split('*').join('');
    item = item.split('X');
    expression_l_splited[+item[1]] = { number: +item[0] }
  })
  expression_r.map(item => {
    item = item.split('*').join('');
    item = item.split('X');
    expression_r_splited[+item[1]] = { number: +item[0] }
  })
  if (degree === 0 && Object.keys(expression_l_splited).length === 1 && Object.keys(expression_r_splited).length === 1) {
    if (expression_l_splited['0'].number !== expression_r_splited['0'].number) {
      return { error: "Equation impossible" }
    } else {
      return { message: 'Tout les réels sont solutions' }
    }
  }
  if (Object.keys(expression_l_splited).length >= Object.keys(expression_r_splited).length) { // get who is the bigger left or right ?
    Object.keys(expression_l_splited).map(item => {
      if (Object.keys(expression_r_splited).indexOf(item) !== -1) {
        if (expression_l_splited[item].number - expression_r_splited[item].number !== 0) {
          result += `${(expression_l_splited[item].number - expression_r_splited[item].number > 0) ? '+' : ' '}${expression_l_splited[item].number - expression_r_splited[item].number} * X^${item}`
        } else if (+item === +degree) {
          degree--
        }
      } else {
        if (expression_l_splited[item].number !== 0) {
          result += `${(expression_l_splited[item].number > 0) ? '+' : ' '}${expression_l_splited[item].number} * X^${item}`
        } else if (+item === +degree) {
          degree--
        }
      }
    })
  } else {
    Object.keys(expression_r_splited).map(item => {
      if (Object.keys(expression_l_splited).indexOf(item) !== -1 && expression_l_splited[item].number) {
        if (+expression_l_splited[item].number > 0) {
          if (expression_l_splited[item].number - expression_r_splited[item].number !== 0) {
            result += `${(expression_r_splited[item].number - expression_l_splited[item].number > 0) ? '+' : ' '}${expression_r_splited[item].number - expression_l_splited[item].number} * X^${item}`
          } else if (+item === +degree) {
            degree--
          }
        } else {
          if (expression_l_splited[item].number + expression_r_splited[item].number !== 0) {
            result += `${(expression_r_splited[item].number + expression_l_splited[item].number > 0) ? '+' : ' '}${expression_r_splited[item].number + expression_l_splited[item].number} * X^${item}`
          } else if (+item === +degree) {
            degree--
          }
        }
      } else {
        if (expression_r_splited[item].number !== 0) {
          result += `${(expression_r_splited[item].number > 0) ? '+' : ' '}${expression_r_splited[item].number} * X^${item}`
        } else if (+item === +degree) {
          degree--
        }
      }
    })
  }
  result += " = 0"
  return { result, degree };
}

// Function to clean expression, that allows to work on a good basis of expression
const cleanExpression = (expression, have_two_expr) => {
  // console.log("result", expression)
  splited_with_equals = expression.split('=')
  expression_l_splited = splited_with_equals[0].split(/(?=\+)|(?=\-)/g); // get expression right
  let result = ""
  expression_l_splited.map((item, index_expr) => {
    const sign = (operator.includes(item.charAt(0))) ? item.charAt(0) : '+' // get sign in memory
    item = item.replace(/(\+)|(\-)/g, '')
    if (item.includes('X') && item.indexOf('X') === item.length - 1) { // if we don't have degree
      number = item.split('X')[0]
      if (index_expr === expression_l_splited.length - 1 || !isInt(+expression_l_splited[index_expr + 1])) {
        item = `${number}X1`
      } else {
        item = `${number}X${+expression_l_splited[index_expr + 1]}`
        delete expression_l_splited[index_expr + 1]
      }
    }
    if (!item.includes('X')) { // if we don't have X
      result += `${sign}${item}*X0`
    } else if (item.includes('X') && !isInt(+item.charAt(0))) { // if we don't have coefficient
      result += `${sign}1${item}`
    } else {
      result += `${sign}${item}`
    }
  })
  if (have_two_expr) {
    result += '='
    expression_r_splited = splited_with_equals[1].split(/(?=[\+-])/g);
    expression_r_splited.map((item, index_expr) => {
        const sign = (operator.includes(item.charAt(0))) ? item.charAt(0) : '+'
        item = item.replace(/(\+)|(\-)/g, '')
        if (item.includes('X') && item.indexOf('X') === item.length - 1) { // if we don't have degree
          number = item.split('X')[0]
          if (index_expr === expression_r_splited.length - 1 || !isInt(+expression_r_splited[index_expr + 1])) {
            item = `${number}X1`
          } else {
            item = `${number}X${+expression_r_splited[index_expr + 1]}`
            delete expression_r_splited[index_expr + 1]
          }
        }
        if (!item.includes('X')) { // if we don't have X
          result += `${sign}${item}*X0`
        } else if (item.includes('X') && !isInt(+item.charAt(0))) { // if we don't have coefficient
          result += `${sign}1${item}`
        } else {
          result += `${sign}${item}`
        }
    })
  }
  return result
}

// Get degree of expression
const getDegrees = (expression, have_two_expr) => {
  splited_with_equals = expression.split('=')
  expression_l_splited = splited_with_equals[0].split(/(?=\+)|(?=\-)/g);
  let cpt_r = 0
  let cpt_l = 0
  expression_l_splited.map(item => {
    if (isInt(item) && item < 0) {
      cpt_r = +item
    } else {
      item = item.replace(/(\+)|(\-)/g, '')
      item = item.split('X')
      let current_degree = item[1]
      if (!isNotFloat(current_degree)) {
        current_degree = current_degree.replace(',', '.')
        cpt_l = parseFloat(current_degree)
      } else if (isNotFloat(cpt_l) && +current_degree > cpt_l && cpt_l >= 0) {
        cpt_l = +current_degree
      }
    }
  })
  if (have_two_expr) {
    expression_r_splited = splited_with_equals[1].split(/(?=\+)|(?=\-)/g);
    expression_r_splited.map(item => {
      if (isInt(item) && item < 0) {
        cpt_r = +item
      } else {
        item = item.replace(/(\+)|(\-)/g, '')
        item = item.split('X')
        let current_degree = item[1]
        if (!isNotFloat(current_degree)) {
          current_degree = current_degree.replace(',', '.')
          cpt_r = parseFloat(current_degree)
        } else if (isNotFloat(cpt_r) && +current_degree > cpt_r && cpt_r >= 0) {
          cpt_r = +current_degree
        }
      }
    })
  }
  return { left: +cpt_l, right: +cpt_r }
}
const getErrorDegree = (degree_number_left, degree_number_right) => {
  let error = null
  if (!isNotFloat(degree_number_left)) {
     error = `Polynome non entier: ${degree_number_left}\nVeuillez entrer un polynome entier de rang inferieur ou egal a 2 et supérieur à 0`
  } else if (!isNotFloat(degree_number_right)) {
     error = `Polynome non entier: ${degree_number_right}\nVeuillez entrer un polynome entier de rang inferieur ou egal a 2 et supérieur à 0`
  } else if (degree_number_left < 0) {
     error = `Polynome negatif: ${degree_number_left}\nVeuillez entrer un polynome de rang inferieur ou egal a 2 et supérieur à 0`
  } else if (degree_number_right < 0) {
     error = `Polynome negatif: ${degree_number_right}\nVeuillez entrer un polynome de rang inferieur ou egal a 2 et supérieur à 0`
  }
  return error
}
const format_expression = (expression) => {
  let result = expression

  result = result.trim();
  result = result.replace(/\s+/g, '');
  result = result.replace(/\n/g,'');
  result = result.split('\\').join('');
  result = result.split('^').join('');
  result = result.toUpperCase();
  
  return result
}

// Calculate an expression
const calculate = (expression) => {
  try {
    let have_two_expr = (expression.includes('=') && +expression.split('=')[1] !== 0)
    expression = format_expression(expression)
    expression = cleanExpression(expression, have_two_expr);
      const degrees = getDegrees(expression, have_two_expr)
      let degree_number_left = degrees.left;
      let degree_number_right = degrees.right;
      const errorDegree = getErrorDegree(degree_number_left, degree_number_right)
      if (errorDegree !== null) {
        return { error: errorDegree }
      }
     
      const biggest_degree = +getMax(degree_number_left, degree_number_right)

      let result =  { degree_number: +biggest_degree, reduced: null }
      if (biggest_degree > 2) {
        return { error: `Polynome de degré : ${result.degree_number}\nVeuillez entrer un polynome de rang inferieur ou egal à 2` }
      }
      if (have_two_expr) {
        const reduced_expression = reduceExpression(expression, biggest_degree);
        result.reduced = reduced_expression.result.trim()
        if ((+degree_number_left === 0 && +degree_number_right === 0) || (typeof reduced_expression === 'object' && Object.keys(reduced_expression).includes('error'))) {
          return reduced_expression
        }
        expression = result.reduced.trim();
        result.degree_number = reduced_expression.degree
      }
      expression = simplifyExpression(expression);
      result.reduced = expression;
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
    } catch (e) {
      console.log(e)
      return { error: "Erreur de format" }
    }
  }
  
  
const args = process.argv.slice(2);
if (args.length === 1) {
  try {    
    color.colog(`\nEquation: ${args[0]}\n`, "lblue")
    const res = calculate(args[0])
    if (Object.keys(res).includes("error")) {
      color.colog(res.error, "red")
    } else if (Object.keys(res).includes("message")) {
      color.colog(res.message, "green")
    } else if (typeof res === 'object' && Object.keys(res).includes('degree_number') && Object.keys(res).includes('reduced') && Object.keys(res).includes('solutions')) {
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
    } else {
      console.log(res)
      color.colog("Veuillez entrer une equation bien formaté contenant que des nombres.\nExemple: \"5X^2 - X + 3 * X^1 - 1 X^2 = 0\"\nUsage: node main.js", "red")
    }
  } catch (error) {
    console.log(error)
    color.colog("Veuillez entrer une equation bien formaté.\nExemple: \"5X^2 - X + 3 * X^1 - 1 X^2 = 0\"\nUsage: node main.js", "red")
  }
} else {
  color.colog("Veuillez entrer une equation bien formaté.\nExemple: \"5X^2 - X + 3 * X^1 - 1 X^2 = 0\"\nUsage: node main.js", "red")
}
