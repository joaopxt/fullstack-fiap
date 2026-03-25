import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) { }
  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create({
      ...createPostDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.postRepository.save(post);
  }

  async findAll() {
    const posts = await this.postRepository.find();

    if (!posts) throw new NotFoundException(`Posts não encontrados`);

    return posts;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({ where: { id } })

    if (!post) throw new NotFoundException(`Post com id #${id} não encontrado`);

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    this.postRepository.update(post.id, updatePostDto);

    return await this.findOne(post.id);
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    await this.postRepository.delete(post.id);

    return `Post com id #${id} removido com sucesso`;
  }

  async searchByTitleOrContent(query: string) {
    const posts = await this.postRepository.find({
      where: {
        title: Like(`%${query}%`),
        content: Like(`%${query}%`),
      },
    });

    if (!posts) throw new NotFoundException(`Posts não encontrados`);

    return posts;
  }
}
