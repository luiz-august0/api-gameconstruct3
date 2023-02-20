import { Router } from "express";
import PlayerController from "./routes/PlayerController";

const routes = new Router();

routes.post('/player_score', PlayerController.post);
routes.get('/player_score', PlayerController.get);

export default routes;