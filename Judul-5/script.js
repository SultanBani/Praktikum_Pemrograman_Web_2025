let currentValue = '0';
let expression = '';
let history = [];
let memory = 0;

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
    if (num === '.' && currentValue.includes('.')) return;
    
    if (currentValue === '0' && num !== '.') {
        currentValue = String(num);
    } else {
        currentValue += String(num);
    }
    updateDisplay();
}

function setOperator(op) {
    if (currentValue === '' || currentValue === '-') return;
    
    // Tambahkan nilai saat ini ke expression
    if (expression === '') {
        expression = currentValue;
    } else {
        expression += ' ' + currentValue;
    }
    
    expression += ' ' + op;
    currentValue = '0';
    updateDisplay();
}

function evaluateExpression(expr) {
    // Ganti operator visual dengan operator JavaScript
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
    
    try {
        // Evaluasi expression dengan urutan operasi matematika yang benar
        let result = Function('"use strict"; return (' + expr + ')')();
        
        // Cek pembagian dengan nol
        if (!isFinite(result)) {
            throw new Error('Pembagian dengan nol');
        }
        
        // Round untuk menghindari floating point errors
        result = Math.round(result * 100000000) / 100000000;
        return result;
    } catch (e) {
        throw new Error('Error dalam perhitungan');
    }
}

function calculate() {
    if (expression === '') return;
    
    try {
        // Tambahkan nilai terakhir ke expression
        const fullExpression = expression + ' ' + currentValue;
        
        // Evaluasi dengan urutan operasi matematika
        const result = evaluateExpression(fullExpression);
        
        // Simpan ke history
        addToHistory(`${fullExpression} = ${result}`);
        
        // Set hasil sebagai nilai baru
        currentValue = String(result);
        expression = '';
        updateDisplay();
    } catch (e) {
        alert('Error: ' + e.message);
        clearAll();
    }
}

function clearAll() {
    currentValue = '0';
    expression = '';
    updateDisplay();
}

function clearEntry() {
    currentValue = '0';
    expression = '';
    history = [];
    updateDisplay();
    updateHistoryDisplay();
    updateHistoryList();
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