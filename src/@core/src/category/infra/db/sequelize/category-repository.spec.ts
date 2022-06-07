import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";
import { Category } from '#category/domain';
import { UniqueEntityId, NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "../../../../@seedwork/infra/testing/helpers/db";

describe('CategorySequelizeRepository Unit Tests', () => {
    
    const sequelize = setupSequelize({
        models: [CategoryModel],
    });    
    let repository: CategorySequelizeRepository;

    beforeEach(async () => {
        repository = new CategorySequelizeRepository(CategoryModel);
    });

    it('should insert a new entity', async () => {
        let category = new Category({ name: "Movie" });
        await repository.insert(category);
        let model = await CategoryModel.findByPk(category.id);
        expect(model.toJSON()).toStrictEqual(category.toJSON());

        category = new Category({
            name: "Movie",
            description: "some description",
            is_active: false
        });
        await repository.insert(category);
        model = await CategoryModel.findByPk(category.id);
        expect(model.toJSON()).toStrictEqual(category.toJSON());
    });

    it('should throw error when entity is not found', async () => {
        await expect(repository.findById('fake id')).rejects.toThrow(
            new NotFoundError('Entity not found with ID fake id')
        );

        const uuid = '957334c5-91b9-4986-9b43-0d42f2edfbe9';
        await expect(repository.findById(uuid)).rejects.toThrow(
            new NotFoundError(`Entity not found with ID ${uuid}`)
        );
    });

    it('should find an entity by id', async () => {
        const entity = new Category({ name: "Movie" });
        await repository.insert(entity);

        let entityFound = await repository.findById(entity.id);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

        entityFound = await repository.findById(entity.uniqueEntityId);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });

    it('should return all categories', async () => {
        const entity = new Category({ name: "Movie" });
        await repository.insert(entity);

        const entities = await repository.findAll();
        expect(entities).toHaveLength(1);
        expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    });

    it('should search', async () => {
        await CategoryModel.factory().create();
        //console.log(await CategoryModel.findAll());
    });
});