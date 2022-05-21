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
            'penname': 'Dhiraj234',
            'email': 'dhirw@gmail.com',
            'password': "Asdf@1234"
        };
        const data = await UserSchema.create(user);
        expect(data.penname).toEqual('Dhiraj234');
    });

   
});