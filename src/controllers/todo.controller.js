import {dbClient}  from "../db.js";
import {TODOS} from '../contantes/constantes.js';

export const getTodos = async (req, res) => {

    try {
        const {rows} = await dbClient.query(
            "SELECT * FROM todos"
        );

        const response = rows[0];
        req.log.info({ response }, 'Completado con exito GET /todos');
        res.status(200).json(response);
    }catch(error) {
        req.log.error({ error }, 'Error in GET /todos');
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getTodoById = async (req, res) => {
    const { id } = req.params;

    req.log.info({ params: req.params }, 'Incoming GET /todos/:id');

    try {
        const { rows } = await dbClient.query("SELECT * FROM todos WHERE id = $1", [id]);

        if (rows.length > 0) {
            const response = rows[0];
            req.log.info({ response }, 'Completado con exito GET /todos/:id');
            res.status(200).json(response);
        } else {
            const response = { error: "Todo no existe" };
            req.log.info({ response }, 'Not found response for GET /todos/:id');
            res.status(404).json(response);
        }
    } catch (error) {
        req.log.error({ error }, 'Error in GET /todos/:id');
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getTodoByIdSample = (req, res) => {
    const { id } = req.params;

    const resultadoBusqueda = TODOS.filter( x => x.id == id);

    if(resultadoBusqueda.length > 0)
    {
        res.status(200).json(resultadoBusqueda[0]);
    }else{
        const mensaje = `No se encontro todo con id ${id}`;
        res.status(404).json({
            mensaje: mensaje,
        });
    }
};

export const createTodo = async (req, res) => {
    try
    {
        const { name, description } = req.body;
        const complete = 0;

        req.log.info({ params: req.body }, 'Incoming Post /createTodo');

        const {rows} = await dbClient.query(
            "INSERT INTO todos (name, description, complete) VALUES ($1, $2, $3) RETURNING *",
            [name, description, complete]
        );

        const response = rows[0];

        req.log.info({ response }, 'Completado con exito Post /todos');
        res.status(201).json(rows[0]);

    }catch (error)
    {
        req.log.error({ error }, 'Error in Post /todos');
        res.status(500).json({ error: error.message });
    }
};

export const completeTodo = async (req, res) => {
    const { id } = req.params;

    req.log.info({ params: req.params }, 'Incoming Update /todos');

    try {
        const { rows } = await dbClient.query(
            "UPDATE todos SET complete = '1' WHERE id = $1 RETURNING *",
            [id]);

        if(rows.length > 0){
            const response = rows[0];
            req.log.info({ response }, 'Completado con exito Update /todos');
            res.status(200).json(response);
        }
        else{
            const response = { error: "Todo no existe" };
            req.log.info({ response }, 'Not found response for Update /todos');
            res.status(404).json(response);
        }
    }catch (error) {
        req.log.error({ error }, 'Error in Update /todos');
        res.status(500).json({ error: error.message });
    }
};

export const deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await dbClient.query(
            "DELETE FROM todos WHERE id = $1 RETURNING *",
            [id]);

        if(rows.length > 0){
            const response = rows[0];
            req.log.info({ response }, 'Completado con exito Delete /todos/:id');
            res.status(200).json(response);
        }
        else{
            const response = { error: "Todo no existe" };
            req.log.info({ response }, 'Not found response for Delete /todos');
            res.status(404).json(response);
        }

    }catch (error) {
        req.log.error({ error }, 'Error in Delete /todos');
        res.status(500).json({ error: error.message });
    }
};