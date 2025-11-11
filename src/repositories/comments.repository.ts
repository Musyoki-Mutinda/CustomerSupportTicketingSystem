import { getPool } from "../db/config"

import { Comment, NewComment , updateComment } from "../Types/comment.type";


//get all comments
export const getAllcomments=async()=>{
    const pool=await getPool();
    const results=await pool.request() .query(`SELECT* FROM comments`)
    return results.recordset

}
//creat a new comment
export const createcomment=async(comment:NewComment)=>{
    const pool=await getPool();
    await pool
    .request()
    .input('comment_date',comment.comment_date)
    .input('ticket_no',comment.ticket_no)
    .input('comment_text',comment.comment_text)
    .input('customer_ID',comment.customer_ID)
    .query('INSERT INTO comments (comment_date,ticket_no,comment_text,customer_ID) VALUES(@comment_date,@ticket_no,@comment_text,@customer_ID)');
    return {messsage:'comment created successfully'}

}

//get comment by id
export const getCommentById = async(id:number):Promise<Comment[]> => {
    const pool = await getPool();
    const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * FROM comments WHERE comment_ID=@id')
    return result.recordset[0]
}

//delete a comment
export const deleteComment = async(id:number) => {
    const pool = await getPool();
    await pool.request()
    .input('id', id)
    .query('DELETE FROM comments WHERE comment_ID = @id')
    return { message: 'Comment deleted successfully' }
}
//update a comment
export const updatecomment = async(id:number, comment: updateComment) => {
    const pool = await getPool();
    await pool.request()
    .input('comment_date',comment.comment_date)
    .input('ticket_no',comment.ticket_no)
    .input('comment_text',comment.comment_text)
    .input('customer_ID',comment.customer_ID)
    .input('id',id)   
            
    .query('UPDATE comments SET comment_date=@comment_date,ticket_no=@ticket_no,comment_text=@comment_text,customer_ID=@customer_ID WHERE comment_id=@id');
    return {messsage:'comment updated successfully'}
}