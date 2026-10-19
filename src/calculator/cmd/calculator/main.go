package main

import (
	"strconv"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"

	"calculator"
)

func main() {
	a := app.New()
	w := a.NewWindow("Calculadora")
	w.Resize(fyne.NewSize(300, 400))

	calc := calculator.New()

	// Display
	display := widget.NewEntry()
	display.SetText(calc.Display())
	display.Disable()

	// Button factory
	newButton := func(label string, onTap func()) *widget.Button {
		btn := widget.NewButton(label, onTap)
		btn.Importance = widget.LowImportance
		return btn
	}

	// Digit buttons 0-9
	digitButtons := make(map[rune]*widget.Button)
	for d := rune('0'); d <= rune('9'); d++ {
		digit := d
		digitButtons[digit] = newButton(string(d), func() {
			calc.PressDigit(digit)
			display.SetText(calc.Display())
		})
	}

	// Decimal button
	decimalBtn := newButton(".", func() {
		calc.PressDecimal()
		display.SetText(calc.Display())
	})

	// Clear button
	clearBtn := newButton("C", func() {
		calc.PressClear()
		display.SetText(calc.Display())
	})

	// Equals button
	equalsBtn := newButton("=", func() {
		result, err := calc.PressEquals()
		if err != nil {
			display.SetText("Error")
			return
		}
		display.SetText(strconv.FormatFloat(result, 'f', -1, 64))
	})

	// Operator buttons
	operatorBtns := make(map[rune]*widget.Button)
	for _, op := range []rune{'+', '-', '*', '/'} {
		op := op
		operatorBtns[op] = newButton(string(op), func() {
			calc.PressOperator(op)
			display.SetText(calc.Display())
		})
	}

	// Layout: display on top
	displayContainer := container.NewVBox(display)

	// Button grid: 4 columns
	grid := container.NewGridWithColumns(4,
		digitButtons['7'], digitButtons['8'], digitButtons['9'], operatorBtns['/'],
		digitButtons['4'], digitButtons['5'], digitButtons['6'], operatorBtns['*'],
		digitButtons['1'], digitButtons['2'], digitButtons['3'], operatorBtns['-'],
		digitButtons['0'], decimalBtn, equalsBtn, operatorBtns['+'],
		clearBtn,
	)

	content := container.NewVBox(displayContainer, grid)
	w.SetContent(content)

	w.ShowAndRun()
}
