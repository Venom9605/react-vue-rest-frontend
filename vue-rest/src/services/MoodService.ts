import { BaseEntityService } from './BaseEntityService';


export class MoodGetAllService extends BaseEntityService<{ id: string, name: string }> {
  constructor() {
    super("Mood/GetAll");
  }
}