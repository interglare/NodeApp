import multer from 'multer';
import path from 'path';
import { promises as fsPromises } from 'fs';
import db from './../models/index.js';
import { getPagination, getPagingData } from '../helper/helper.js';

const File = db.file;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.originalname);
    },
});
const upload = multer({ storage });

export function uploadFile(req, res) {
    const singleUpload = upload.single('file');

    singleUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, size, mimetype } = req.file;

        File.create({
            name: originalname,
            extension: path.extname(originalname),
            mimeType: mimetype,
            size,
            createdDate: new Date()
        })
            .then(file => {
                res.status(201).json({ ...file.dataValues });
            })
            .catch(error => {
                console.error('Error deleting file:', error);
                res.status(500).json({ message: 'Internal server error' });
            })
    });
};

export function getFileInfo(req, res) {
    const fileId = req.params.id;
    File.findOne({ where: { id: fileId } })
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
export function deleteFile(req, res) {
    const fileId = req.params.id;
    File.findOne({ where: { id: fileId } })
        .then(async file => {
            if (!file) {
                return res.status(404).send({ message: "File Not found." });
            }
            try {
                const filePath = `./uploads/${file.dataValues.name}`;
                await fsPromises.access(filePath);
                await fsPromises.unlink(filePath);

                res.status(200).json({ message: 'File deleted successfully' });
            } catch (error) {
                if (error.code === 'ENOENT') {
                    res.status(404).json({ message: 'File not found' });
                } else {
                    console.error('Error deleting file:', error);
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

export function updateFile(req, res) {
    const fileId = req.params.id;
    File.findOne({ where: { id: fileId } })
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
                    createdDate: new Date()
                }, { where: { id: fileId } })
                    .then(file => {
                        res.status(200).json({ ...file.dataValues });
                    })
                    .catch(error => {
                        console.error('Error deleting file:', error);
                        res.status(500).json({ message: 'Internal server error' });
                    })
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

export function downloadFile(req, res) {
    const fileId = req.params.id;
    File.findOne({ where: { id: fileId } })
        .then(file => {
            if (!file) {
                return res.status(404).send({ message: "File Not found." });
            }
            const filePath =  `./uploads/${file.dataValues.name}`;
            return res.download(filePath);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

export function getFileList(req, res){
    const { page=0, list_size=10 } = req.query;
    const { limit, offset } = getPagination(page-1, list_size);
    File.findAndCountAll({ limit, offset })
        .then(data => {
            console.log(data);
            const response = getPagingData(data, page, limit);
            return res.send(response);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}