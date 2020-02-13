import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import DataBase from './config/db';
import * as cors from "cors";
import uploads from "./config/uploads";
import * as jwt from "jsonwebtoken";


 import Auth from './config/auth';
 

//Route
import UserController from './controllers/userController';

class App {
  public app: express.Application;
  private morgan: morgan.Morgan;
  private bodyParser;
  private database: DataBase;

  constructor() {
    this.app = express();
    this.enableCors();
    this.middleware();
    this.database = new DataBase();
    this.dataBaseConnection();
    this.routes();
  }

  enableCors() {
    const options: cors.CorsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: '*',
      preflightContinue: false
    };

    this.app.use(cors(options));
  }

  dataBaseConnection() {
    this.database.createConnection();
  }

  closedataBaseConnection(message, callback) {
    this.database.closeConnection(message, () => callback());
  }

  middleware() {
    this.app.use(morgan("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  routes() {

    this.app.route("/").get((req, res) => {
      res.send({ 'result': 'version 0.0.2' })
    });
    
    //authentication
  this.app.route('api/v1/login').post((req, res, next) => {
  if(req.body.user === 'usuario' && req.body.pwd === 'senha'){
    //auth ok
    const id = 1; //esse id viria do banco de dados
    var token = jwt.sign({ id }, 'developer', {
      expiresIn: 300 // expires in 5min
    });
    res.status(200).send({ auth: true, token: token });
  }
  res.status(500).send('Login inválido!');
});
 
//logout
this.app.route('api/v1/logout').get(function(req, res) {
  res.status(200).send({ auth: false, token: null });
});
    
    
    this.app.use(Auth.validate);
     

    this.app.route("/api/v1/users").get(UserController.get);
    this.app.route("/api/v1/users/:id").get(UserController.getById);
    this.app.route("/api/v1/users").post(UserController.create);
    this.app.route("/api/v1/users/:id").put(UserController.update);
    this.app.route("/api/v1/users/:id").delete(UserController.delete);


  }
}

export default new App();
