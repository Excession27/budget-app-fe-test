let listOfExpenses = [];
let listOfIncomes = [];
let totalIncome = 0;
let totalExpenses = 0;
let balance = 0;

const submitItem = document.querySelector(".submit");
const transactionDescription = document.querySelector("#description");
const transactionAmount = document.querySelector("#transaction-value");
const transactionType = document.querySelector(".transaction-type");
const incomeItems = document.querySelector(".income-items ul");
const expenseItems = document.querySelector(".expense-items ul");
const expenseDisplay = document.querySelector(".expenses .value");
const expenseDisplayPerc = document.querySelector(".expenses .percentage");
const incomeDisplay = document.querySelector(".income .value");
const balanceDisplay = document.querySelector(".balance");
const currentPeriod = document.querySelector(".period");

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.toLocaleString('default', { month: 'long' });

currentPeriod.textContent += `${currentMonth} ${currentYear}`;



window.addEventListener("load", () => {
    // Load data, if available
    document.querySelector(".expense-items h3").textContent = document.querySelector(".expense-items h3").textContent.toUpperCase();

    if (localStorage.getItem('expenses')) {
        listOfExpenses = JSON.parse(localStorage.getItem('expenses'));
    };

    if (localStorage.getItem('incomes')) {
        listOfIncomes = JSON.parse(localStorage.getItem('incomes'));
    };

    // Set the proper class at load time for the button that adds expenses/income
    if (transactionType.value === "expense") {
        submitItem.classList.add("expense");
    }

    if (transactionType.value === "income") {
        submitItem.classList.remove("expense");
    }

    draw();

});

// Allow only numbers in numbers input field
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

setInputFilter(document.querySelector("#transaction-value"), function (value) {
    return /^(0|[1-9][0-9]*)$/.test(value); // Allow digits and '.' only, using a RegExp, also no leading zeroes
});



class Transaction {
    constructor(desc, amount, type) {
        this.desc = desc;
        this.amount = amount;
        this.type = type;
    }
}



submitItem.addEventListener("click", () => {
    if (transactionAmount.value && transactionDescription.value != 0) {

        if (transactionType.value == "expense" && transactionAmount.value > 0) {
            let newExpense = new Transaction(transactionDescription.value, Number(transactionAmount.value), transactionType.value);

            listOfExpenses.push(newExpense);
            transactionAmount.value = 0;
            transactionDescription.value = "";
            localStorage.setItem('expenses', JSON.stringify(listOfExpenses));
            draw();

        }

        if (transactionType.value == "income" && transactionAmount.value > 0) {
            let newIncome = new Transaction(transactionDescription.value, Number(transactionAmount.value), transactionType.value);

            listOfIncomes.push(newIncome);
            transactionAmount.value = 0;
            transactionDescription.value = "";
            localStorage.setItem('incomes', JSON.stringify(listOfIncomes));
            draw();

        }
    }

});


transactionType.addEventListener("change", () => {
    if (transactionType.value === "expense") {
        submitItem.classList.add("expense");
    }
    if (transactionType.value === "income") {
        submitItem.classList.remove("expense");
    }
})


// Display each separate item of expenses and income
let drawTransactions = () => {
    expenseItems.innerHTML = `<span></span>`

    listOfExpenses.forEach((expense, index) => {
        expenseItems.lastElementChild.insertAdjacentHTML("afterend",
            `<li class="expense-${index}">
            <span class="description">${expense.desc}</span>
            <span class="value">-${expense.amount}</span>
            <span class="percentage">${totalIncome > 0 ? (expense.amount / (totalIncome / 100)).toFixed(1) : 0}%</span>
        </li>
        `);

    });

    incomeItems.innerHTML = `<span></span>`
    listOfIncomes.forEach((income, index) => {

        incomeItems.lastElementChild.insertAdjacentHTML("afterend",
            `<li class="income-${index}">
            <span class="description">${income.desc}</span>
            <span class="value">+${income.amount}</span>
        </li>
        `);
    });



    const listItems = document.querySelectorAll("li");

    // Display the button on hover
    listItems.forEach(item => {
        item.addEventListener("mouseenter", (event) => {
            
            let toBeRemovedType = event.target.classList.value.split("-")[0];
            let toBeRemoved = event.target.classList.value;
            
            event.target.lastElementChild.insertAdjacentHTML("afterend", `<button style="padding: 1px 4px; position: relative;" class=${toBeRemoved}>X</button>`);

            let hoverButton = document.querySelector(`button.${toBeRemoved}`);

            console.log(event.target.innerHTML.split(`<span class="description">`)[1].split("</span>")[0]);

            let value = Math.abs(Number(event.target.innerHTML.split(`<span class="value">`)[1].split(`</span>`)[0]));
            let hoverDesc = event.target.innerHTML.split(`<span class="description">`)[1].split("</span>")[0];

            

            // When the button is clicked, delete proper entry
            hoverButton.addEventListener("click", () => {
                if (toBeRemovedType === "expense") {
                    listOfExpenses = listOfExpenses.filter((expense) => {
                        
                        return (!(expense.amount == value && expense.desc == hoverDesc));
                    });

                    localStorage.setItem('expenses', JSON.stringify(listOfExpenses));
                    draw();
                }

                if (toBeRemovedType === "income") {
                    listOfIncomes = listOfIncomes.filter((income) => {
                        return (!(income.amount == value && income.desc == hoverDesc));
                    });;

                    localStorage.setItem('incomes', JSON.stringify(listOfIncomes));
                    draw();
                }
            })
        });

        // Remove added button after the mouse leaves item
        item.addEventListener("mouseleave", (event) => {
            event.target.innerHTML = event.target.innerHTML.split(`<button style="padding: 1px 4px; position: relative;`)[0];

        });

    })

}



let draw = () => {
    calculateBalance();
    drawTransactions();

}

// Display total value of income, expenses and balance
let calculateBalance = () => {
    totalExpenses = 0;
    totalIncome = 0;

    listOfExpenses.forEach(expense => {
        totalExpenses += Number(expense.amount);
    });
    listOfIncomes.forEach(income => {
        totalIncome += Number(income.amount);
    })

    incomeDisplay.textContent = `+${totalIncome}`;
    expenseDisplay.textContent = `-${totalExpenses}`;
    if (totalIncome > 0) {
        expenseDisplayPerc.textContent = `${(totalExpenses / (totalIncome / 100)).toFixed(1)}%`
    }
    if (totalIncome === 0) {
        expenseDisplayPerc.textContent = `0%`
    }

    balance = totalIncome - totalExpenses;
    balanceDisplay.textContent = balance > 0 ? `+${balance}` : balance;
}

let clearStorage = () => {
    localStorage.clear();
}

