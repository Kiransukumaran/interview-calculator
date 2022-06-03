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

var env = {};
let result;

rl.on("line", function (line) {
  try {
    let tokens;
    if (result) {
      tokens = new Lexer((result + line).trim()).tokenize();
    } else {
      tokens = new Lexer(line.trim()).tokenize();
    }
    result = Parser.evaluate(tokens, env);
    console.log(" => ", result);
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
