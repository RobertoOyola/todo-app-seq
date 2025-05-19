import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import routerTodos from './routes/todos.routes.js';
import seq from 'pino-seq';

const seqStream = seq.createStream({
    serverUrl: 'http://localhost:5341', // O 'http://seq:5341' si usas Docker Compose
    apiKey: '',
});

const logger = pino({}, seqStream);

const app = express();
app.use(cors());
app.use(express.json());

app.use(morgan("dev"));
app.use(pinoHttp({ logger }));

app.use(routerTodos);

app.listen(3000, () => console.log('Listening on port', 3000));
