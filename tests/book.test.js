const BookSchema = require("../models/book.model");
const mongoose = require('mongoose');

// the database
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

describe('Book Schema test anything', () => {
    // Insert Book
    it('Inserting Book', async () => {
        const book = {
            'bookName': 'Pagal',
            'bookWriter': 'Dhiraj Tamang',
            'price': 1000,
            "category":"Novel",
            "isbn":"1234567",
            "abstract":"All in all is all we are..."
        };

        const data = await BookSchema.create(book);
        expect(data.bookName).toEqual('Pagal');
    });


    it('Getting book data', async () => {
        const data = await BookSchema.find();
        expect(data.length>1).toBe(true);
    });

});




