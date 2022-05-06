import {v4 as uuidv4} from "uuid";
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import Entity from '../../../@seedwork/domain/entity/entity';

export type CategoryProperties = {
    name: string;
    description?: string;
    is_active?: boolean;
    created_at?: Date;
}

// entity has identity, behaviours & attributes
// uuid universal unique identifier v4 - IETF RFC 4122
export class Category extends Entity<CategoryProperties>{
    constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
        super(props, id);
        this.description = this.props.description;
        this.is_active = this.props.is_active ?? true;
        this.props.created_at = this.props.created_at ?? new Date();
    };

    get name() {
        return this.props.name;
    }

    get description() {
        return this.props.description;
    }

    private set description(value: string) {
        this.props.description = value ?? null;
    }

    get is_active() {
        return this.props.is_active;
    }

    private set is_active(value: boolean) {
        this.props.is_active = value ?? true;
    }

    get created_at() {
        return this.props.created_at;
    }
}

// const category = new Category({name: 'test'});
// const obj = category.toJSON();
// obj.