import multer from 'multer';

export default (multer({
    storage: multer.diskStorage({
        destination: (req, file,cb) =>{
            cb(null,'tmp/upload');
        },

        filename:(req,file,cb) =>{
            cb(null, file.originalname);
         }
    })

}));
