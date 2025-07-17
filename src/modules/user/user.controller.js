import { Router } from "express";
import { createUser, deleteLoggedInUser, getLoggedInUser, loginUser, updateLoggedInUser } from "./user.service.js";
import authentication from "../../midddleware/authentication.js";

const userRouter = Router();

userRouter.post("/signup", createUser );
userRouter.post("/login", loginUser );
userRouter.patch("/", authentication, updateLoggedInUser );
userRouter.delete("/", authentication, deleteLoggedInUser );
userRouter.get("/", authentication, getLoggedInUser );

export default userRouter;
