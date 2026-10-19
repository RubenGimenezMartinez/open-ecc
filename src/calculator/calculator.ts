import { CalculationError } from './calculator.types';
import type {
  Calculator as CalculatorInterface,
  CalculatorOperation,
} from './calculator.types';

function validateOperands(
  a: unknown,
  b: unknown,
  operation: CalculatorOperation
): [number, number] {
  if (typeof a !== 'number' || !Number.isFinite(a)) {
    throw new CalculationError(
      `Calculator.${operation}: invalid operand '${String(a)}' — expected a finite number`,
      operation,
      [a, b]
    );
  }

  if (typeof b !== 'number' || !Number.isFinite(b)) {
    throw new CalculationError(
      `Calculator.${operation}: invalid operand '${String(b)}' — expected a finite number`,
      operation,
      [a, b]
    );
  }

  return [a, b];
}

export class Calculator implements CalculatorInterface {
  add(a: number, b: number): number {
    const [x, y] = validateOperands(a, b, 'add');
    return x + y;
  }

  subtract(a: number, b: number): number {
    const [x, y] = validateOperands(a, b, 'subtract');
    return x - y;
  }

  multiply(a: number, b: number): number {
    const [x, y] = validateOperands(a, b, 'multiply');
    return x * y;
  }

  divide(a: number, b: number): number {
    const [x, y] = validateOperands(a, b, 'divide');

    if (y === 0) {
      throw new CalculationError(
        'Calculator.divide: division by zero — the divisor must not be zero',
        'divide',
        [x, y]
      );
    }

    return x / y;
  }
}
