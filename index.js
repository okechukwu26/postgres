const express = require('express');
const app = express();
const pool = require('./db');
const cor = require('cors');

app.use(cor());
app.use(express.json());
const port = process.env.PORT || 3000;

//Routes/

//post a todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO  todo (description) VALUES($1) RETURNING *',
      [description]
    );
    res.send(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all todo
app.get('/todos', async (req, res) => {
  try {
    const allTodo = await pool.query('SELECT * FROM todo');
    res.send(allTodo.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get a todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [
      id,
    ]);

    res.json(todo.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updated = await pool.query(
      'UPDATE todo SET description = $1 WHERE todo_id = $2',
      [description, id]
    );
    res.send('update todo');
  } catch (error) {
    console.error(error.message);
  }
});

//delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1', [
      id,
    ]);

    res.send('todo deleted');
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(port, () => console.log(`server is running on port ${port}`));
