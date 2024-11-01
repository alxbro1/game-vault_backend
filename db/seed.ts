import { faker } from '@faker-js/faker';

import { db } from '../src/config/db';
import {
  products,
  categories,
  users,
  type CreateUserDto,
} from './schemas/schema';

import {
  IgamesObjects,
  gamesArray,
  categoriesArray,
  IgamesObjectsForDb,
} from './gamesArray.objects';

const main = async () => {
  const usersData: CreateUserDto[] = [];

  for (let i = 0; i < 15; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      profileImage: faker.image.avatar(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });
  }

  await db.insert(users).values(usersData);
};

const elMain = async () => {
  const resultCategories = await db
    .insert(categories)
    .values(categoriesArray)
    .returning();

  const gamesObjects = gamesArray.map((object: IgamesObjects) => {
    return {
      name: object.name,
      price: object.price,
      description: object.description,
      type: object.type || 'digital',
      stock: object.stock,
      categoryId: resultCategories.find(
        (categorie) => categorie.name == object.category.toLowerCase(),
      )?.id,
      imageUrl: object.imageUrl,
    };
  }) as IgamesObjectsForDb[];

  await db.insert(products).values(gamesObjects);
};

main();
elMain();
