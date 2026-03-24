import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const mockPostService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  searchByTitleOrContent: jest.fn(),
};

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create => should create a new post', async () => {
    const createDto: CreatePostDto = { title: 'Test', content: 'Test content', author: 'Author' };
    const result = { id: 1, ...createDto };
    mockPostService.create.mockResolvedValue(result);

    expect(await controller.create(createDto)).toEqual(result);
    expect(mockPostService.create).toHaveBeenCalledWith(createDto);
  });

  it('findAll => should return all posts', async () => {
    const result = [{ id: 1, title: 'Test' }];
    mockPostService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
    expect(mockPostService.findAll).toHaveBeenCalled();
  });

  it('findOne => should return a post by id', async () => {
    const result = { id: 1, title: 'Test' };
    mockPostService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(mockPostService.findOne).toHaveBeenCalledWith(1);
  });

  it('update => should update a post', async () => {
    const updateDto: UpdatePostDto = { title: 'Updated' };
    const result = { id: 1, title: 'Updated' };
    mockPostService.update.mockResolvedValue(result);

    expect(await controller.update('1', updateDto)).toEqual(result);
    expect(mockPostService.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('remove => should delete a post', async () => {
    mockPostService.remove.mockResolvedValue('Post com id #1 removido com sucesso');

    expect(await controller.remove('1')).toEqual('Post com id #1 removido com sucesso');
    expect(mockPostService.remove).toHaveBeenCalledWith(1);
  });

  it('searchByTitleOrContent => should return filtered posts', async () => {
    const result = [{ id: 1, title: 'Test search' }];
    mockPostService.searchByTitleOrContent.mockResolvedValue(result);

    expect(await controller.searchByTitleOrContent('search')).toEqual(result);
    expect(mockPostService.searchByTitleOrContent).toHaveBeenCalledWith('search');
  });
});
