// ALL ACCOUNT

const account = [{
  id: 1,
  accountNumber: 1929900034,
  createdOn: new Date().toISOString(),
  owner: 1,
  type: 'current',
  status: 'active',
  balance: 10000.00,
},
{
  id: 2,
  accountNumber: 1928800034,
  createdOn: new Date().toISOString(),
  owner: 2,
  type: 'current',
  status: 'active',
  balance: 50000.00,
},
{
  id: 3,
  accountNumber: 1920000034,
  createdOn: new Date().toISOString(),
  owner: 3,
  type: 'savings',
  status: 'active',
  balance: 3500.00,
},
];

module.exports = account;
