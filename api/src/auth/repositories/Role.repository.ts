import { Repository } from '../../core/decorators/decorators.js'
import BaseRepository from '../../core/orm/repository/Base.repository.js'
import Role from '../entities/Role.entity.js'

@Repository()
export class RoleRepository extends BaseRepository<Role> {

    constructor() {
        super(Role)
    }

    async findManyByUserId(userId: string) {
        return this.raw(`
            SELECT * 
            FROM "Roles" 
            WHERE id IN (SELECT "roleId" FROM "UsersRoles" WHERE "userId" = '${userId}') 
            AND "isActive" = true 
            AND "isDeleted" = false`
        )
    }

}

export default RoleRepository