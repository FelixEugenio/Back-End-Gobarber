
import { startOfDay,endOfDay,setHours,setMinutes,setSeconds,format,isAfter} from 'date-fns';
import Appointment from '../models/Appointments';
import {Op} from 'sequelize';

class AvaliableController{
    async index(req,res){

      const { date} = req.query;

      if(!date){
          return res.status(400).json({error:'invalid date'});
      }

      const searchDate = Number(date);

      const appointments = Appointment.findAll({
          where:{
              provider_id: req.params.providerId,
              canceledAt:null,
              date:{
                  [Op.between]: [startOfDay(searchDate),endOfDay(searchDate)],
              }
          },
      });

      const schedule = [
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
      ];

      const Avaliable = schedule.map(time =>{
          const [hour,minute] = time.split(':');
          const value = setSeconds(setMinutes(setHours(searchDate,hour ),minute),0);

          return {
              time,
              value: format(value,"yyyy-MM-dd'T'HH:mm:ssxxx"),
              Avaliable:
              isAfter(value, new Date()) &&
              ! appointments.find(a=>
                format(a.date,'HH:mm') == time),

          };
      });


        return res.json(Avaliable);



    }
}

export default new AvaliableController();
