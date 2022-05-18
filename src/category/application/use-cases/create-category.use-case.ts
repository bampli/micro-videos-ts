import { Category } from "../../domain/entities/category";
import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput } from "../dto/category-output.dto";

export default class CreateCategoryUseCase {

    constructor(private categoryRepo: CategoryRepository.Repository) { };

    async execute(input: Input): Promise<Output> {
        const entity = new Category(input);
        await this.categoryRepo.insert(entity);
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at
        };
    }
}

// DTO: data transfer objects

export type Input = {
    name: string;
    description?: string;
    is_active?: boolean;
};

export type Output = CategoryOutput;

// Common DTO created at "../dto/category-output.dto"
// export type Output = {
//     id: string;
//     name: string;
//     description: string | null;
//     is_active: boolean;
//     created_at: Date
// }