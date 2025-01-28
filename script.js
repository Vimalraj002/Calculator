const display = document.getElementById('input-display');

// Load the last saved expression from local storage
window.onload = () => {
    const lastExpression = localStorage.getItem('lastExpression');
    if (lastExpression) {
        display.value = lastExpression;
    }
};

function appendValue(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
    localStorage.setItem('lastExpression', ''); // Clear local storage
}

function backSpace() {
    display.value = display.value.slice(0, -1);
    localStorage.setItem('lastExpression', display.value); // Update local storage
}

function calculateResult() {
    const expression = display.value;
    const result = evaluateExpression(expression);

    // Save the current expression to local storage
    localStorage.setItem('lastExpression', `${expression} = ${result}`);

    display.value = result;
}

function evaluateExpression(expression) {
    const operators = {
        '+': { precedence: 1, operation: (a, b) => a + b },
        '-': { precedence: 1, operation: (a, b) => a - b },
        '*': { precedence: 2, operation: (a, b) => a * b },
        '/': { precedence: 2, operation: (a, b) => a / b }
    };

    const values = []; // Stack for numbers
    const ops = [];    // Stack for operators

    let currentNumber = '';

    // Helper function to evaluate top of stacks
    function evaluate() {
        const b = values.pop();
        const a = values.pop();
        const op = ops.pop();
        values.push(operators[op].operation(a, b));
    }

    for (let char of expression) {
        if (char in operators) {
            // Push the current number to the values stack
            if (currentNumber) {
                values.push(parseFloat(currentNumber));
                currentNumber = '';
            }

            // Evaluate while the operator on top of the stack has higher or equal precedence
            while (ops.length && operators[ops[ops.length - 1]].precedence >= operators[char].precedence) {
                evaluate();
            }

            ops.push(char); // Push the current operator
        } else {
            // Accumulate digits for the current number
            currentNumber += char;
        }
    }

    // Push the last number
    if (currentNumber) {
        values.push(parseFloat(currentNumber));
    }

    // Evaluate remaining operators
    while (ops.length) {
        evaluate();
    }

    return values[0];
}
