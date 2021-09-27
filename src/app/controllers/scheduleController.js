import { startOfDay,endOfDay,parseISO } from "date-fns";
import Appointment from "../models/Appointments";
import User from "../models/User";
import {Op} from 'sequelize';

class ScheduleController {
    async index(req,res){

        const checkUserProvider = await User.findOne({
            where: {id: req.userId, provider:true},

        });

        if(!checkUserProvider){
            return res.status(401).json({error:'User is not a provider'});
        }

        const {date} = req.query;
        const parseDate = parseISO(date);

        const appointments = await Appointment.findAll(
            {
                where:{
                    provider_id:req.userId,
                    canceledAt:null,
                    date:{
                    [Op.between]:[startOfDay(parseDate),endOfDay(parseDate)],
                    },
                },
                order:['date'],
            },

        );


        return res.json(appointments);


    }
}


export default new ScheduleController();
