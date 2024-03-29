import Entity from "../../entity/entity";
import NotFoundError from "../../errors/not-found.error";
//import UniqueEntityId from "../../value-objects/unique-entity-id.vo";
import { InMemoryRepository } from "../in-memory.repository";

type StubEntityProps = {
    name: string;
    price: number;
}

class StubEntity extends Entity<StubEntityProps>{ }

class StubInMemoryRepository extends InMemoryRepository<StubEntity> { }

describe('InMemoryRepository Unit Tests', () => {

    let repository: StubInMemoryRepository;
    beforeEach(() => (repository = new StubInMemoryRepository));

    it('should insert a new entity', async () => {
        const entity = new StubEntity({ name: "name value", price: 5 });
        await repository.insert(entity);
        expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
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
        const entity = new StubEntity({ name: "name value", price: 5 });
        await repository.insert(entity);

        let entityFound = await repository.findById(entity.id);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
        expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());

        entityFound = await repository.findById(entity.uniqueEntityId);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
        expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
    });

    it('should return all entities', async () => {
        const entity = new StubEntity({ name: "name value", price: 5 });
        await repository.insert(entity);

        const entities = await repository.findAll();
        expect(entities).toStrictEqual([entity]);
    });

    it('should throw errors on update when entity is not found', () => {
        const entity = new StubEntity({ name: "name value", price: 5 });
        expect(repository.update(entity)).rejects.toThrow(
            new NotFoundError(`Entity not found with ID ${entity.id}`)
        );
    });

    it('should update an entity', async () => {
        const entity = new StubEntity({ name: "name value", price: 5 });
        await repository.insert(entity);

        const entityUpdated = new StubEntity(
            { name: "updated", price: 1 },
            entity.uniqueEntityId
        );

        await repository.update(entityUpdated);
        expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
    });

    it('should throw errors on delete when entity is not found', () => {
        const uuid = '957334c5-91b9-4986-9b43-0d42f2edfbe9';
        expect(repository.delete(uuid)).rejects.toThrow(
            new NotFoundError(`Entity not found with ID ${uuid}`)
        );
    });

    it('should delete an entity', async () => {
        const entity = new StubEntity({ name: "name value", price: 5 });

        await repository.insert(entity);
        await repository.delete(entity.id);
        expect(repository.items).toHaveLength(0);

        await repository.insert(entity);
        await repository.delete(entity.uniqueEntityId);
        expect(repository.items).toHaveLength(0);

        await repository.insert(entity);
        expect(repository.items).toHaveLength(1);
    });
});