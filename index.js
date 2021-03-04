const express = require("express");
const app = express();

// activate express' json-parser
app.use(express.json());

const persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Thomas Edison",
    number: "123-456-7890",
    id: 5,
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const timestamp = new Date();
  const info = `<div>Phonebook has info for ${persons.length} people</div><br /><div>${timestamp}</div>`;
  response.send(info);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
