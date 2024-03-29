//import { v4 as uuidv4 } from "uuid";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import Entity from "../../../@seedwork/domain/entity/entity";
//import ValidatorRules from '../../../@seedwork/domain/validators/validator-rules';
import { Omit } from "lodash";
import CategoryValidatorFactory from "../validators/category.validator";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import { CategoryFakeBuilder } from "./category-fake-builder";

export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

// entity has identity, behaviors & attributes
// uuid universal unique identifier v4 - IETF RFC 4122
export class Category extends Entity<CategoryProperties> {
  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    super(props, id);
    Category.validate(props);
    this.description = this.props.description;
    this.is_active = this.props.is_active ?? true;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  update(name: string, description: string) {
    Category.validate({
      name,
      description,
    });
    this.name = name;
    this.description = description;
  }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  // static validate(props: Omit<CategoryProperties, 'created_at'>){
  //     ValidatorRules.values(props.name, "name").required().string().maxLength(255);
  //     ValidatorRules.values(props.description, "description").string();
  //     ValidatorRules.values(props.is_active, "is_active").boolean();
  // }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
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

  static fake() {
    return CategoryFakeBuilder;
  }
}

// const category = new Category({name: 'test'});
// const obj = category.toJSON();

// Category.fake().aCategory();
