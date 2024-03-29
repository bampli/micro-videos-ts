import { UseCase as DefaultUseCase } from "@seedwork/application";
import { Category } from "../../domain/entities/category";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";

export namespace CreateCategoryUseCase {

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(private categoryRepo: CategoryRepository.Repository) { };

        async execute(input: Input): Promise<Output> {
            const entity = new Category(input);
            await this.categoryRepo.insert(entity);
            return CategoryOutputMapper.toOutput(entity);
        }
    }

    export type Input = {
        name: string;
        description?: string;
        is_active?: boolean;
    };
    
    export type Output = CategoryOutput;
}

export default CreateCategoryUseCase;


// DTO: data transfer objects

// Common DTO created at "../dto/category-output.dto"
// export type Output = {
//     id: string;
//     name: string;
//     description: string | null;
//     is_active: boolean;
//     created_at: Date
// }