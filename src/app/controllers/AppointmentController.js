import { startOfHour,parseISO,isBefore,format, subHours} from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from "../models/User";
import * as Yup from 'yup';
import Appointment from "../models/Appointments";
import File from '../models/Files';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import cancellationMail from '../jobs/cancellationMail';

class AppointmentController {

      async index(req,res){

        const { page = 1} = req.query;

        const appointment = await Appointment.findAll({
            where:{ user_id: req.userId, canceledAt:null},
            order:['date'],
            attributes:['id','date','past','cancelable'],
            limit:20,
            offset:(page - 1) * 20,
            include:[
                {
                    model:User,
                    as:'provider',
                    attributes:['id','name'],
                    include:[
                       {
                        model: File,
                        as: 'avatar',
                        attributes:['id','path','url'],
                       }
                    ]
                }
            ]
        });

        return res.json(appointment);


      }

    async store(req,res){

       const schema = Yup.object().shape({
           provider_id:Yup.number().required(),
           date:Yup.date().required(),
       });

       if(!(await schema.isValid(req.body))){
           return res.status(400).json({error:'Validation Fails'});

       }

       const { provider_id, date}= req.body;

       const isProvider = await User.findOne({
           where:{id:provider_id,provider:true},
       });

       if(!isProvider){
           return res
           .status(401)
           .json({error:'you can only create appointments with provider'});
       }


       const hourstart = startOfHour(parseISO(date));

       if(isBefore(hourstart, new Date())){
           return res.status(400).json({error:'Past Date are not permited'});

       }

       const checkAvaliability = await Appointment.findOne({
           where:{
               provider_id,
               canceledAt:null,
               date:hourstart,
           }
       });

       if(checkAvaliability){
        return res.status(400).json({error:'appointment date is not avaliable'});

       }

       const appointment = await Appointment.create({
           user_id: req.userId,
           provider_id,
           date:hourstart,

       });



       const user = await User.findByPk(req.userId);

       const formatedDate = format(
           hourstart,
           "'dia' dd 'de' MMMM',as' H:mm'h'",
           { locale:pt }
       );



       await Notification.create({
           content: `Novo Agendamento de ${user.name} para  ${formatedDate}`,
           user: provider_id,
       });



        return res.json(appointment);

    }

    async delete(req,res){

        const appointment = await Appointment.findByPk(req.params.id,{
            include:[
                {
                    model:User,
                    as:'provider',
                    attributes:['name','email'],

                },

                {
                   model:User,
                   as:'user',
                   attributes:['name'],
                },
            ]
        });

        if(appointment.user_id != req.userId){
            return res.status(401).json({
                error:'You dont have permission to cancel this appointment',

            });

        }

        const dateWithSub = subHours(appointment.date, 2);

        if(isBefore(dateWithSub, new Date())){
            return res.status(401).json({
                error:'you can only cancel appointment 2 hours in adavance'
            });
        }

        appointment.canceledAt = new Date();

        await appointment.save();

        await Queue.add(cancellationMail.key,{
            appointment,
        });



        return res.json(appointment);
    }
}

export default new AppointmentController();
