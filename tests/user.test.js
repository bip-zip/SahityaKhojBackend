const UserSchema = require("../models/user.model");
const mongoose = require('mongoose');

// name of the database
const url = 'mongodb://localhost:27017/sahityakhoj';

beforeAll(async () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB!!!')
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Schema test anything', () => {



    // user registration
    it('Registering user', async () => {
        const user = {
            'penname': 'hiralaal142',
            'email': 'herohirae244kdhhfjd3o@gmail.com',
            'password': "Nepal@123"
        };
        const data = await UserSchema.create(user);
        expect(data.penname).toEqual('hiralaal142');
    });

    // user login
    it('Logging in', async () => {

        var penname = 'jjjjjjj'
        var password = "Nepal@123"
        const data = await UserSchema.find({penname:penname, password:password});
        console.log(data);
        expect(data).toEqual([]);
    });
});