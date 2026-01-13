const readline = require("readline");

// ================= BASE CLASSES =================

class FinancialAccount {
    constructor(accountNumber, accountHolder, balance = 0) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this._balance = balance;
        this.transactions = [];
        this.createdDate = new Date();
    }
    get balance() { return this._balance; }

    deposit(amount, description = "Deposit") {
        if (amount <= 0) throw new Error("Deposit amount must be positive");
        this._balance += amount;
        this.recordTransaction(amount, 'credit', description);
        return this._balance;
    }

    withdraw(amount, description = "Withdrawal") {
        if (amount <= 0) throw new Error("Withdrawal amount must be positive");
        if (amount > this._balance) throw new Error("Insufficient funds");
        this._balance -= amount;
        this.recordTransaction(amount, 'debit', description);
        return this._balance;
    }

    recordTransaction(amount, type, description) {
        const transaction = {
            id: this.transactions.length + 1,
            date: new Date(),
            amount, type, description,
            balanceAfter: this._balance
        };
        this.transactions.push(transaction);
    }

    calculateInterest() { return 0; }

    displayInfo() {
        return `${this.constructor.name} #${this.accountNumber}: ${this.accountHolder} - Balance: $${this.balance.toFixed(2)}`;
    }
}

class SavingsAccount extends FinancialAccount {
    constructor(accountNumber, accountHolder, balance = 0, interestRate = 0.02) {
        super(accountNumber, accountHolder, balance);
        this.interestRate = interestRate;
        this.minimumBalance = 100;
        this.accountType = "Savings";
    }

    withdraw(amount, description = "Savings Withdrawal") {
        if (this._balance - amount < this.minimumBalance)
            throw new Error("Minimum balance required");
        return super.withdraw(amount, description);
    }

    calculateInterest() {
        return (this._balance * this.interestRate) / 12;
    }
}

class CheckingAccount extends FinancialAccount {
    constructor(accountNumber, accountHolder, balance = 0, overdraftLimit = 500) {
        super(accountNumber, accountHolder, balance);
        this.overdraftLimit = overdraftLimit;
        this.accountType = "Checking";
    }

    withdraw(amount, description = "Checking Withdrawal") {
        if (amount > this._balance + this.overdraftLimit)
            throw new Error("Overdraft exceeded");
        this._balance -= amount;
        this.recordTransaction(amount, "debit", description);
        return this._balance;
    }
}

class InvestmentAccount extends SavingsAccount {
    constructor(accountNumber, accountHolder, balance = 0, interestRate = 0.04, riskLevel = "Medium") {
        super(accountNumber, accountHolder, balance, interestRate);
        this.riskLevel = riskLevel;
        this.accountType = "Investment";
        this.investments = [];
    }
}

// ================= INSURANCE =================

class InsurancePolicy {
    constructor(policyId, accountNumber, holderName, policyType, premium) {
        this.policyId = policyId;
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.policyType = policyType;
        this.premium = premium;
        this.startDate = new Date();
        this.status = "ACTIVE";
    }
}

// ================= BANK =================

class Bank {
    constructor(name) {
        this.name = name;
        this.accounts = [];
        this.insurancePolicies = [];
    }

    openAccount(type, ...args) {
        let acc;
        if (type === "savings") acc = new SavingsAccount(...args);
        if (type === "checking") acc = new CheckingAccount(...args);
        if (type === "investment") acc = new InvestmentAccount(...args);
        this.accounts.push(acc);
        return acc;
    }

    findAccount(accNo) {
        return this.accounts.find(a => a.accountNumber === accNo);
    }

    printAllAccountHolders() {
        console.table(this.accounts.map(acc => ({
            Account: acc.accountNumber,
            Name: acc.accountHolder,
            Type: acc.accountType,
            Balance: acc.balance.toFixed(2)
        })));
    }

    addInsurance(accountNumber, policyType, premium) {
        const acc = this.findAccount(accountNumber);
        if (!acc) {
            console.log("Account not found for insurance");
            return;
        }
        const policy = new InsurancePolicy(
            "POL" + (this.insurancePolicies.length + 1),
            accountNumber,
            acc.accountHolder,
            policyType,
            premium
        );
        this.insurancePolicies.push(policy);
    }

    getInsuranceByAccount(accountNumber) {
        return this.insurancePolicies.filter(p => p.accountNumber === accountNumber);
    }

    showTransactions(accNo) {
        const acc = this.findAccount(accNo);
        if (!acc) return console.log("Account not found");

        console.log(`\nTransactions for ${acc.accountHolder}`);
        console.table(acc.transactions.map(t => ({
            Date: t.date.toLocaleString(),
            Type: t.type,
            Amount: t.amount,
            Description: t.description,
            BalanceAfter: t.balanceAfter
        })));

        const policies = this.getInsuranceByAccount(accNo);
        if (policies.length === 0) {
            console.log("\nNo insurance policies found.");
        } else {
            console.log("\nInsurance Policies:");
            console.table(policies.map(p => ({
                PolicyID: p.policyId,
                Type: p.policyType,
                Premium: p.premium,
                Status: p.status,
                StartDate: p.startDate.toLocaleDateString()
            })));
        }
    }
}

// ================= DEMO =================

class FinancialSystemDemo {
    static run() {
        console.log("=== Financial System Demo ===");

        const myBank = new Bank("Global Finance Bank");

        const s1 = myBank.openAccount("savings", "SAV001", "John", 5000, 0.03);
        const c1 = myBank.openAccount("checking", "CHK001", "John", 2000, 1000);
        const i1 = myBank.openAccount("investment", "INV001", "Jane", 10000, 0.05);
        const s2 = myBank.openAccount("savings", "SAV002", "Ravi", 7000, 0.04);
        const c2 = myBank.openAccount("checking", "CHK002", "Priya", 3500, 1500);
        const i2 = myBank.openAccount("investment", "INV002", "Amit", 15000, 0.06);

        const s3 = myBank.openAccount("savings", "SAV003", "Anjali", 6000, 0.035);
        const c3 = myBank.openAccount("checking", "CHK003", "Rahul", 2500, 1000);


        myBank.addInsurance("SAV001", "Health Insurance", 2000);
        myBank.addInsurance("SAV001", "Life Insurance", 3000);
        myBank.addInsurance("INV001", "Wealth Protection", 5000);
        myBank.addInsurance("CHK001", "Property Insurance", 1500);
        myBank.addInsurance("SAV002", "Health Insurance", 1800);
        myBank.addInsurance("CHK002", "Vehicle Insurance", 2500);
        myBank.addInsurance("INV002", "Wealth Protection", 6000);
        myBank.addInsurance("SAV003", "Life Insurance", 2200);
        myBank.addInsurance("CHK003", "Home Insurance", 3000);
        s2.deposit(2000, "Bonus");
        s2.withdraw(1000, "Travel");

        c2.withdraw(2000, "Phone Purchase");

        i2.deposit(5000, "Extra Investment");

        s3.deposit(1500, "Freelance Income");
        c3.withdraw(1200, "Groceries");




        s1.deposit(1000, "Salary");
        s1.withdraw(500, "Shopping");
        c1.withdraw(2500, "Laptop");

        console.log("\n=== All Account Holders ===");
        myBank.printAllAccountHolders();

        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question("\nEnter Account Number to view transactions: ", accNo => {
            myBank.showTransactions(accNo.trim());
            rl.close();
        });
    }
}

FinancialSystemDemo.run();
