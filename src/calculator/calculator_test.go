package calculator

import (
	"errors"
	"testing"
)

func TestPressDigitAccumulatesDigits(t *testing.T) {
	calc := New()

	calc.PressDigit('1')
	calc.PressDigit('2')
	calc.PressDigit('3')

	if calc.Display() != "123" {
		t.Errorf("expected display '123', got %q", calc.Display())
	}
}

func TestPressDecimalPoint(t *testing.T) {
	calc := New()

	calc.PressDigit('1')
	calc.PressDecimal()
	calc.PressDigit('5')

	if calc.Display() != "1.5" {
		t.Errorf("expected display '1.5', got %q", calc.Display())
	}
}

func TestPressOperatorStoresOperand(t *testing.T) {
	calc := New()

	calc.PressDigit('1')
	calc.PressDigit('0')
	calc.PressOperator('+')

	if calc.Display() != "10" {
		t.Errorf("expected display '10' after operator, got %q", calc.Display())
	}
}

func TestPressEqualsPerformsAddition(t *testing.T) {
	calc := New()

	calc.PressDigit('5')
	calc.PressOperator('+')
	calc.PressDigit('3')
	result, err := calc.PressEquals()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 8 {
		t.Errorf("expected result 8, got %v", result)
	}
	if calc.Display() != "8" {
		t.Errorf("expected display '8', got %q", calc.Display())
	}
}

func TestPressEqualsPerformsSubtraction(t *testing.T) {
	calc := New()

	calc.PressDigit('1')
	calc.PressDigit('0')
	calc.PressOperator('-')
	calc.PressDigit('4')
	result, err := calc.PressEquals()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 6 {
		t.Errorf("expected result 6, got %v", result)
	}
}

func TestPressEqualsPerformsMultiplication(t *testing.T) {
	calc := New()

	calc.PressDigit('6')
	calc.PressOperator('*')
	calc.PressDigit('7')
	result, err := calc.PressEquals()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 42 {
		t.Errorf("expected result 42, got %v", result)
	}
}

func TestPressEqualsPerformsDivision(t *testing.T) {
	calc := New()

	calc.PressDigit('2')
	calc.PressDigit('0')
	calc.PressOperator('/')
	calc.PressDigit('4')
	result, err := calc.PressEquals()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 5 {
		t.Errorf("expected result 5, got %v", result)
	}
}

func TestDivisionByZeroReturnsError(t *testing.T) {
	calc := New()

	calc.PressDigit('5')
	calc.PressOperator('/')
	calc.PressDigit('0')
	_, err := calc.PressEquals()

	if err == nil {
		t.Error("expected error for division by zero, got nil")
	}
	if !errors.Is(err, ErrDivisionByZero) {
		t.Errorf("expected ErrDivisionByZero, got %v", err)
	}
}

func TestPressClearResetsState(t *testing.T) {
	calc := New()

	calc.PressDigit('1')
	calc.PressDigit('2')
	calc.PressOperator('+')
	calc.PressDigit('3')
	calc.PressClear()

	if calc.Display() != "0" {
		t.Errorf("expected display '0' after clear, got %q", calc.Display())
	}
}

func TestPressClearThenNewCalculation(t *testing.T) {
	calc := New()

	calc.PressDigit('9')
	calc.PressOperator('-')
	calc.PressDigit('5')
	calc.PressClear()

	calc.PressDigit('2')
	calc.PressOperator('+')
	calc.PressDigit('3')
	result, err := calc.PressEquals()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 5 {
		t.Errorf("expected result 5 after clear, got %v", result)
	}
}

func TestPressEqualsWithoutOperatorReturnsCurrent(t *testing.T) {
	calc := New()

	calc.PressDigit('7')
	result, err := calc.PressEquals()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 7 {
		t.Errorf("expected result 7, got %v", result)
	}
}

func TestMultipleDecimalPointsPrevented(t *testing.T) {
	calc := New()

	calc.PressDigit('1')
	calc.PressDecimal()
	calc.PressDecimal()
	calc.PressDecimal()

	if calc.Display() != "1." {
		t.Errorf("expected display '1.' (no duplicate decimals), got %q", calc.Display())
	}
}

func TestPressDecimalAfterOperator(t *testing.T) {
	calc := New()

	calc.PressDigit('5')
	calc.PressOperator('/')
	calc.PressDecimal()
	calc.PressDigit('2')

	if calc.Display() != "0.2" {
		t.Errorf("expected display '0.2', got %q", calc.Display())
	}
}

func TestPressOperatorChaining(t *testing.T) {
	calc := New()

	calc.PressDigit('1')
	calc.PressDigit('0')
	calc.PressOperator('+')
	calc.PressDigit('5')
	calc.PressOperator('*') // chain: 10 + 5 = 15, then wait for next operand with *

	if calc.Display() != "15" {
		t.Errorf("expected display '15' after chain, got %q", calc.Display())
	}

	calc.PressDigit('2')
	result, err := calc.PressEquals()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 30 {
		t.Errorf("expected result 30, got %v", result)
	}
}

func TestPressOperatorIgnoresEmptyOperand(t *testing.T) {
	calc := New()

	calc.PressOperator('+') // no operand yet, should be ignored

	if calc.Display() != "0" {
		t.Errorf("expected display '0', got %q", calc.Display())
	}
}

func TestPressEqualsResultIsDecimal(t *testing.T) {
	calc := New()

	calc.PressDigit('1')
	calc.PressOperator('/')
	calc.PressDigit('4')
	result, err := calc.PressEquals()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 0.25 {
		t.Errorf("expected result 0.25, got %v", result)
	}
}
