import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockPostRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('PostService', () => {
  let service: PostService;
  let repository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a post', async () => {
      const createDto = { title: 'T1', content: 'C1', author: 'A1' };
      const post = { ...createDto, createdAt: new Date(), updatedAt: new Date() };
      mockPostRepository.create.mockReturnValue(post);
      mockPostRepository.save.mockResolvedValue({ id: 1, ...post });

      const result = await service.create(createDto);
      expect(result).toHaveProperty('id', 1);
      expect(mockPostRepository.create).toHaveBeenCalled();
      expect(mockPostRepository.save).toHaveBeenCalledWith(post);
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const posts = [{ id: 1, title: 'T1' }];
      mockPostRepository.find.mockResolvedValue(posts);

      const result = await service.findAll();
      expect(result).toEqual(posts);
      expect(mockPostRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single post by id', async () => {
      const post = { id: 1, title: 'T1' };
      mockPostRepository.findOne.mockResolvedValue(post);

      const result = await service.findOne(1);
      expect(result).toEqual(post);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if post not found', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post and return updated post', async () => {
      const post = { id: 1, title: 'T1' };
      const updatedPost = { id: 1, title: 'Updated' };
      
      jest.spyOn(service, 'findOne')
        .mockResolvedValueOnce(post as any)
        .mockResolvedValueOnce(updatedPost as any);
      
      mockPostRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, { title: 'Updated' });
      expect(result).toEqual(updatedPost);
      expect(mockPostRepository.update).toHaveBeenCalledWith(1, { title: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      const post = { id: 1, title: 'T1' };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(post as any);
      mockPostRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toEqual(`Post com id #1 removido com sucesso`);
      expect(mockPostRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('searchByTitleOrContent', () => {
    it('should return matched posts', async () => {
      const posts = [{ id: 1, title: 'T1' }];
      mockPostRepository.find.mockResolvedValue(posts);

      const result = await service.searchByTitleOrContent('T1');
      expect(result).toEqual(posts);
    });
  });
});
