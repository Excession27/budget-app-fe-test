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
const listItems = document.querySelectorAll("li");

window.addEventListener("load", () => {
    if (localStorage.getItem('expenses')) {
        listOfExpenses = JSON.parse(localStorage.getItem('expenses'));
        
    };
    if (localStorage.getItem('incomes')) {
        listOfIncomes = JSON.parse(localStorage.getItem('incomes'));
        
    };
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
    constructor (desc, amount, type) {
        this.desc = desc;
        this.amount = amount;
        this.type = type;
    }
}

submitItem.addEventListener("click", () => {
    if (transactionAmount.value  && transactionDescription.value != 0) {

        if (transactionType.value == "expense" && transactionAmount.value > 0) {
            let newExpense = new Transaction(transactionDescription.value, transactionAmount.value, transactionType.value);

            listOfExpenses.push(newExpense);
            transactionAmount.value = "";
            transactionDescription.value = "";
            localStorage.setItem('expenses', JSON.stringify(listOfExpenses));
            draw();
            console.log(listOfExpenses);
        }

        if (transactionType.value == "income"  && transactionAmount.value > 0) {
            let newIncome = new Transaction(transactionDescription.value, transactionAmount.value, transactionType.value);

            listOfIncomes.push(newIncome);
            transactionAmount.value = "";
            transactionDescription.value = "";
            localStorage.setItem('incomes',  JSON.stringify(listOfIncomes));
            draw();
            console.log(listOfIncomes);
        }
    }
    
});



let drawExpenses = () => {
    expenseItems.innerHTML = `<span></span>`

    listOfExpenses.forEach((expense) => {
        
        expenseItems.lastElementChild.insertAdjacentHTML("afterend", 
        `<li>
            <span class="description">${expense.desc}</span>
            <span class="value">${expense.amount}</span>
            <span class="percentage">${totalIncome > 0 ? (expense.amount/(totalIncome/100)).toFixed(2) : 0}%</span>
        </li>
        `);

    });

}

let drawIncomes = () => {
    incomeItems.innerHTML = `<span></span>`

    listOfIncomes.forEach((income) => {
        
        incomeItems.lastElementChild.insertAdjacentHTML("afterend", 
        `<li>
            <span class="description">${income.desc}</span>
            <span class="value">${income.amount}</span>
        </li>
        `);

    });
}

let draw = () => {
    calculateBalance();
    drawIncomes();
    drawExpenses();

    listItems.addEventListener("hover", (event) => {

    })
}

let calculateBalance = () => {
    totalExpenses = 0;
    totalIncome = 0;

    listOfExpenses.forEach( expense => {
        totalExpenses += Number(expense.amount);
    });
    listOfIncomes.forEach( income => {
        totalIncome += Number(income.amount);
    })

    incomeDisplay.textContent = totalIncome;
    expenseDisplay.textContent = totalExpenses;
    if (totalIncome > 0) {
        expenseDisplayPerc.textContent = `${(totalExpenses/(totalIncome/100)).toFixed(2)}%`
    }
    if (totalIncome === 0) {
        expenseDisplayPerc.textContent = `0%`
    }
    
    balance = totalIncome - totalExpenses;
    balanceDisplay.textContent = balance;
}

let clearStorage = () => {
    localStorage.clear();
}
