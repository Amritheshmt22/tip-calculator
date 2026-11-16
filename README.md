# Tip Calculator

A small frontend calculator for splitting a bill and tip between people. It is built with plain HTML, CSS and JavaScript, with no build step, server or external dependency.

## Features

- Bill amount input
- Preset tip percentages and custom tip support
- People count controls
- Tip amount, total bill and per-person results
- Optional rounded per-person amount
- Input validation with clear messages
- Last inputs saved in browser local storage
- Responsive desktop and mobile layout

## Files

- `index.html` - page structure and calculator controls
- `styles.css` - responsive layout, result cards and visual design
- `script.js` - calculations, validation, controls and saved state

## How to run

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Enter a bill, choose a tip and set the number of people.

No account, package install or server is required.

## How it works

The JavaScript reads the bill, tip percentage and people count, then calculates the tip, total and split amounts. The last inputs are stored in local storage so they can be restored in the same browser.

## Testing

The project was checked in a browser with functional tests for preset tips, custom percentages, people controls, calculations, rounded splits, validation, reset behavior, saved state and reload persistence. Desktop and mobile layouts were visually inspected.

## Note

This project was built with the help of an AI assistant (Instinct) as a learning project.
