//types of functions
// 1. Named Function
function myFunction() {
    console.log("This is a named function");
}
myFunction();

// 2. Anonymous Function
const anonymousFunction = function() {
    console.log("This is an anonymous function");
};
anonymousFunction();
// 3. Arrow Function
const arrowFunction = () => {
    console.log("This is an arrow function");
};
arrowFunction();
// 4. Immediately Invoked Function Expression (IIFE)
(function iifeFunction() {
    console.log("This is an IIFE");
})();
// 5. Recursive Function
function recursiveFunction(n) {
    if (n === 0) {
        console.log("Base case reached");
        return;
    }
    console.log("Recursive call:", n);
    recursiveFunction(n - 1);
}
recursiveFunction(3);
// 6. Callback Function
function greet(name, callback) {
  console.log("Hi " + name);
  callback();
}

function sayBye() {
  console.log("Bye!");
}

greet("Praveen", sayBye);

