import request from 'supertest';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CreateCategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { getConnectionToken } from '@nestjs/sequelize';
import { startApp } from '../../src/@share/testing/helpers';

describe('CategoriesController (e2e)', () => {
  describe('/categories (POST)', () => {
    describe('should have response 422 with invalid request body', () => {
      const app = startApp();
      const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should have response 422 to EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = []; // cancel NestJS validation at DTO
        },
      });
      const validationError =
        CreateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a category', () => {
      const app = startApp();
      const arrange = CreateCategoryFixture.arrangeForSave();
      let categoryRepo: CategoryRepository.Repository;

      // beforeEach(async () => {
      //   categoryRepo = app.app.get<CategoryRepository.Repository>(
      //     CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      //   );
      // });

      beforeEach(async () => {
        // clear db, getting sequelize token first
        const sequelize = app.app.get(getConnectionToken());
        await sequelize.sync({ force: true });

        categoryRepo = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(app.app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);
          const keyInResponse = CreateCategoryFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
          const categoryCreated = await categoryRepo.findById(res.body.data.id);
          const presenter = CategoriesController.categoryToResponse(
            categoryCreated.toJSON(),
          );
          const serialized = instanceToPlain(presenter);
          // presenter: {... created_at: 2022-10-07T14:03:42.208Z }
          // serialized: {... created_at: '2022-10-07T14:03:42.208Z' }
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...send_data,
            ...expected,
          });
        },
      );
    });
  });
});
