import { BaseEntityService } from './BaseEntityService';


export class LinkTypeGetAllService extends BaseEntityService<{ id: string, name: string }> {
  constructor() {
    super("LinkType/GetAll");
  }
}