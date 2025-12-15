import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ReviewDocument } from './review.model';
import { CreateReviewDto } from './dto/create-review.dto';

describe('ReviewService', () => {
  let service: ReviewService;

  const mockReviewModel = {
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getModelToken('Review'),
          useValue: mockReviewModel,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a review', async () => {
      const dto: CreateReviewDto = {
        name: 'Test User',
        title: 'Test Review',
        description: 'Test Description',
        rating: 5,
        productId: new Types.ObjectId().toHexString(),
      };

      const mockReview = {
        _id: new Types.ObjectId(),
        ...dto,
        productId: new Types.ObjectId(dto.productId),
      } as ReviewDocument;

      mockReviewModel.create.mockResolvedValue(mockReview);

      const result = await service.create(dto);

      expect(result).toEqual(mockReview);
      expect(mockReviewModel.create).toHaveBeenCalledWith({
        ...dto,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        productId: expect.any(Types.ObjectId),
      });
    });
  });

  describe('delete', () => {
    it('should delete a review by id', async () => {
      const id = new Types.ObjectId().toHexString();
      const mockReview = {
        _id: new Types.ObjectId(id),
        name: 'Test User',
        title: 'Test Review',
      } as ReviewDocument;

      mockReviewModel.findByIdAndDelete.mockResolvedValue(mockReview);

      const result = await service.delete(id);

      expect(result).toEqual(mockReview);
      expect(mockReviewModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should return null if review not found', async () => {
      const id = new Types.ObjectId().toHexString();

      mockReviewModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await service.delete(id);

      expect(result).toBeNull();
      expect(mockReviewModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('findByProductId', () => {
    it('should find reviews by product id', async () => {
      const productId = new Types.ObjectId().toHexString();
      const mockReviews = [
        {
          _id: new Types.ObjectId(),
          productId: new Types.ObjectId(productId),
          name: 'Test User 1',
          title: 'Test Review 1',
        },
        {
          _id: new Types.ObjectId(),
          productId: new Types.ObjectId(productId),
          name: 'Test User 2',
          title: 'Test Review 2',
        },
      ] as ReviewDocument[];

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockReviews),
      };

      mockReviewModel.find.mockReturnValue(mockQuery);

      const result = await service.findByProductId(productId);

      expect(result).toEqual(mockReviews);
      expect(mockReviewModel.find).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        productId: expect.any(Types.ObjectId),
      });
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('should return empty array if no reviews found', async () => {
      const productId = new Types.ObjectId().toHexString();

      const mockQuery = {
        exec: jest.fn().mockResolvedValue([]),
      };

      mockReviewModel.find.mockReturnValue(mockQuery);

      const result = await service.findByProductId(productId);

      expect(result).toEqual([]);
      expect(mockReviewModel.find).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        productId: expect.any(Types.ObjectId),
      });
    });
  });

  describe('deleteByProductId', () => {
    it('should delete all reviews by product id', async () => {
      const productId = new Types.ObjectId().toHexString();
      const mockDeleteResult = {
        acknowledged: true,
        deletedCount: 3,
      };

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockDeleteResult),
      };

      mockReviewModel.deleteMany.mockReturnValue(mockQuery);

      const result = await service.deleteByProductId(productId);

      expect(result).toEqual(mockDeleteResult);
      expect(mockReviewModel.deleteMany).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        productId: expect.any(Types.ObjectId),
      });
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });
});
