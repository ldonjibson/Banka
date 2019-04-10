//ALL USERS INCLUDING ADMIN, STAFF,CLIENT

let users = [{
        "id": 1,
        "email": "Sincere@april.biz",
        "firstName": "Leanne Graham",
        "lastName": "Bret",
        "phone": "010-692-6593 x09125",
        "password": "$2a$08$/PBOYdYMtoFVgr1IKgqmfuh3nDWjDnX4p1mE4CgmI3N54vrASk2UC",
        "dob": "25-01-1990",
        "registerDate": "10-03-1999",
        "type": "staff",
        "isAdmin": true,
        "imageUrl": 'http://localhost:3000/images/default-image.jpg'
    },
    {
        "id": 2,
        "email": "Since@april.biz",
        "firstName": "Ervin Howell",
        "lastName": "Antonette",
        "phone": "010-692-8765 x09125",
        "password": "$2a$08$/PBOYdYMtoFVgr1IKgqmfuh3nDWjDnX4p1mE4CgmI3N54vrASk2UC",
        "dob": "25-04-1991",
        "registerDate": "15-03-1999",
        "type": "staff",
        "isAdmin": false,
        "imageUrl": 'http://localhost:3000/images/default-image.jpg'
    },
    {
        "id": 3,
        "email": "Nathan@yesenia.net",
        "firstName": "Clementine Bauch",
        "lastName": "Samantha",
        "phone": "1-463-123-4447",
        "password": "$2a$08$/PBOYdYMtoFVgr1IKgqmfuh3nDWjDnX4p1mE4CgmI3N54vrASk2UC",
        "dob": "25-05-1991",
        "registerDate": "25-03-1999",
        "type": "client",
        "isAdmin": false,
        "imageUrl": 'http://localhost:3000/images/default-image.jpg'
    }
];

module.exports = users;
