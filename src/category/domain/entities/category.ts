import {v4 as uuidv4} from "uuid";
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';

export type CategoryProperties = {
    name: string;
    description?: string;
    is_active?: boolean;
    created_at?: Date;
}

// entity has identity, behaviours & attributes
// uuid universal unique identifier v4 - IETF RFC 4122
export class Category {

    public readonly id: UniqueEntityId;

    constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
        this.id = id || new UniqueEntityId();
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
