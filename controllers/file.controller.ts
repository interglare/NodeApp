import multer from 'multer';
import path from 'path';
import { promises as fsPromises } from 'fs';
import db from '../models/index';
import { getPagination, getPagingData } from '../helper/helper';
import {Request, Response} from 'express';

const File = db.file;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now()+path.extname(file.originalname);
        callback(null, uniqueSuffix);
    },
});
const upload = multer({ storage });

export function uploadFile(req: Request, res: Response) {
    const singleUpload = upload.single('file');

    singleUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, size, mimetype, filename } = req.file;
        const name = path.parse(originalname).name
        File.create({
            id: path.parse(filename).name,
            name,
            extension: path.extname(originalname),
            mimeType: mimetype,
            size,
            uploadDate: new Date()
        })
            .then(file => {
                res.status(201).json({ ...file.dataValues });
            })
            .catch(error => {
                res.status(500).json({ message: error });
            })
    });
};

export function getFileInfo(req: Request, res: Response) {
    const {id} = req.params;
    File.findOne({ where: { id } })
        .then(file => {
            if (!file) {
                return res.status(404).send({ message: "File Not found." });
            }
            return res.status(200).send({ ...file.dataValues })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}
export function deleteFile(req: Request, res: Response) {
    const {id} = req.params;
    File.findOne({ where: { id } })
        .then(async file => {
            if (!file) {
                return res.status(404).send({ message: "File Not found." });
            }
            try {
                const filePath = `./uploads/${file.dataValues.name}`;
                await fsPromises.access(filePath);
                await fsPromises.unlink(filePath);

                res.status(200).json({ message: 'File deleted successfully' });
            } catch (error:any) {               
                if (error.code === 'ENOENT') {
                    res.status(404).json({ message: 'File not found' });
                } else {
                    res.status(500).json({ message: error });
                }
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

export function updateFile(req: Request, res: Response) {
    const {id} = req.params;
    File.findOne({ where: { id } })
        .then(async file => {
            if (!file) {
                return res.status(404).send({ message: "File Not found." });
            }
            const filePath = `./uploads/${file.dataValues.name}`;
            await fsPromises.access(filePath);
            await fsPromises.unlink(filePath);

            const singleUpload = upload.single('file');

            singleUpload(req, res, (err) => {
                if (err) {
                    return res.status(400).json({ message: 'File upload failed', error: err.message });
                }

                if (!req.file) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }
                const { originalname, size, mimetype } = req.file;

                File.update({
                    name: originalname,
                    extension: path.extname(originalname),
                    mimeType: mimetype,
                    size,
                    uploadDate: new Date()
                }, { where: { id } })
                    .then(file => {
                        res.status(200)//.json({ ...file.dataValues });
                    })
                    .catch(error => {
                        res.status(500).json({ message: error });
                    })
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

export function downloadFile(req: Request, res: Response) {
    const { id } = req.params;
    File.findOne({ where: { id } })
        .then(file => {
            if (!file) {
                return res.status(404).send({ message: "File Not found." });
            }
            const filePath =  `./uploads/${file.dataValues.id}${file.dataValues.extension}`;
            return res.download(filePath, `${file.dataValues.name}${file.dataValues.extension}`);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

export function getFileList(req: Request, res: Response){
    const { page=0, list_size=10 } = req.query;
    const { limit, offset } = getPagination(+page-1, +list_size);
    File.findAndCountAll({ limit, offset })
        .then(data => {
            const response = getPagingData(data, +page, limit);
            return res.send(response);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}