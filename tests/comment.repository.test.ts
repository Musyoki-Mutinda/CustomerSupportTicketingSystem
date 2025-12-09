import * as commentRepository from '../src/repositories/comments.repository';
import { getPool } from '../src/db/config';

// Mock the db config
jest.mock('../src/db/config');

describe('Comment Repository', () => {
  let mockPool: any;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };
    mockPool = {
      request: jest.fn().mockReturnValue(mockRequest),
    };
    (getPool as jest.Mock).mockResolvedValue(mockPool);
    jest.clearAllMocks();
  });

  describe('getAllcomments', () => {
    it('should return all comments', async () => {
      const mockComments = [{ comment_ID: 1, comment_text: 'Test comment' }];
      mockRequest.query.mockResolvedValue({ recordset: mockComments });

      const result = await commentRepository.getAllcomments();

      expect(getPool).toHaveBeenCalled();
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT* FROM comments');
      expect(result).toEqual(mockComments);
    });
  });

  describe('createcomment', () => {
    it('should create a comment', async () => {
      const mockComment = { comment_date: new Date('2023-12-01'), ticket_no: 1, comment_text: 'New comment', customer_ID: 1 };
      const mockResult = { message: 'comment created successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await commentRepository.createcomment(mockComment);

      expect(mockRequest.input).toHaveBeenCalledWith('comment_date', new Date('2023-12-01'));
      expect(mockRequest.input).toHaveBeenCalledWith('ticket_no', 1);
      expect(mockRequest.input).toHaveBeenCalledWith('comment_text', 'New comment');
      expect(mockRequest.input).toHaveBeenCalledWith('customer_ID', 1);
      expect(mockRequest.query).toHaveBeenCalledWith('INSERT INTO comments (comment_date,ticket_no,comment_text,customer_ID) VALUES(@comment_date,@ticket_no,@comment_text,@customer_ID)');
      expect(result).toEqual({ message: 'comment created successfully' });
    });
  });

  describe('getCommentById', () => {
    it('should return comment by id', async () => {
      const mockComment = [{ comment_ID: 1, comment_text: 'Test comment' }];
      mockRequest.query.mockResolvedValue({ recordset: mockComment });

      const result = await commentRepository.getCommentById(1);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM comments WHERE comment_ID=@id');
      expect(result).toEqual(mockComment[0]);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', async () => {
      const mockResult = { message: 'Comment deleted successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await commentRepository.deleteComment(1);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.query).toHaveBeenCalledWith('DELETE FROM comments WHERE comment_ID = @id');
      expect(result).toEqual({ message: 'Comment deleted successfully' });
    });
  });

  describe('updatecomment', () => {
    it('should update comment', async () => {
      const updateData = { comment_date: new Date('2023-12-02'), ticket_no: 2, comment_text: 'Updated comment', customer_ID: 2 };
      const mockResult = { message: 'comment updated successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await commentRepository.updatecomment(1, updateData);

      expect(mockRequest.input).toHaveBeenCalledWith('comment_date', new Date('2023-12-02'));
      expect(mockRequest.input).toHaveBeenCalledWith('ticket_no', 2);
      expect(mockRequest.input).toHaveBeenCalledWith('comment_text', 'Updated comment');
      expect(mockRequest.input).toHaveBeenCalledWith('customer_ID', 2);
      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.query).toHaveBeenCalledWith('UPDATE comments SET comment_date=@comment_date,ticket_no=@ticket_no,comment_text=@comment_text,customer_ID=@customer_ID WHERE comment_id=@id');
      expect(result).toEqual({ message: 'comment updated successfully' });
    });
  });
});