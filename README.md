# Math Interpreter Calculator

The Math Interpreter Calculator is a web-based calculator that allows users to perform mathematical calculations, including evaluating expressions with support for various mathematical operations and functions. This calculator not only calculates the result but also displays a step-by-step breakdown of the calculation process.

<center><img alt="Icon" src="./icon.ico"/></center>

```diff
- Decimals are not yet supported. See the TODO list down below for more info.
```
## Features

- Basic arithmetic operations: Addition, subtraction, multiplication, and division.
- Exponents and square root calculations.
- Support for parentheses to control the order of operations (PEMDAS).
- Display of step-by-step calculation with explanations.
- Clear and user-friendly interface.

## Usage

1. Enter your mathematical expression in the input box.
2. Click the "=" button to calculate the result.
3. The result will be displayed in the input box, and the steps used to calculate it will be shown below the input box.

## To-Do List

- [ ] Fix text color for explanations in the step-by-step display.
	- The nodes/terms(numbers, operators, and functions) should have different colors.
- [ ] Add support for decimals in calculations.
- [ ] Implement common mathematical functions (e.g., `sqrt`, `log`).
- [ ] Integrate constants like `pi` and `e` for calculations.
- [ ] Fix and implement the programmer mode for base conversions, shifting, and boolean operations.

## Developer Notes

The Math Interpreter Calculator uses a custom-built parser and evaluator to handle mathematical expressions. The step-by-step display of calculations is designed to help users understand how each result is obtained.

## Contributions

Contributions to this project are welcome! Feel free to open issues or submit pull requests to help improve the calculator.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
