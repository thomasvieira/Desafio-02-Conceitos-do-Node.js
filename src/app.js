const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next){
  const {id}= request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid uuid'});
  }

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
}); //DONE

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository)

  return response.json(repository);
}); //DONE

app.put("/repositories/:id", (request, response) => {
  const {id}= request.params;
  let {title, url, techs, likes} = request.body;  
  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoriesIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }

  if(likes){
    console.log("likes recebido");
  }

  likes = repositories[repositoriesIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositoriesIndex] = repository;

  return response.json(repository);

}); //DONE

app.delete("/repositories/:id", validateId, (request, response) => {
  const {id}= request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

}); // DONE

app.post("/repositories/:id/like", (request, response) => {
  const {id}= request.params;
  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoriesIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }

  const title = repositories[repositoriesIndex].title;
  const url   = repositories[repositoriesIndex].url;
  const techs = repositories[repositoriesIndex].techs;
  const likes = repositories[repositoriesIndex].likes + 1;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositoriesIndex] = repository;

  return response.json(repository);



});

console.log("Server Online");

module.exports = app;
