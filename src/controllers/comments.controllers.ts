
import * as commentssrepository from "../repositories/comments.repository"

import { Request, Response } from "express"
import * as commentsServices from '../services/comments.services'

export const getAllcomments = async (req:Request, res: Response) => {
    try {
        const comments = await commentsServices.listComments()
        res.status(200).json(comments)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const createComment = async (req:Request, res:Response) => {
    const comment = req.body;
    try {
        const result = await commentsServices.createComment(comment)
        res.status(201).json(result)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const getCommentById = async(req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
        const comment = await commentsServices.getComment(id)
        if (comment) {
            res.status(200).json(comment) 
        } else{
            res.status(404).json({ message: 'Comment not found' });
        } 
    } catch (error:any) {
            res.status(500).json({ error: error.message });
        }
}

export const deleteComment = async (req: Request, res: Response) => {
        const id = parseInt (req.params.id)
    
        if(isNaN(id)) {
            return res.status(400).json({ message: 'Invalid comment id' });
        }

        try {
            const result = await commentsServices.deleteComment(id)
            res.status(200).json(result)
        } catch (error:any) {
            
            if (error.message === 'Comment not found') {
                return res.status(404).json({ message: 'Comment not found' })
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }


    
        export const updatecomment = async (req: Request, res:Response) => {
            const id = parseInt(req.params.id);
    
            
            if(isNaN(id)) {
                return res.status(400).json({ message: 'Invalid comment id' });
            }
    
            
            try {
                const comment = req.body;
                const result = await commentsServices.updatecomment(id, comment)
                res.status(200).json(result)
            } catch (error:any) {
                
                if (error.message === 'Comment not found') {
                    return res.status(404).json({ message:'Comment not found' });
                } else {
                    res.status(500).json({ error: error.message })
                }
            }
        }
 
    