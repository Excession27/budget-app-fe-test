let listOfExpenses = [];
let listOfIncomes = [];

const submitItem = document.querySelector(".submit");
const transactionDescription = document.querySelector("#description");
const transactionAmount = document.querySelector("#transaction-value");
const transactionType = document.querySelector(".transaction-type");
const incomeItems = document.querySelector(".income-items ul")
let expenseItems = document.querySelector(".expense-items ul")

window.addEventListener("load", () => {
    if (localStorage.getItem('expenses')) {
        listOfExpenses = JSON.parse(localStorage.getItem('expenses'));
        console.log("we've got something"); // To be removed
    };
    if (localStorage.getItem('incomes')) {
        listOfIncomes = JSON.parse(localStorage.getItem('incomes'));
        console.log("we've got something"); // To be removed
    };
    drawExpenses();
    drawIncomes();
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
    if (transactionAmount.value  && transactionDescription.value) {

        if (transactionType.value == "expense") {
            let newExpense = new Transaction(transactionDescription.value, transactionAmount.value, transactionType.value);

            listOfExpenses.push(newExpense);
            transactionAmount.value = "";
            transactionDescription.value = "";
            localStorage.setItem('expenses', JSON.stringify(listOfExpenses));
            drawExpenses();
            console.log(listOfExpenses);
        }

        if (transactionType.value == "income") {
            let newIncome = new Transaction(transactionDescription.value, transactionAmount.value, transactionType.value);

            listOfIncomes.push(newIncome);
            transactionAmount.value = "";
            transactionDescription.value = "";
            localStorage.setItem('incomes',  JSON.stringify(listOfIncomes));
            drawIncomes();
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
            <span class="percentage"></span>
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

let calculateBalance = () => {
    
}

let clearStorage = () => {
    localStorage.clear();
}