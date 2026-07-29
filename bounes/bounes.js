const { log } = require("console");
const { start } = require("repl");

/*
14. Longest Common Prefix
Easy Topics Companies
Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

 

Example 1:

Input: strs = ["flower","flow","flight"]
Output: "fl"
Example 2:

Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
*/
const strs = ["flower","flow","flight"];

const longestCommonPrefix = function (strs) {
  let result = "";
  let resultChar = "";

  let prefix = [];

  function maxlength(array) {
    prefix = []
    for (let i = 0; i < array.length; i++) {
      prefix.push(array[i].length);
    }
    // console.log({ maxPrefix: Math.max(...prefix) });
    return Math.max(...prefix);
  }

  function elementOfMaxlength(arr) {
    const match = arr.find((ele) => {
      return ele.length == maxlength(strs);
    });
    return arr.indexOf(match);
  }
  
  for (let indexOfChar = 0; indexOfChar < maxlength(strs); indexOfChar++) {
    let checkChar = strs[elementOfMaxlength(strs)][indexOfChar];
    let num = 0;

    for (let indexOfWord = 0; indexOfWord < strs.length; indexOfWord++) {
      let char = strs[indexOfWord][indexOfChar];

      if (char == checkChar) {
        resultChar = char;
        num++;
        // console.log({ resultChar, num });
      } else {
        break;
      }
      if (num == strs.length) {
        result += resultChar;
      }
      // console.log({ result });
    }
  }
  return result;
};
console.log(longestCommonPrefix(strs));


//🕺💃💃🏃‍♂️🏃‍♂️🕺💃💃🕺🕺🕺🕺 
//stared 2:16 Ended 5:34