function Parser(tokens, env) {
  this.tokens = tokens;
  this.env = env;
}

Parser.evaluate = function (expr, env) {
  const p = new Parser(expr, env);
  return Parser.calculate(p.parse(), env);
};

Parser.calculate = function (input, env) {
  if (input.type === "number") {
    return input.value;
  } else if (input.type === "operator") {
    const lhs = this.calculate(input.lhs, env);
    const rhs = this.calculate(input.rhs, env);
    switch (input.value) {
      case "*":
        return lhs * rhs;
      case "+":
        return lhs + rhs;
      case "-":
        return lhs - rhs;
      case "/":
        return lhs / rhs;
      default:
        throw "Not found: " + input.value;
    }
  } else if (input.type === "expression") {
    return this.calculate(input.subtree, env);
  }
};

Parser.prototype.parse = function () {
  return this.parseHelper(this.tokens);
};

Parser.prototype.parseParentExpressions = function (tokenArray) {
  return { type: "expression", subtree: this.parseHelper(tokenArray) };
};

Parser.prototype.handleParentExpressions = function (tokenArray) {
  let parentLHS;
  do {
    parentLHS = tokenArray.indexOf("(");
    if (parentLHS > -1) {
      const parentRHS = this.findMatchingParent(tokenArray, parentLHS);
      var expr = this.parseParentExpressions(
        tokenArray.slice(parentLHS + 1, parentRHS)
      );
      tokenArray.splice(parentLHS, parentRHS - parentLHS + 1, expr);
    }
  } while (parentLHS > -1);
};

Parser.prototype.parseHelper = function (tokenArray) {
  this.handleParentExpressions(tokenArray);
  const ops = ["+", "-", "*", "/"];

  let inputOperator, tokenIndex;

  for (const operator of ops) {
    tokenIndex = tokenArray.indexOf(operator);
    if (tokenIndex > -1) {
      inputOperator = operator;
      break;
    }
  }

  if (tokenIndex > -1) {
    return {
      type: "operator",
      value: inputOperator,
      lhs: this.parseHelper(tokenArray.slice(0, tokenIndex)),
      rhs: this.parseHelper(
        tokenArray.slice(tokenIndex + 1, tokenArray.length)
      ),
    };
  } else if (
    tokenArray.length === 1 &&
    ["expression"].indexOf(tokenArray[0].type) > -1
  ) {
    return tokenArray[0];
  } else if (tokenArray.length === 1 && /[-0-9.]+/.test(tokenArray[0])) {
    return { type: "number", value: parseFloat(tokenArray[0]) };
  }
  throw `Cannot process: ${tokenArray}`;
};

Parser.prototype.findMatchingParent = function (tokens, lparenIdx) {
  var parentStack = 1;
  var i = lparenIdx + 1;
  while (i < tokens.length && parentStack > 0) {
    if (tokens[i] === "(") {
      parentStack += 1;
    } else if (tokens[i] === ")") {
      parentStack -= 1;
    }
    i++;
  }
  if (parentStack === 0) return i - 1;
  else throw "No parent found";
};

module.exports = Parser;
