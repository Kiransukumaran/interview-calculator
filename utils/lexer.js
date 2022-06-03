var EOF = -1;

function Lexer(input) {
  this.input = input;
  this.c = input[0];
  this.p = 0;
}

Lexer.prototype.tokenize = function () {
  var tokens = [];

  for (var t = this.nextToken(); t !== EOF; t = this.nextToken()) {
    tokens.push(t);
  }

  return tokens;
};

Lexer.prototype.nextToken = function () {
  while (this.c !== EOF) {
    if (/\s/.test(this.c)) {
      this.consume();
      continue;
    } else if (["(", ")", "+", "/"].indexOf(this.c) > -1) {
      return this.symbol();
    } else if(this.c == "-") {
      if(this.isOperator()) {
        return this.symbol();
      }
      else {
        return this.number()
      }
    }else if (this.c === "*") {
      this.consume();
      if (this.c === "*") {
        this.consume();
        return "**";
      } else {
        return "*";
      }
    } else if (this.isNumber(this.c)) {
      return this.number();
    }
  }

  return EOF;
};

Lexer.prototype.isNumber = function (d) {
  return /^[0-9.]$/.test(d);
};

Lexer.prototype.symbol = function () {
  var c = this.c;
  this.consume();
  return c;
};

Lexer.prototype.isOperator = function() {
  return this.isNumber(this.input[this.p -1]) && this.isNumber(this.input[this.p + 1])
}

Lexer.prototype.number = function () {
  var result = [];
  if (this.c === "-") {
    result.push("-");
    this.consume();
  }

  do {
    result.push(this.c);
    this.consume();
  } while (this.c === "." || this.isNumber(this.c));

  var numStr = result.join("");
  if (/^.*\..*\..*$/.test(numStr)) {
    throw "Invalid number: " + numStr;
  }
  return numStr;
};

Lexer.prototype.consume = function () {
  this.p++;
  if (this.p < this.input.length) {
    this.c = this.input[this.p];
  } else {
    this.c = EOF;
  }
};

module.exports = Lexer;
