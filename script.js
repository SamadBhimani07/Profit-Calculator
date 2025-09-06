// Profit Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const modeButtons = document.querySelectorAll('.mode-btn');
    const calcModes = document.querySelectorAll('.calc-mode');
    const expenseForm = document.getElementById('expense-form');
    const simpleForm = document.getElementById('simple-form');
    const resultsSection = document.getElementById('results');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const toggleChartBtn = document.getElementById('toggle-chart');
    const clearDataBtn = document.getElementById('clear-data');
    const chartContainer = document.getElementById('chart-container');
    const chartSummary = document.getElementById('chart-summary');
    
    // Chart variables
    let profitChart = null;
    let monthlyData = loadMonthlyData();
    
    // Set current month and year
    const currentDate = new Date();
    monthSelect.value = currentDate.getMonth() + 1;
    yearSelect.value = currentDate.getFullYear();

    // Mode switching functionality
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            
            // Update active button
            modeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active calculator mode
            calcModes.forEach(mode => mode.classList.remove('active'));
            document.getElementById(`calc-mode${mode}`).classList.add('active');
            
            // Hide results when switching modes
            resultsSection.classList.add('hidden');
            
            // Clear all form inputs
            clearAllInputs();
        });
    });

    // Expense calculation form
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateWithExpenses();
    });

    // Simple calculation form
    simpleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSimple();
    });

    // Reset button
    resetBtn.addEventListener('click', function() {
        clearAllInputs();
        resultsSection.classList.add('hidden');
    });

    // Save button
    saveBtn.addEventListener('click', function() {
        saveCurrentCalculation();
    });

    // Chart toggle button
    toggleChartBtn.addEventListener('click', function() {
        toggleChart();
    });

    // Clear data button
    clearDataBtn.addEventListener('click', function() {
        clearAllData();
    });

    // Calculate profit with expenses
    function calculateWithExpenses() {
        const purchase = parseFloat(document.getElementById('purchase').value) || 0;
        const gas = parseFloat(document.getElementById('gas').value) || 0;
        const storage = parseFloat(document.getElementById('storage').value) || 0;
        const phone = parseFloat(document.getElementById('phone').value) || 0;
        const internet = parseFloat(document.getElementById('internet').value) || 0;
        const packing = parseFloat(document.getElementById('packing').value) || 0;
        const car = parseFloat(document.getElementById('car').value) || 0;
        const sale = parseFloat(document.getElementById('sale1').value) || 0;

        // Validate inputs
        if (sale === 0) {
            showError('Please enter a sales amount');
            return;
        }

        const totalExpenses = purchase + gas + storage + phone + internet + packing + car;
        const profit = sale - totalExpenses;

        // Display results
        displayResults(totalExpenses, sale, profit);
    }

    // Calculate simple profit
    function calculateSimple() {
        const sale = parseFloat(document.getElementById('sale2').value) || 0;
        const purchase = parseFloat(document.getElementById('purchase2').value) || 0;

        // Validate inputs
        if (sale === 0) {
            showError('Please enter a sales amount');
            return;
        }

        const profit = sale - purchase;

        // Display results
        displayResults(purchase, sale, profit);
    }

    // Display calculation results
    function displayResults(expenses, sales, profit) {
        // Update result values
        const monthName = monthSelect.options[monthSelect.selectedIndex].text;
        const year = yearSelect.value;
        
        document.getElementById('result-month').textContent = `${monthName} ${year}`;
        document.getElementById('total-expenses').textContent = formatCurrency(expenses);
        document.getElementById('total-sales').textContent = formatCurrency(sales);
        document.getElementById('profit-amount').textContent = formatCurrency(profit);

        // Add profit status class
        const profitElement = document.getElementById('profit-amount');
        profitElement.className = 'value';
        
        if (profit > 0) {
            profitElement.classList.add('positive');
        } else if (profit < 0) {
            profitElement.classList.add('negative');
        }

        // Show results with animation
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add celebration effect for positive profit
        if (profit > 0) {
            addCelebrationEffect();
        }
    }

    // Format currency values
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Clear all form inputs
    function clearAllInputs() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.value = '';
        });
    }

    // Show error message
    function showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <span class="error-message">${message}</span>
        `;
        
        // Add error styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        `;

        document.body.appendChild(errorDiv);

        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 3000);
    }

    // Add celebration effect for positive profit
    function addCelebrationEffect() {
        const profitElement = document.getElementById('profit-amount');
        profitElement.style.animation = 'pulse 0.6s ease-in-out 3';
        
        // Add confetti effect
        createConfetti();
    }

    // Create confetti effect
    function createConfetti() {
        const colors = ['#00d4ff', '#00ff88', '#ff6b6b', '#ffd93d', '#ff8c42'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    z-index: 1000;
                    animation: confettiFall 3s linear forwards;
                    border-radius: 50%;
                `;

                document.body.appendChild(confetti);

                // Remove confetti after animation
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
    }

    // Add input validation and formatting
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Ensure positive numbers
            if (this.value < 0) {
                this.value = 0;
            }
            
            // Format as user types
            if (this.value && !isNaN(this.value)) {
                this.value = parseFloat(this.value).toFixed(2);
            }
        });

        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key to calculate
        if (e.key === 'Enter' && !e.shiftKey) {
            const activeMode = document.querySelector('.mode-btn.active');
            if (activeMode) {
                const mode = activeMode.getAttribute('data-mode');
                if (mode === '1') {
                    calculateWithExpenses();
                } else if (mode === '2') {
                    calculateSimple();
                }
            }
        }
        
        // Escape key to reset
        if (e.key === 'Escape') {
            clearAllInputs();
            resultsSection.classList.add('hidden');
        }
    });

    // Data storage functions
    function loadMonthlyData() {
        const data = localStorage.getItem('profitCalculatorData');
        return data ? JSON.parse(data) : {};
    }

    function saveMonthlyData() {
        localStorage.setItem('profitCalculatorData', JSON.stringify(monthlyData));
    }

    function saveCurrentCalculation() {
        const month = monthSelect.value;
        const year = yearSelect.value;
        const key = `${year}-${month.padStart(2, '0')}`;
        
        // Get current calculation data
        const expenses = parseFloat(document.getElementById('total-expenses').textContent.replace(/[$,]/g, '')) || 0;
        const sales = parseFloat(document.getElementById('total-sales').textContent.replace(/[$,]/g, '')) || 0;
        const profit = parseFloat(document.getElementById('profit-amount').textContent.replace(/[$,]/g, '')) || 0;
        
        if (sales === 0) {
            showError('Please calculate profit first before saving');
            return;
        }

        // Save to monthly data
        monthlyData[key] = {
            month: parseInt(month),
            year: parseInt(year),
            expenses: expenses,
            sales: sales,
            profit: profit,
            timestamp: new Date().toISOString()
        };

        saveMonthlyData();
        updateChart();
        showSuccess(`Data saved for ${monthSelect.options[monthSelect.selectedIndex].text} ${year}`);
    }

    function toggleChart() {
        if (chartContainer.classList.contains('hidden')) {
            chartContainer.classList.remove('hidden');
            chartSummary.classList.remove('hidden');
            toggleChartBtn.innerHTML = '<span class="icon">📊</span> Hide Chart';
            updateChart();
        } else {
            chartContainer.classList.add('hidden');
            chartSummary.classList.add('hidden');
            toggleChartBtn.innerHTML = '<span class="icon">📊</span> Show Chart';
        }
    }

    function updateChart() {
        const ctx = document.getElementById('profitChart').getContext('2d');
        
        // Destroy existing chart
        if (profitChart) {
            profitChart.destroy();
        }

        // Prepare data for current year
        const currentYear = yearSelect.value;
        const yearData = Object.keys(monthlyData)
            .filter(key => key.startsWith(currentYear))
            .map(key => monthlyData[key])
            .sort((a, b) => a.month - b.month);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const labels = months;
        const profitData = new Array(12).fill(0);
        const salesData = new Array(12).fill(0);
        const expensesData = new Array(12).fill(0);

        yearData.forEach(data => {
            const monthIndex = data.month - 1;
            profitData[monthIndex] = data.profit;
            salesData[monthIndex] = data.sales;
            expensesData[monthIndex] = data.expenses;
        });

        profitChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Profit',
                        data: profitData,
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Sales',
                        data: salesData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: expensesData,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#e0e0e0',
                        bodyColor: '#e0e0e0',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#a0a0a0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#a0a0a0',
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        // Update summary statistics
        updateSummaryStats(yearData);
    }

    function updateSummaryStats(yearData) {
        const totalProfit = yearData.reduce((sum, data) => sum + data.profit, 0);
        const avgProfit = yearData.length > 0 ? totalProfit / yearData.length : 0;
        const bestMonth = yearData.length > 0 ? yearData.reduce((best, current) => 
            current.profit > best.profit ? current : best
        ) : null;

        document.getElementById('annual-profit').textContent = formatCurrency(totalProfit);
        document.getElementById('avg-profit').textContent = formatCurrency(avgProfit);
        document.getElementById('best-month').textContent = bestMonth ? 
            `${monthSelect.options[bestMonth.month - 1].text}: ${formatCurrency(bestMonth.profit)}` : '-';
    }

    function clearAllData() {
        if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
            monthlyData = {};
            saveMonthlyData();
            if (profitChart) {
                profitChart.destroy();
                profitChart = null;
            }
            chartContainer.classList.add('hidden');
            chartSummary.classList.add('hidden');
            toggleChartBtn.innerHTML = '<span class="icon">📊</span> Show Chart';
            showSuccess('All data cleared successfully');
        }
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.innerHTML = `
            <span class="success-icon">✅</span>
            <span class="success-message">${message}</span>
        `;
        
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00ff88, #00d4ff);
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 255, 136, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }, 3000);
    }
});

// Add CSS animations for confetti and notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    .value.positive {
        color: #00ff88 !important;
        text-shadow: 0 0 15px rgba(0, 255, 136, 0.6) !important;
    }

    .value.negative {
        color: #ff6b6b !important;
        text-shadow: 0 0 15px rgba(255, 107, 107, 0.6) !important;
    }
`;
document.head.appendChild(style);