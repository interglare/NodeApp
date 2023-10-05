import { authJwt } from "../middleware/index.js";
import { 
    uploadFile, 
    getFileInfo, 
    deleteFile, 
    updateFile, 
    downloadFile,
    getFileList,
} from "./../controllers/file.controller.js";
import express from 'express';

export const fileRoute = express.Router();

fileRoute.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

fileRoute.post(
    "/file/upload",
    [authJwt.verifyToken],
    uploadFile
);

fileRoute.get(
    "/file/list",
    [authJwt.verifyToken],
    getFileList
);
fileRoute.get(
    "/file/:id",
    [authJwt.verifyToken],
    getFileInfo
);

fileRoute.delete(
    "/file/delete/:id",
    [authJwt.verifyToken],
    deleteFile
);

fileRoute.put(
    "/file/update/:id",
    [authJwt.verifyToken],
    updateFile
);

fileRoute.get(
    "/file/download/:id",
    [authJwt.verifyToken],
    downloadFile
);
