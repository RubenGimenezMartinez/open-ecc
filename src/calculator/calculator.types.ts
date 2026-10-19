export type CalculatorOperation = 'add' | 'subtract' | 'multiply' | 'divide';

export interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
}

export class CalculationError extends Error {
  public readonly operation: CalculatorOperation;
  public readonly operands: [unknown, unknown];

  constructor(message: string, operation: CalculatorOperation, operands: [unknown, unknown]) {
    super(message);
    this.name = 'CalculationError';
    this.operation = operation;
    this.operands = operands;
    Object.setPrototypeOf(this, CalculationError.prototype);
  }
}
