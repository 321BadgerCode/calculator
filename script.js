// Badger
const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let previousAnswer = null;

document.getElementById('previous-answer').addEventListener('click', () => {
	if (previousAnswer !== null) {
		currentInput += previousAnswer;
		updateDisplay();
	}
});

document.getElementById('display').addEventListener('keyup', function(event) {
	if (event.key === 'Enter') {
		calculate();
	}
});

let currentInput = '';
let equation = '';
let shouldResetDisplay = false;

buttons.forEach((button) => {
	button.addEventListener('click', () => {
		if (button.classList.contains('operator')) {
			handleOperator(button.innerText);
		} else if (button.classList.contains('number')) {
			handleNumber(button.innerText);
		} else if (button.classList.contains('equals')) {
			calculate();
		} else if (button.classList.contains('clear')) {
			clearEquationDisplay();
			clearSteps();
			clearDisplay();
		} else if (button.classList.contains('function')) {
			handleFunction(button.innerText);
		} else if (button.classList.contains('variable')) {
			handleVariable(button.innerText);
		}
	});
});

function handleOperator(operator) {
	if (currentInput !== '') {
		equation += currentInput;
		currentInput = '';
	}

	if (equation === '' && previousAnswer !== null) {
		equation = previousAnswer + operator;
	} else {
		equation += operator;
	}

	updateDisplay();
}

function handleNumber(number) {
	currentInput += number;
	updateDisplay();
}

function handleFunction(func) {
	if (currentInput !== '') {
		equation += currentInput;
		currentInput = '';
	}
	equation += func;
	updateDisplay();
}

function handleVariable(variable) {
	currentInput += variable;
	updateDisplay();
}

function updateDisplay() {
	display.value = equation + currentInput; // Display the entire equation
}

function updateEquationDisplay() {
	document.getElementById('equals').textContent = '=';
	document.getElementById('equation').textContent = equation + currentInput;
}

function clearEquationDisplay() {
	document.getElementById('equation').textContent = '';
	document.getElementById('equals').textContent = '';
}

function clearSteps() {
	document.getElementById('steps').innerHTML = '';
}

function clearDisplay() {
	currentInput = '';
	equation = '';
	updateDisplay();
}

function tokenize(input) {
	// Tokenize the input into numbers, operators, functions, and variables
	return input.match(/([0-9]+(?:\.[0-9]*)?)|(\+|\-|\*|\/|\^|\(|\)|sqrt|log|π)|([a-zA-Z_]+[a-zA-Z0-9_]*)/g) || [];
}

const precedence = {
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
	'^': 3
};

function parse(tokens) {
	const outputQueue = [];
	const operatorStack = [];

	const isOperator = (token) => {
		return token in precedence;
	};

	tokens.forEach(token => {
		if (parseFloat(token)) {
			outputQueue.push({ type: 'number', value: parseFloat(token) });
		} else if (token === '(') {
			operatorStack.push(token);
		} else if (token === ')') {
			while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
				outputQueue.push({ type: 'operator', value: operatorStack.pop() });
			}
			if (operatorStack[operatorStack.length - 1] === '(') {
				operatorStack.pop();
			}
		} else if (token in precedence) {
			while (
				operatorStack.length > 0 &&
				isOperator(operatorStack[operatorStack.length - 1]) &&
				precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]
			) {
				outputQueue.push({ type: 'operator', value: operatorStack.pop() });
			}
			operatorStack.push(token);
		} else {
			outputQueue.push({ type: 'function', value: token });
		}
	});

	while (operatorStack.length > 0) {
		outputQueue.push({ type: 'operator', value: operatorStack.pop() });
	}

	return outputQueue;
}

function buildAST(tokens) {
	const stack = [];

	tokens.forEach(token => {
		if (token.type === 'number' || token.type === 'variable') {
			stack.push(token);
		} else if (token.type === 'operator') {
			const right = stack.pop();
			const left = stack.pop();
			stack.push({ type: 'binary', operator: token.value, left, right });
		} else if (token.type === 'function') {
			const argument = stack.pop();
			stack.push({ type: 'function', name: token.value, argument });
		}
	});

	return stack[0];
}

/*function evaluateAST(node) {
	if (node.type === 'number') {
		return node.value;
	} else if (node.type === 'variable') {
		if (node.value === 'π') {
			return Math.PI;
		}
	} else if (node.type === 'binary') {
		const left = evaluateAST(node.left);
		const right = evaluateAST(node.right);
		switch (node.operator) {
			case '+': return left + right;
			case '-': return left - right;
			case '*': return left * right;
			case '/': return left / right;
			case '^': return Math.pow(left, right);
		}
	} else if (node.type === 'function') {
		if (node.argument) {
			const argument = evaluateAST(node.argument);
			switch (node.name) {
				case 'sqrt': return Math.sqrt(argument);
				case 'log': return Math.log(argument);
			}
		}
	}
}*/

function displaySteps(steps) {
	const stepsElement = document.getElementById('steps');
	stepsElement.innerHTML = ''; // Clear previous steps

	steps.forEach((step, index) => {
		const stepText = document.createElement('div');
		stepText.id = "step_clr";
		stepText.textContent = `${step.text} : ${step.explanation}`;

		// Apply different colors based on the step type
		stepText.style.color = step.color;
		stepText.style.fontWeight = 'bold'; // Make the step value bold

		stepsElement.appendChild(stepText);

		// Add a line break except for the last step
		if (index < steps.length - 1) {
			stepsElement.appendChild(document.createElement('br'));
		}
	});
}

// Modify the solveEquationWithSteps function to store the step values
function solveEquationWithSteps(ast) {
	const steps = [];

	function evaluateNode(node) {
		if (node.type === 'number') {
			return { value: node.value, text: node.value.toString(), color: 'blue', explanation: `Given: ${node.value}` };
		} else if (node.type === 'variable') {
			return { value: NaN, text: node.value, color: 'green', explanation: 'Variable' };
		} else if (node.type === 'binary') {
			const left = evaluateNode(node.left);
			const right = evaluateNode(node.right);
			let result;
			let explanation;

			switch (node.operator) {
				case '+':
					result = left.value + right.value;
					explanation = `PEMDAS(Add): ${left.value} + ${right.value}`;
					break;
				case '-':
					result = left.value - right.value;
					explanation = `PEMDAS(Subtract): ${left.value} - ${right.value}`;
					break;
				case '*':
					result = left.value * right.value;
					explanation = `PEMDAS(Multiply): ${left.value} * ${right.value}`;
					break;
				case '/':
					result = left.value / right.value;
					explanation = `PEMDAS(Divide): ${left.value} / ${right.value}`;
					break;
				case '^':
					result = Math.pow(left.value, right.value);
					explanation = `PEMDAS(Exponent): ${left.value} ^ ${right.value}`;
					break;
			}

			const stepText = `(${left.text}${node.operator}${right.text})`;
			steps.push({ value: result, text: stepText, color: 'red', explanation });

			return { value: result, text: stepText, color: 'red', explanation };
		} else if (node.type === 'function') {
			const argument = evaluateNode(node.argument);
			let result;
			let explanation;

			switch (node.name) {
				case 'sqrt':
					result = Math.sqrt(argument.value);
					explanation = `Function(Square Root): sqrt(${argument.value})`;
					break;
				case 'log':
					result = Math.log(argument.value);
					explanation = `Function(Logarithm): log(${argument.value})`;
					break;
			}

			const stepText = `${node.name}(${argument.text})`;
			steps.push({ value: result, text: stepText, color: 'purple', explanation });

			return { value: result, text: stepText, color: 'purple', explanation };
		}

		return { value: NaN, text: '', color: 'black', explanation: 'Unknown' };
	}

	const resultNode = evaluateNode(ast);

	// Display the steps
	displaySteps(steps);

	// Return the final result
	return resultNode.value;
}

function calculate() {
	const input = document.getElementById('display').value;
	const tokens = tokenize(input);
	const postfix = parse(tokens);
	const ast = buildAST(postfix);

	try {
		const result = solveEquationWithSteps(ast);
		previousAnswer = result;
		updateEquationDisplay();
		document.title = equation + currentInput + '=' + result;

		clearDisplay();
		currentInput = result.toString();
		updateDisplay();
	} catch (error) {
		clearDisplay();
		currentInput = 'Error';
		updateDisplay();
	}
}

// Programmer mode

/*let base = 10; // Default base is decimal (base 10)

// Function to change the base
function changeBase(newBase) {
	base = newBase;
	updateDisplay();
}

// Function to convert a number to the current base
function convertToBase(number) {
	switch (base) {
		case 2:
			return '0b' + number.toString(2);
		case 8:
			return '0' + number.toString(8);
		case 16:
			return '0x' + number.toString(16);
		default:
			return number.toString();
	}
}

// Add buttons to change the base
document.getElementById('base-decimal').addEventListener('click', () => changeBase(10));
document.getElementById('base-binary').addEventListener('click', () => changeBase(2));
document.getElementById('base-octal').addEventListener('click', () => changeBase(8));
document.getElementById('base-hex').addEventListener('click', () => changeBase(16));

// Function to shift the current answer left or right
function shiftValue(shiftAmount) {
	if (!isNaN(currentInput)) {
		currentInput = parseInt(currentInput, base);
		currentInput <<= shiftAmount;
		currentInput = convertToBase(currentInput);
		updateDisplay();
	}
}

// Add buttons for shifting
document.getElementById('shift-left').addEventListener('click', () => shiftValue(1));
document.getElementById('shift-right').addEventListener('click', () => shiftValue(-1));

// ... (previous JavaScript code) ...

// Function to perform boolean operations (and, or, xor, not)
function performBooleanOperation(operation) {
	if (!isNaN(currentInput) && !isNaN(previousAnswer)) {
		currentInput = parseInt(currentInput, base);
		previousAnswer = parseInt(previousAnswer, base);

		switch (operation) {
			case 'and':
				currentInput &= previousAnswer;
				break;
			case 'or':
				currentInput |= previousAnswer;
				break;
			case 'xor':
				currentInput ^= previousAnswer;
				break;
			case 'not':
				currentInput = ~currentInput;
				break;
		}

		currentInput = convertToBase(currentInput);
		updateDisplay();
	}
}

// Add buttons for boolean operations
document.getElementById('boolean-and').addEventListener('click', () => performBooleanOperation('and'));
document.getElementById('boolean-or').addEventListener('click', () => performBooleanOperation('or'));
document.getElementById('boolean-xor').addEventListener('click', () => performBooleanOperation('xor'));
document.getElementById('boolean-not').addEventListener('click', () => performBooleanOperation('not'));*/