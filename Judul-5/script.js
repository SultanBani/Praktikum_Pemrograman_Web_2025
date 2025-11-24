let currentValue = '0';
let previousValue = null;
let operator = null;
let waitingForOperand = false;
let memory = 0;
let history = [];

const display = document.getElementById('display');
const memoryIndicator = document.getElementById('memoryIndicator');
const historyDisplay = document.getElementById('historyDisplay');
const historyList = document.getElementById('historyList');

function updateDisplay() {
    display.textContent = currentValue;
}

function updateMemoryIndicator() {
    memoryIndicator.textContent = memory !== 0 ? `M: ${memory}` : '';
}

function updateHistoryDisplay() {
    if (history.length === 0) {
        historyDisplay.innerHTML = '';
        return;
    }

    historyDisplay.innerHTML = history.map((item, index) => 
        `<div class="history-item-inline" onclick="useHistoryResult(${index})">${item}</div>`
    ).join('');
}

function updateHistoryList() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="text-muted">Belum ada riwayat</p>';
        return;
    }

    historyList.innerHTML = history.map((item, index) => 
        `<div class="history-item" onclick="useHistoryResult(${index})">${item}</div>`
    ).join('');
}

function appendNumber(num) {
    if (waitingForOperand) {
        currentValue = String(num);
        waitingForOperand = false;
    } else {
        if (num === '.' && currentValue.includes('.')) return;
        currentValue = currentValue === '0' ? String(num) : currentValue + num;
    }
    updateDisplay();
}

function setOperator(op) {
    if (operator !== null && !waitingForOperand) {
        calculate();
    }
    
    previousValue = parseFloat(currentValue);
    operator = op;
    waitingForOperand = true;
}

function calculate() {
    if (operator === null || previousValue === null) return;

    const current = parseFloat(currentValue);
    let result;
    const expression = `${previousValue} ${operator} ${current}`;

    switch (operator) {
        case '+':
            result = previousValue + current;
            break;
        case '-':
            result = previousValue - current;
            break;
        case '×':
            result = previousValue * current;
            break;
        case '÷':
            if (current === 0) {
                alert('Error: Tidak bisa membagi dengan nol!');
                clearAll();
                return;
            }
            result = previousValue / current;
            break;
        default:
            return;
    }

    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;
    
    addToHistory(`${expression} = ${result}`);
    
    currentValue = String(result);
    operator = null;
    previousValue = null;
    waitingForOperand = true;
    updateDisplay();
}

function clearAll() {
    currentValue = '0';
    previousValue = null;
    operator = null;
    waitingForOperand = false;
    updateDisplay();
}

function clearEntry() {
    currentValue = '0';
    waitingForOperand = false;
    updateDisplay();
}

function memoryAdd() {
    memory += parseFloat(currentValue);
    updateMemoryIndicator();
}

function memorySubtract() {
    memory -= parseFloat(currentValue);
    updateMemoryIndicator();
}

function memoryRecall() {
    currentValue = String(memory);
    waitingForOperand = true;
    updateDisplay();
}

function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
}

function addToHistory(calculation) {
    history.unshift(calculation);
    if (history.length > 5) {
        history.pop();
    }
    updateHistoryDisplay();
    updateHistoryList();
}

function useHistoryResult(index) {
    const calculation = history[index];
    const result = calculation.split('= ')[1];
    currentValue = result;
    waitingForOperand = true;
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+') {
        setOperator('+');
    } else if (e.key === '-') {
        setOperator('-');
    } else if (e.key === '*') {
        setOperator('×');
    } else if (e.key === '/') {
        e.preventDefault();
        setOperator('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearAll();
    } else if (e.key === 'Backspace') {
        clearEntry();
    }
});

updateDisplay();