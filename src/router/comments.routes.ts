
import { Express } from "express";
import * as commentscontrollers from "../controllers/comments.controllers"

const commentsRoutes = (app: Express) =>{
    //get all comments
    app.get("/comments", commentscontrollers.getAllcomments);
    //add comment
    app.post("/comments", commentscontrollers.createComment);
    //get comment by id
    app.get("/comments/:id", commentscontrollers.getCommentById);
    //delete a comment
     app.delete("/comments/:id", commentscontrollers.deleteComment);
     //update a comment
     app.put("/comments/:id", commentscontrollers.updatecomment)

}

export default commentsRoutes;