import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  Response,
  UseGuards,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/user.entity';
import { UserDto } from './user.dto';
import { UserEditDto } from './userEdit.dto';
import { UserPasswordDto } from './UserPassword.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/superadmin')
  public async createAdmin(@Response() res) {
    const response = await this.userService.getAdminUser();
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('create')
  public async create(@Response() res, @Body() user: UserDto): Promise<any> {
    const response = await this.userService.create(user, user.customerId);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async get(
    @Request() req,
    @Response() res,
    @Param() param: any,
  ): Promise<User> {
    const response = await this.userService.findOne(req.user.userId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('admin/:email/:role')
  public async getAdmin(@Response() res, @Param() param: any): Promise<User> {
    const response = await this.userService.findAdmin(param.email, param.role);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('role/:role')
  public async getUserByRole(
    @Param() param: any,
    @Response() res,
  ): Promise<User[]> {
    const response = await this.userService.findAllUser(param.role);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('customer/:customerId')
  public async findCustomerUser(
    @Param() param: any,
    @Response() res,
  ): Promise<User[]> {
    const response = await this.userService.findCustomerUser(param.customerId);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAll(@Response() res) {
    const response = await this.userService.findAll();
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  public async update(
    @Request() req,
    @Response() res,
    @Param() param: any,
    @Body() body: UserEditDto,
  ): Promise<any> {
    const user = await this.userService.findOne(req.user.userId);
    const response = await this.userService.update(user, body);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-password/:id')
  public async update_password(
    @Request() req,
    @Response() res,
    @Param() param: any,
    @Body() body: UserPasswordDto,
  ): Promise<any> {
    const user = await this.userService.findOne(req.user.userId);
    const response = await this.userService.updatePassword(user, body);
    return res.status(HttpStatus.OK).json(response);
  }

  @Patch('update-chat-id/:id')
  public async update_chat_id(
    @Request() req,
    @Response() res,
    @Param() param: any,
    @Body() body: { chat_id: string },
  ): Promise<any> {
    const user = await this.userService.findOne(param.id);
    const response = await this.userService.update_chat_id(user, body);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  public async delete(@Response() res, @Param() param: any): Promise<any> {
    const response = await this.userService.delete(param.id);
    return res.status(HttpStatus.OK).json(response);
  }
}
