document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-action]');
    const equalsButton = document.getElementById('equals');
    const deleteButton = document.querySelector('[data-action="delete"]');
    const allClearButton = document.querySelector('[data-action="clear"]');
    const percentageButton = document.querySelector('[data-action="percentage"]');
    const calculator = document.querySelector('.calculator');

    // Calculator state
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;

    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#00f7ff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00f7ff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });

    // Event Listeners
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.textContent);
            updateDisplay();
            animateButton(button);
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            switch (action) {
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    chooseOperation(action);
                    break;
                case 'equals':
                    compute();
                    break;
                case 'delete':
                    deleteNumber();
                    break;
                case 'clear':
                    clear();
                    break;
                case 'percentage':
                    percentage();
                    break;
            }
            
            updateDisplay();
            animateButton(button);
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            appendNumber(e.key);
            updateDisplay();
            const button = document.querySelector(`[data-number="${e.key}"]`);
            if (button) animateButton(button);
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            const operationMap = {
                '+': 'add',
                '-': 'subtract',
                '*': 'multiply',
                '/': 'divide'
            };
            chooseOperation(operationMap[e.key]);
            updateDisplay();
            const button = document.querySelector(`[data-action="${operationMap[e.key]}"]`);
            if (button) animateButton(button);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            compute();
            updateDisplay();
            const button = document.querySelector('[data-action="equals"]');
            if (button) animateButton(button);
        } else if (e.key === 'Backspace') {
            deleteNumber();
            updateDisplay();
            const button = document.querySelector('[data-action="delete"]');
            if (button) animateButton(button);
        } else if (e.key === 'Escape') {
            clear();
            updateDisplay();
            const button = document.querySelector('[data-action="clear"]');
            if (button) animateButton(button);
        } else if (e.key === '%') {
            percentage();
            updateDisplay();
            const button = document.querySelector('[data-action="percentage"]');
            if (button) animateButton(button);
        }
    });

    // Calculator functions
    function appendNumber(number) {
        if (number === '.' && currentOperand.includes('.')) return;
        if (resetScreen) {
            currentOperand = '';
            resetScreen = false;
        }
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    }

    function chooseOperation(selectedOperation) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        operation = selectedOperation;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                computation = current === 0 ? 'Error' : prev / current;
                break;
            default:
                return;
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        resetScreen = true;
    }

    function deleteNumber() {
        if (currentOperand === '0') return;
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.toString().slice(0, -1);
        }
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    function percentage() {
        if (currentOperand === '') return;
        currentOperand = (parseFloat(currentOperand) / 100).toString();
    }

    function getOperationSymbol(operation) {
        const symbols = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[operation] || '';
    }

    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        
        if (operation != null) {
            const operationSymbol = getOperationSymbol(operation);
            previousOperandElement.textContent = `${previousOperand} ${operationSymbol}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
    }

    function animateButton(button) {
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 300);
    }

    // Add floating animation to calculator
    function addFloatingAnimation() {
        const calculator = document.querySelector('.calculator');
        let angle = 0;
        
        function updateAnimation() {
            const x = Math.sin(angle * 0.5) * 2;
            const y = Math.cos(angle * 0.3) * 2;
            calculator.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
            angle += 0.02;
            requestAnimationFrame(updateAnimation);
        }
        
        updateAnimation();
    }

    // Initialize calculator
    clear();
    updateDisplay();
    addFloatingAnimation();

    // Add mouse move effect
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        calculator.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });

    // Reset rotation when mouse leaves
    document.addEventListener('mouseleave', () => {
        calculator.style.transform = 'rotateY(0) rotateX(0)';
    });
});