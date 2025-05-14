// src/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { join } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: join(process.cwd(), 'public/uploads'),
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};
