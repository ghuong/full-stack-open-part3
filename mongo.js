const mongoose = require("mongoose");

switch (process.argv.length) {
  case 3:
    break;
  case 5:
    break;
  default:
    console.log(
      "Usage: `node mongo.js <password> [<new-name> <phone-number>]`"
    );
    process.exit(1);
}

const password = process.argv[2];
const DATABASE_NAME = "phonebook";
const url = `mongodb+srv://fullstack:${password}@cluster0.gyglp.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const addPerson = (name, number) => {
  const person = new Person({ name, number });
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
};

const getAllPersons = () => {
  Person.find({}).then((result) => {
    console.log("phonebook:");

    result.forEach((person) => {
      console.log(person.name, person.number);
    });

    mongoose.connection.close();
  });
};

switch (process.argv.length) {
  case 3:
    getAllPersons();
    break;
  case 5:
    addPerson(process.argv[3], process.argv[4]);
    break;
}
