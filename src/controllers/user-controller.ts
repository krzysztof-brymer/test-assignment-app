import { Response } from 'express';
import {
  //   Authorized,
  Body,
  Delete,
  Get,
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
import { CustomErrorHandler } from '../middlewares/custom-error-handler';

@JsonController()
@Service()
export class UserController {
  constructor(private readonly userService: UserService) {}

  //   @Authorized()
  @Get('/users')
  async getAllUsers(): Promise<User[]> {
    console.info(`Get all customers from DB.`);

    return await this.userService.findAllUsers();
  }

  //   @Authorized()
  @Get('/users/:id')
  @UseBefore(ValidateUuidMiddleware)
  getSingleUser(@Param('id') id: string): Promise<User> {
    console.info(`Get single customer from DB by ID.`, { id });

    return this.userService.findUserById(id);
  }

  //   @Authorized()
  @Post('/users')
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

  //   @Authorized()
  @Put('/users/:id')
  @UseBefore(CustomErrorHandler, ValidateUuidMiddleware)
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

  //   @Authorized()
  @Delete('/users/:id')
  @UseBefore(ValidateUuidMiddleware)
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
