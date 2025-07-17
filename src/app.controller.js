import connectDB from "./DB/connectionDB.js";
import noteRouter from "./modules/note/note.controller.js";
import userRouter from "./modules/user/user.controller.js";

const bootstrap = (app , express)=> {
    app.use(express.json());
    connectDB();
    app.use("/users", userRouter);
    app.use("/notes", noteRouter);
    app.use("/*demo" , (req, res, next) => {
        return res.status(404).json({
            message: `Route not found: ${req.originalUrl}`,
            status: 404
        })
    })
}

export default bootstrap;