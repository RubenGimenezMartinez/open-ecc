import assert from 'node:assert/strict';
import { Calculator } from '../../src/calculator/calculator';
import { CalculationError } from '../../src/calculator/calculator.types';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (error) {
    failed += 1;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`FAIL: ${name} — ${message}`);
  }
}

function assertEqual(actual: unknown, expected: unknown, message?: string): void {
  if (message) {
    assert.equal(actual, expected, message);
  } else {
    assert.equal(actual, expected);
  }
}

function assertThrows(fn: () => void, expectedMessage?: string): void {
  if (expectedMessage) {
    assert.throws(fn, new RegExp(expectedMessage));
  } else {
    assert.throws(fn);
  }
}

function assertInstanceOf(value: unknown, constructor: new (...args: unknown[]) => Error): void {
  assert.ok(value instanceof constructor, `expected instance of ${constructor.name}`);
}

// ----- Happy path: add -----
test('add returns the sum of two positive numbers', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.add(2, 3), 5);
});

test('add returns the sum of two negative numbers', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.add(-2, -3), -5);
});

test('add returns the sum of a positive and a negative number', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.add(10, -4), 6);
});

test('add handles decimal (float) inputs', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.add(0.1, 0.2), 0.30000000000000004);
});

test('add returns zero when adding zero to a number', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.add(7, 0), 7);
  assertEqual(calc.add(0, 7), 7);
});

// ----- Happy path: subtract -----
test('subtract returns the difference of two positive numbers', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.subtract(10, 4), 6);
});

test('subtract returns a negative result when subtracting a larger number', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.subtract(4, 10), -6);
});

test('subtract handles decimal (float) inputs', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.subtract(1.5, 0.5), 1);
});

// ----- Happy path: multiply -----
test('multiply returns the product of two positive numbers', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.multiply(3, 4), 12);
});

test('multiply returns a negative product when signs differ', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.multiply(-3, 4), -12);
  assertEqual(calc.multiply(3, -4), -12);
});

test('multiply returns a positive product when both signs are negative', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.multiply(-3, -4), 12);
});

test('multiply returns zero when multiplying by zero', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.multiply(5, 0), 0);
  assertEqual(calc.multiply(0, 5), 0);
});

test('multiply handles decimal (float) inputs', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.multiply(1.5, 2), 3);
});

// ----- Happy path: divide -----
test('divide returns the quotient of two positive numbers', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.divide(10, 2), 5);
});

test('divide returns a negative quotient when signs differ', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.divide(-10, 2), -5);
  assertEqual(calc.divide(10, -2), -5);
});

test('divide handles decimal (float) inputs', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.divide(1, 4), 0.25);
});

test('divide returns one when dividing a number by itself', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertEqual(calc.divide(7, 7), 1);
});

// ----- Type-safety / interface check -----
test('Calculator exposes the four arithmetic operations', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assert.equal(typeof calc.add, 'function');
  assert.equal(typeof calc.subtract, 'function');
  assert.equal(typeof calc.multiply, 'function');
  assert.equal(typeof calc.divide, 'function');
});

// ----- Error handling: divide by zero -----
test('divide by zero throws a descriptive CalculationError', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.divide(5, 0), 'division by zero');
  assertThrows(() => calc.divide(0, 0), 'division by zero');
  assertThrows(() => calc.divide(-3, 0), 'division by zero');
});

// ----- Error handling: invalid inputs (NaN / Infinity) -----
test('add throws CalculationError when first operand is NaN', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.add(NaN, 2), 'invalid operand');
});

test('add throws CalculationError when second operand is NaN', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.add(2, NaN), 'invalid operand');
});

test('add throws CalculationError when an operand is Infinity', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.add(Infinity, 2), 'invalid operand');
  assertThrows(() => calc.add(2, -Infinity), 'invalid operand');
});

test('divide throws CalculationError when dividend is NaN', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.divide(NaN, 2), 'invalid operand');
});

test('multiply throws CalculationError when an operand is Infinity', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.multiply(Infinity, 2), 'invalid operand');
});

test('subtract throws CalculationError when an operand is NaN', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.subtract(NaN, 2), 'invalid operand');
});

// ----- Error handling: invalid inputs (non-number at runtime) -----
test('add throws CalculationError when an operand is null', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.add(null as unknown as number, 2), 'invalid operand');
});

test('add throws CalculationError when an operand is undefined', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.add(undefined as unknown as number, 2), 'invalid operand');
});

test('add throws CalculationError when an operand is a non-numeric string', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  assertThrows(() => calc.add('abc' as unknown as number, 2), 'invalid operand');
});

// ----- Error thrown is a CalculationError instance -----
test('divide by zero throws an instance of CalculationError', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  const { CalculationError } = require('../../src/calculator/calculator.types');
  try {
    calc.divide(5, 0);
    assert.fail('expected divide by zero to throw');
  } catch (error) {
    assertInstanceOf(error, CalculationError);
  }
});

test('invalid input throws an instance of CalculationError', () => {
  const calc: Calculator = new (require('../../src/calculator/calculator').Calculator)();
  const { CalculationError } = require('../../src/calculator/calculator.types');
  try {
    calc.add(NaN, 2);
    assert.fail('expected NaN operand to throw');
  } catch (error) {
    assertInstanceOf(error, CalculationError);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
