import { authJwt } from "../middleware/index.js";
import { 
    uploadFile, 
    getFileInfo, 
    deleteFile, 
    updateFile, 
    downloadFile,
    getFileList,
} from "./../controllers/file.controller.js";

export default function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/file/upload",
        [authJwt.verifyToken],
        uploadFile
    );

    app.get(
        "/file/list",
        [authJwt.verifyToken],
        getFileList
    );
    app.get(
        "/file/:id",
        [authJwt.verifyToken],
        getFileInfo
    );

    app.delete(
        "/file/delete/:id",
        [authJwt.verifyToken],
        deleteFile
    );

    app.put(
        "/file/update/:id",
        [authJwt.verifyToken],
        updateFile
    );

    app.get(
        "/file/download/:id",
        [authJwt.verifyToken],
        downloadFile
    );

};
