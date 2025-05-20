import { ITag } from "@/types/domain/ITag";
import { EntityService } from "./EntityService";

export class TagGetAllService extends EntityService<ITag> {
	constructor() {
		super("tag/getAll");
	}
}

export class TagGetService extends EntityService<ITag> {
	constructor() {
		super("tag/get");
	}
}

export class TagCreateService extends EntityService<ITag> {
	constructor() {
		super("tag/create");
	}
}

export class TagUpdateService extends EntityService<ITag> {
	constructor() {
		super("tag/update");
	}
}

export class TagDeleteService extends EntityService<ITag> {
	constructor() {
		super("tag/delete");
	}
}
