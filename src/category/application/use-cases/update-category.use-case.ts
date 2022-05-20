import UseCase from "../../../@seedwork/application/use-case";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";

export default class UpdateCategoryUseCase implements UseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) { };

    async execute(input: Input): Promise<Output> {
        const entity = await this.categoryRepo.findById(input.id);
        entity.update(entity.name, entity.description);

        if(input.is_active === true) {
            entity.activate();
        }
        if(input.is_active === false) {
            entity.deactivate();
        }
        await this.categoryRepo.update(entity);

        return CategoryOutputMapper.toOutput(entity);
    }
}

export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
};

export type Output = CategoryOutput;

// use-cases manage "entities dance"
//  - entity.update(entity.name, entity.description)
//  - this.categoryRepo.update(entity)