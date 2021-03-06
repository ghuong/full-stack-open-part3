require("dotenv").config();
const express = require("express");
const app = express();

const Person = require("./models/person");

// activate express' json-parser middleware
app.use(express.json());

// use express' static build middleware
app.use(express.static("build"));

// use cors middleware
const cors = require("cors");
app.use(cors());

// use morgan middleware
const morgan = require("morgan");
// create custom token
morgan.token("body", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else {
    return "";
  }
});

app.use(
  morgan((tokens, request, response) => {
    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, "content-length"),
      "-",
      tokens["response-time"](request, response),
      "ms",
      tokens.body(request, response),
    ].join(" ");
  })
);

// get all persons
app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

// get person
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// get info
app.get("/info", (request, response) => {
  Person.find({})
    .then((persons) => {
      const timestamp = new Date();
      const info = `<div>Phonebook has info for ${persons.length} people</div><br /><div>${timestamp}</div>`;
      response.send(info);
    })
    .catch((error) => next(error));
});

// create person
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

// update person's number
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// delete person
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "Unknown endpoint",
  });
};

app.use(unknownEndpoint);

// error handler
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id " });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
