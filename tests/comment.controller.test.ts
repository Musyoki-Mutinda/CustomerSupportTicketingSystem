import { Request, Response } from 'express';
import * as commentController from '../src/controllers/comments.controllers';
import * as commentService from '../src/services/comments.services';

// Mock the comment service
jest.mock('../src/services/comments.services');

describe('Comment Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe('getAllcomments', () => {
    it('should return all comments', async () => {
      const mockComments = [{ comment_ID: 1, comment_text: 'Test comment' }];
      (commentService.listComments as jest.Mock).mockResolvedValue(mockComments);

      await commentController.getAllcomments(mockRequest as Request, mockResponse as Response);

      expect(commentService.listComments).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockComments);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (commentService.listComments as jest.Mock).mockRejectedValue(error);

      await commentController.getAllcomments(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const mockComment = { comment_date: '2023-12-01', ticket_no: 1, comment_text: 'New comment', customer_ID: 1 };
      const mockResult = { message: 'Comment created successfully' };
      mockRequest = { body: mockComment };
      (commentService.createComment as jest.Mock).mockResolvedValue(mockResult);

      await commentController.createComment(mockRequest as Request, mockResponse as Response);

      expect(commentService.createComment).toHaveBeenCalledWith(mockComment);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle errors', async () => {
      const error = new Error('Creation error');
      mockRequest = { body: {} };
      (commentService.createComment as jest.Mock).mockRejectedValue(error);

      await commentController.createComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getCommentById', () => {
    it('should return comment by id', async () => {
      const mockComment = [{ comment_ID: 1, comment_text: 'Test comment' }];
      mockRequest = { params: { id: '1' } };
      (commentService.getComment as jest.Mock).mockResolvedValue(mockComment);

      await commentController.getCommentById(mockRequest as Request, mockResponse as Response);

      expect(commentService.getComment).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockComment);
    });

    it('should return 404 if comment not found', async () => {
      mockRequest = { params: { id: '1' } };
      (commentService.getComment as jest.Mock).mockResolvedValue(null);

      await commentController.getCommentById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Comment not found' });
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', async () => {
      const mockResult = { message: 'Comment deleted successfully' };
      mockRequest = { params: { id: '1' } };
      (commentService.deleteComment as jest.Mock).mockResolvedValue(mockResult);

      await commentController.deleteComment(mockRequest as Request, mockResponse as Response);

      expect(commentService.deleteComment).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 for invalid id', async () => {
      mockRequest = { params: { id: 'abc' } };

      await commentController.deleteComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid comment id' });
    });
  });

  describe('updatecomment', () => {
    it('should update comment', async () => {
      const mockComment = { comment_text: 'Updated comment' };
      const mockResult = { message: 'Comment updated successfully' };
      mockRequest = { params: { id: '1' }, body: mockComment };
      (commentService.updatecomment as jest.Mock).mockResolvedValue(mockResult);

      await commentController.updatecomment(mockRequest as Request, mockResponse as Response);

      expect(commentService.updatecomment).toHaveBeenCalledWith(1, mockComment);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });
  });
});