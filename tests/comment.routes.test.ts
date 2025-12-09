import { Express } from 'express';
import commentsRoutes from '../src/router/comments.routes';
import * as commentsController from '../src/controllers/comments.controllers';

// Mock the controller
jest.mock('../src/controllers/comments.controllers');

describe('Comments Routes', () => {
  let mockApp: Partial<Express>;

  beforeEach(() => {
    mockApp = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should set up routes correctly', () => {
    commentsRoutes(mockApp as Express);

    expect(mockApp.get).toHaveBeenCalledWith('/comments', commentsController.getAllcomments);
    expect(mockApp.post).toHaveBeenCalledWith('/addcomment', commentsController.createComment);
    expect(mockApp.get).toHaveBeenCalledWith('/comments/:id', commentsController.getCommentById);
    expect(mockApp.delete).toHaveBeenCalledWith('/comments/:id', commentsController.deleteComment);
    expect(mockApp.put).toHaveBeenCalledWith('/comments/:id', commentsController.updatecomment);
  });
});