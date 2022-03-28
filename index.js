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


window.addEventListener("load", () => {
    if (localStorage.getItem('expenses')) {
        listOfExpenses = JSON.parse(localStorage.getItem('expenses'));
        
    };
    if (localStorage.getItem('incomes')) {
        listOfIncomes = JSON.parse(localStorage.getItem('incomes'));
        
    };
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
            transactionAmount.value = 0;
            transactionDescription.value = "";
            localStorage.setItem('expenses', JSON.stringify(listOfExpenses));
            draw();
            console.log(listOfExpenses);
        }

        if (transactionType.value == "income"  && transactionAmount.value > 0) {
            let newIncome = new Transaction(transactionDescription.value, transactionAmount.value, transactionType.value);

            listOfIncomes.push(newIncome);
            transactionAmount.value = 0;
            transactionDescription.value = "";
            localStorage.setItem('incomes',  JSON.stringify(listOfIncomes));
            draw();
            console.log(listOfIncomes);
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


let toBeRemoved;
let toBeRemovedIndex;
let toBeRemovedType;


let drawTransactions = () => {
    expenseItems.innerHTML = `<span></span>`

    listOfExpenses.forEach((expense, index) => {
        
        expenseItems.lastElementChild.insertAdjacentHTML("afterend", 
        `<li class="expense-${index}">
            <span class="description">${expense.desc}</span>
            <span class="value">-${expense.amount}</span>
            <span class="percentage">${totalIncome > 0 ? (expense.amount/(totalIncome/100)).toFixed(2) : 0}%</span>
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
    
    listItems.forEach(item => {
        item.addEventListener("mouseenter", (event) => {
            console.log(event);
            console.log(event.target);

            if (event.target.innerHTML.search(`<button style="padding: 1px 4px;`) > 0) { return }

            let toBeRemovedIndex = event.target.classList.value.split("-")[1];
            let toBeRemovedType = event.target.classList.value.split("-")[0];
            let toBeRemoved = event.target.classList.value;
            console.log(toBeRemovedIndex);
            console.log(toBeRemovedType);
            console.log(toBeRemoved);

            event.target.innerHTML += `<button style="padding: 1px 4px; position: fixed;" class=${toBeRemoved}>X</button>`;
            setTimeout(() => {}, 100);
            let baton = document.querySelector(`.${toBeRemoved}`);
            console.log(baton);

            

            baton.addEventListener("click", () => {
                if (toBeRemovedType === "expense") {
                    listOfExpenses.splice(toBeRemovedIndex, 1);
                    localStorage.setItem('expenses', JSON.stringify(listOfExpenses));
                    draw();
                }
                if (toBeRemovedType === "income") {
                    listOfIncomes.splice(toBeRemovedIndex, 1);
                    localStorage.setItem('incomes',  JSON.stringify(listOfIncomes));
                    draw();

                }
            })
            
            
        })
        item.addEventListener("mouseleave", (event) => {
            
            event.target.innerHTML = event.target.innerHTML.split(`<button style="padding: 1px 4px; position: fixed;`)[0]
        });
        
    })

}



let draw = () => {
    calculateBalance();
    drawTransactions();

        
    
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

    incomeDisplay.textContent = `+${totalIncome}`;
    expenseDisplay.textContent = `-${totalExpenses}`;
    if (totalIncome > 0) {
        expenseDisplayPerc.textContent = `${(totalExpenses/(totalIncome/100)).toFixed(2)}%`
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

