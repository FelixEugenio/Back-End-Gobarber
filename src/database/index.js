import   Sequelize  from 'sequelize';
import  mongoose  from 'mongoose';
import File from '../app/models/Files';
import User from '../app/models/User';
import databaseConfig from '../config/database';
import Appointment from '../app/models/Appointments';


const models = [User, File, Appointment];
class Database{
    constructor(){
        this.init();
        this.mongo();

    }

    init(){
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection));
        models.map(model => model.associate && model.associate(this.connection.models));

    }

    mongo(){
        this.mongoConnection = mongoose.connect(
            process.env.MONGO_URL,
            {useUnifiedTopology: true, useNewUrlParser: true }
        );

    }
}


export default new Database;
