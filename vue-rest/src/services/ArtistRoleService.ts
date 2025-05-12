import { BaseEntityService } from './BaseEntityService';


export class ArtistRoleGetAllService extends BaseEntityService<{ id: string, name: string }> {
  constructor() {
    super("ArtistRole/GetAll");
  }
}