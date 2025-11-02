import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../entity/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        // eslint-disable-next-line prettier/prettier
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}
}
