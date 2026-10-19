package calculator

import (
	"errors"
	"fmt"
	"strconv"
)

// ErrDivisionByZero is returned when attempting to divide by zero.
var ErrDivisionByZero = errors.New("division by zero")

// Calculator holds the state of a simple arithmetic calculator.
type Calculator struct {
	current         string // current operand being typed (display value)
	previous        float64 // previous operand (stored when an operator is pressed)
	operator        rune    // pending operator (+, -, *, /)
	hasDecimal      bool    // whether current operand already has a decimal point
	waitingForOperand bool   // whether the next digit should start a fresh operand
}

// New creates a new Calculator ready for input.
func New() *Calculator {
	return &Calculator{
		current:   "0",
	}
}

// PressDigit appends a digit to the current operand.
// If waitingForOperand is true (after an operator or equals), starts fresh.
func (c *Calculator) PressDigit(digit rune) {
	if c.waitingForOperand {
		c.current = string(digit)
		c.waitingForOperand = false
		c.hasDecimal = false
		return
	}
	if c.current == "0" {
		c.current = string(digit)
	} else {
		c.current += string(digit)
	}
}

// PressDecimal adds a decimal point to the current operand (only one allowed).
func (c *Calculator) PressDecimal() {
	if c.waitingForOperand {
		c.current = "0."
		c.waitingForOperand = false
		c.hasDecimal = true
		return
	}
	if c.hasDecimal {
		return
	}
	c.hasDecimal = true
	if c.current == "0" {
		c.current = "0."
	} else {
		c.current += "."
	}
}

// PressOperator stores the current operand and operator.
// The display keeps the current value until the next digit is pressed.
func (c *Calculator) PressOperator(op rune) {
	if c.current == "" || c.current == "." {
		// ignore operator pressed without a valid operand
		return
	}
	val := c.parseCurrent()
	if c.operator != 0 {
		// chain operations: evaluate previous pending operation first
		result, err := c.apply(c.previous, val, c.operator)
		if err != nil {
			return
		}
		c.previous = result
		c.current = formatResult(result)
	} else {
		c.previous = val
	}
	c.operator = op
	c.waitingForOperand = true
	c.hasDecimal = false
}

// PressEquals performs the pending operation and returns the result.
func (c *Calculator) PressEquals() (float64, error) {
	if c.current == "" || c.current == "." {
		return 0, errors.New("no operand")
	}
	val := c.parseCurrent()

	if c.operator == 0 {
		// no pending operator: return current value
		return val, nil
	}

	result, err := c.apply(c.previous, val, c.operator)
	if err != nil {
		return 0, err
	}

	c.previous = result
	c.current = formatResult(result)
	c.operator = 0
	c.hasDecimal = false
	c.waitingForOperand = true

	return result, nil
}

// PressClear resets all calculator state.
func (c *Calculator) PressClear() {
	c.current = "0"
	c.previous = 0
	c.operator = 0
	c.hasDecimal = false
	c.waitingForOperand = false
}

// Display returns the current display string.
func (c *Calculator) Display() string {
	return c.current
}

func (c *Calculator) parseCurrent() float64 {
	var v float64
	_, err := fmt.Sscanf(c.current, "%f", &v)
	if err != nil {
		return 0
	}
	return v
}

func (c *Calculator) apply(a, b float64, op rune) (float64, error) {
	switch op {
	case '+':
		return a + b, nil
	case '-':
		return a - b, nil
	case '*':
		return a * b, nil
	case '/':
		if b == 0 {
			return 0, ErrDivisionByZero
		}
		return a / b, nil
	default:
		return 0, errors.New("unknown operator")
	}
}

func formatResult(v float64) string {
	if v == float64(int64(v)) {
		return strconv.FormatInt(int64(v), 10)
	}
	return strconv.FormatFloat(v, 'f', -1, 64)
}
