import { MyContext } from "../types";
import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolvers {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  async user(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, req.session.userId);
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        console.log(err);
        return {
          errors: [
            {
              field: "username",
              message: "username has already been taken.",
            },
          ],
        };
      }
    }

    req.session.userId = user._id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "That username doesn't exist",
          },
        ],
      };
    }

    const verifyPassword = await argon2.verify(user.password, options.password);
    if (!verifyPassword) {
      return {
        errors: [
          {
            field: "Password",
            message: "wrong password",
          },
        ],
      };
    }

    req.session.userId = user._id;

    return {
      user,
    };
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("id") id: number,
    @Arg("username", () => String, { nullable: true }) username: string,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    const post = await em.findOne(User, id);
    if (!post) {
      return null;
    }
    if (typeof username !== undefined) {
      post.username = username;
      em.flush();
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(User, id);
    return true;
  }
}
