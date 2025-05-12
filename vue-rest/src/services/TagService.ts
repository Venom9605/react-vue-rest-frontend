import { BaseEntityService } from './BaseEntityService';


export class TagGetAllService extends BaseEntityService<{ id: string, name: string }> {
  constructor() {
    super("Tag/GetAll");
  }
}