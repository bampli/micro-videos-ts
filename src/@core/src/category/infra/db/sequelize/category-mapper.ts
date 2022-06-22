import { Category } from "#category/domain";
import { CategoryModel } from "./category-model";
import {
    UniqueEntityId,
    EntityValidationError,
    LoadEntityError
} from "#seedwork/domain";

export class CategoryModelMapper {
    static toEntity(model: CategoryModel) {
        const { id, ...otherData } = model.toJSON();
        try {
            return new Category(otherData, new UniqueEntityId(id));
        } catch (e) {
            if (e instanceof EntityValidationError) {   // handle DB failure
                throw new LoadEntityError(e.error);
            }
            throw e;
        }
    }
}