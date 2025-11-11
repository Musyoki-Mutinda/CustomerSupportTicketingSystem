import * as commentsRepository from "../repositories/comments.repository"
import dotenv from 'dotenv'
import {NewComment, updateComment}from "../Types/comment.type"



dotenv.config()//import variables
export const listComments=async()=>await commentsRepository.getAllcomments()
export const createComment=async(comment:NewComment)=>{
      return await commentsRepository.createcomment(comment)
}
export const getComment = async (id: number) => await commentsRepository.getCommentById(id);

export const deleteComment = async(id:number) => {
    return await commentsRepository.deleteComment(id)

}
export const updatecomment =async(id:number,comment:updateComment)=> {
    return await commentsRepository.updatecomment(id,comment)
}