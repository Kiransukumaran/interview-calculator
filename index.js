#!/usr/bin/env node

const readline = require("readline");
const Lexer = require("./utils/lexer");
const Parser = require("./utils/parser");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt("calc ");
rl.prompt();

var debug = process.argv.slice(2).indexOf("-debug") > -1;
var env = {};

rl.on("line", function (line) {
  try {
    var tokens = new Lexer(line.trim()).tokenize();
    if (debug) {
      console.log(" => ", new Parser(tokens, env).parse());
    }
    console.log(" => ", Parser.evaluate(tokens, env));
  } catch (e) {
    console.error(e);
  }
  rl.prompt();
})
  .on("SIGINT", function () {
    rl.close();
  })
  .on("close", function () {
    process.exit(0);
  });
