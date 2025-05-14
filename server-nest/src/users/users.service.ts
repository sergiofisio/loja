import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private getAsaasHeaders() {
    return {
      access_token: this.config.get('ASAAS_API_KEY'),
      'Content-Type': 'application/json',
      accept: 'application/json',
    };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, document, password } = createUserDto;

      const emailExists = await this.prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) throw new ConflictException('Email já cadastrado.');

      const documentExists = await this.prisma.user.findUnique({
        where: { document },
      });
      if (documentExists)
        throw new ConflictException('Documento já cadastrado.');

      const asaasResponse = await firstValueFrom(
        this.http.post(
          `${this.config.get('ASAAS_URL')}/customers`,
          {
            name,
            email,
            cpfCnpj: document,
          },
          { headers: this.getAsaasHeaders() },
        ),
      );

      const asaasId = asaasResponse.data.id;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          id: asaasId,
          password: hashedPassword,
        },
      });

      return { status: 'ok', messagem: 'Usuário criado com sucesso!' };
    } catch (error) {
      console.error('Erro ao criar usuário:', error?.response?.data || error);

      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          cart: true,
        },
      });

      const usersInfo = [];

      users.forEach(async (user) => {
        const asaasResponse = await firstValueFrom(
          this.http.get(
            `${this.config.get('ASAAS_URL')}/customers/${user.id}`,
            {
              headers: this.getAsaasHeaders(),
            },
          ),
        );
        console.log({ asaasResponse });
      });
      // return asaasResponse.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error?.response?.data || error);
      throw new InternalServerErrorException('Erro ao listar usuários.');
    }
  }

  async findOne(id: string) {
    try {
      const asaasResponse = await firstValueFrom(
        this.http.get(`${this.config.get('ASAAS_URL')}/customers/${id}`, {
          headers: this.getAsaasHeaders(),
        }),
      );
      return asaasResponse.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error?.response?.data || error);
      throw new InternalServerErrorException('Erro ao buscar usuário.');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const asaasUpdate = await firstValueFrom(
        this.http.put(
          `${this.config.get('ASAAS_URL')}/customers/${id}`,
          {
            name: updateUserDto.name,
            email: updateUserDto.email,
            cpfCnpj: updateUserDto.document,
            mobilePhone: updateUserDto.mobilePhone,
            address: updateUserDto.address,
            addressNumber: updateUserDto.addressNumber,
            complement: updateUserDto.complement,
            province: updateUserDto.province,
            postalCode: updateUserDto.postalCode,
          },
          { headers: this.getAsaasHeaders() },
        ),
      );

      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      return { asaasUpdate: asaasUpdate.data, user };
    } catch (error) {
      console.error(
        'Erro ao atualizar usuário:',
        error?.response?.data || error,
      );
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }

  async remove(id: string) {
    try {
      const asaasDelete = await firstValueFrom(
        this.http.delete(`${this.config.get('ASAAS_URL')}/customers/${id}`, {
          headers: this.getAsaasHeaders(),
        }),
      );

      const user = await this.prisma.user.delete({
        where: { id },
      });

      return { asaasDelete: asaasDelete.data, user };
    } catch (error) {
      console.error('Erro ao deletar usuário:', error?.response?.data || error);
      throw new InternalServerErrorException('Erro ao deletar usuário.');
    }
  }

  async restore(id: string) {
    try {
      const restoreResponse = await firstValueFrom(
        this.http.post(
          `${this.config.get('ASAAS_URL')}/customers/${id}/restore`,
          {},
          { headers: this.getAsaasHeaders() },
        ),
      );

      return restoreResponse.data;
    } catch (error) {
      console.error(
        'Erro ao restaurar usuário:',
        error?.response?.data || error,
      );
      throw new InternalServerErrorException('Erro ao restaurar usuário.');
    }
  }
}
