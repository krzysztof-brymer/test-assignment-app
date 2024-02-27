import { Response } from 'express';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  Res,
  UseBefore
} from 'routing-controllers';
import { Service } from 'typedi';
import { User } from '../database/entities/User';
import { UserService } from '../services/user-service';
import { CreateUser } from '../models/requests/create-user';
import { ValidateUuidMiddleware } from '../middlewares/uuid-param-validator';
import { UpdateUser } from '../models/requests/update-user';
import { CustomErrorHandlerMiddleware } from '../middlewares/custom-error-handler';
import { OpenAPI } from 'routing-controllers-openapi';
import { BasicAuthMiddleware } from '../middlewares/basic-authorization';

@JsonController()
@Service()
@UseBefore(BasicAuthMiddleware)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  @OpenAPI({ summary: 'Fetches all Users.' })
  async getAllUsers(): Promise<User[]> {
    console.info(`Get all customers from DB.`);

    return await this.userService.findAllUsers();
  }

  @Get('/users/:id')
  @OpenAPI({ summary: 'Fetches User by ID.' })
  @UseBefore(ValidateUuidMiddleware)
  getSingleUser(@Param('id') id: string): Promise<User> {
    console.info(`Get single customer from DB by ID.`, { id });

    return this.userService.findUserById(id);
  }

  @Post('/users')
  @HttpCode(201)
  @OpenAPI({ summary: 'Creates new User.' })
  public async createNewUser(
    @Body() body: CreateUser,
    @Res() res: Response
  ): Promise<Response> {
    console.info(`Create new customer in DB.`, body);

    const result = await this.userService.createUser(body);

    return res
      .status(201)
      .send({ message: 'User successfully created.', user: { ...result } });
  }

  @Put('/users/:id')
  @OpenAPI({ summary: 'Update User by ID.' })
  @UseBefore(CustomErrorHandlerMiddleware, ValidateUuidMiddleware)
  async updateUserDetails(
    @Param('id') id: string,
    @Body() body: UpdateUser,
    @Res() res: Response
  ): Promise<Response> {
    console.info(`Update customer details in DB.`, body);

    const result = await this.userService.updateUser(id, body);

    return result.affected === 0
      ? res.status(404).send({ message: "User with given ID doesn't exist." })
      : res.status(200).send({
          message: 'User successfully updated.',
          user: { id, ...body }
        });
  }

  @Delete('/users/:id')
  @UseBefore(ValidateUuidMiddleware)
  @HttpCode(204)
  @OpenAPI({ summary: 'Delete user by ID.' })
  async removeUser(
    @Param('id') id: string,
    @Res() res: Response
  ): Promise<Response> {
    console.info(`Delete user from DB.`, { id });

    const result = await this.userService.deleteUserById(id);

    return result.affected === 0
      ? res.status(404).send({ message: "User with given ID doesn't exist." })
      : res.sendStatus(204);
  }
}
