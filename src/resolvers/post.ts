import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Resolver, Query, Ctx, Arg, Mutation, ObjectType, Field } from "type-graphql";

@ObjectType()
class FieldErrorPost {
  @Field()
  field?: string;

  @Field()
  message: string;
}

@ObjectType()
class PostResponse {
  @Field(() => [FieldErrorPost], { nullable: true })
  errors?: FieldErrorPost[];

  @Field(() => [Post], { nullable: true })
  post?: Post[];
}

@ObjectType()
class SinglePostResponse {
  @Field(() => [FieldErrorPost], { nullable: true })
  errors?: FieldErrorPost[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType()
class DeletePostResponse {
  @Field(() => [FieldErrorPost], { nullable: true })
  errors?: FieldErrorPost[];

  @Field(() => Boolean)
  isDeleted?: false | true;
}

@Resolver()
export class PostResolvers {
  @Query(() => PostResponse)
  async posts(@Ctx() { em, req }: MyContext): Promise<PostResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            message : "you have not been logged in"
          }
       ],
       post : []
      };
    }

    let datas = await em.find(Post, {})
    return { post : datas};
  }

  @Query(() => SinglePostResponse)
  async post(@Arg("id") id: number, @Ctx() { em, req }: MyContext): Promise<SinglePostResponse> {
    if(!req.session.userId){
      return {
        errors : [
          {
            message : "You have not been logged in"
          }
        ]
      }
    }
    let post = await em.findOne(Post, id);
    return {post: post!}; 
  }

  @Mutation(() => SinglePostResponse)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em, req }: MyContext
  ): Promise<SinglePostResponse> {
  if(!req.session.userId){
        return {
          errors: [
            {
              message: "You have not been logged in"
            }
          ]
        }
      }
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return {post};
  }

  @Mutation(() => SinglePostResponse)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<SinglePostResponse> {
    const post = await em.findOne(Post, id);
    if (!post) {
      return {
          errors: [{
            message : "can't find post"
          }
          ]
        };
    }
    if (typeof title !== undefined) {
      post.title = title;
      em.flush();
    }
    return {post};
  }

  @Mutation(() => DeletePostResponse)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em, req }: MyContext
  ): Promise<DeletePostResponse> {
  if(!req.session.userId){
        return {
          errors : [
            {
              message: "you have not logged in"
            }
          ],
          isDeleted : false
        }
      }
    await em.nativeDelete(Post, id);
    return {
        isDeleted! : true
      };
  }
}
