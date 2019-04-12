//ALL ACCOUNT

let transaction = [{
        "id": 1,
        "createdOn": new Date().toISOString(),
        "transactionType": "credit",
        "accountNumber": 1920000034,
        "cashier": 2,
        "amount": 500.00,
        "oldBalance": 3500.00,
        "newBalance": 4000.00,
        "from": "Regina brown",
        "to" : "",
        "fromNumber": "593 665 0039393",
        "toNumber": ""
    },
    {
        "id": 2,
        "createdOn": new Date().toISOString(),
        "transactionType": "debit",
        "accountNumber": 1928800034,
        "cashier": 2,
        "amount": 10000.00,
        "oldBalance": 50000.00,
        "newBalance": 40000.00,
        "from": "",
        "to" : "Mark Junior",
        "fromNumber": "",
        "toNumber": "563 995 9939393"
    },
    {
        "id": 3,
        "createdOn": new Date().toISOString(),
        "transactionType": "credit",
        "accountNumber": 1929900034,
        "cashier": 1,
        "amount": 500.00,
        "oldBalance": 4000.00,
        "newBalance": 4500.00,
        "from": "Courtney Yellow",
        "to" : "",
        "fromNumber": "591 343 233 5464",
        "toNumber": ""
    },
    {
        "id": 4,
        "createdOn": new Date().toISOString(),
        "transactionType": "credit",
        "accountNumber": 1920000034,
        "cashier": 2,
        "amount": 1000.00,
        "oldBalance": 4000.00,
        "newBalance": 5000.00,
        "from": "Jorgensen Evans",
        "to" : "",
        "fromNumber": "500 343 533 5353",
        "toNumber": ""
    }
];

module.exports = transaction;