import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { editUser } from '../src/user/dto/edit-user';
import { createBookmarkDto, editBookmarkDto } from '../src/bookmark/dto/bookmark-dto';

describe('e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );

    await app.init();
    await app.listen(3002);

    prisma = app.get(PrismaService);
    await prisma.cleanDB(); // Ensure you have this method to clean the test DB
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('SignUp', () => {
      it('should sign up', async () => {
        const dto: AuthDto = {
          email: 'user4@gmail.com',
          password: '123',
        };
        await pactum
          .spec()
          .post('http://localhost:3002/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('SignIn', () => {
      it('should sign in', async () => {
        const dto: AuthDto = {
          email: 'user4@gmail.com',
          password: '123',
        };
        await pactum
          .spec()
          .post('http://localhost:3002/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'accessToken');
      });
    });
  });

  describe('User', () => {
    describe('Get User', () => {
      it('should get user', async () => {
        return await pactum
          .spec()
          .get('http://localhost:3002/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // Corrected spelling here
          })
          .expectStatus(200)
          .inspect();
      });
    });
    describe('Edit user', () => {
      it('should edit user', async () => {
        const dto: editUser = {
          firstName: 'Matthew',
          lastName: 'Arowosegbe',
          email: 'matthew@gmail.com',
        };
        return await pactum
          .spec()
          .patch('http://localhost:3002/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // Corrected spelling here
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .inspect();
      });
    });
  });

  describe('Bookmark', () => {
    describe('get epmty bookmarks', () => {
      it('should return empty bookmarks', async () => {
        return await pactum
          .spec()
          .get('http://localhost:3002/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // Corrected spelling here
          })
          .expectStatus(200)
          .expectBody([])
          .inspect();
      });
    });

    describe('Create Bookmark', () => {
      const dto: createBookmarkDto = {
        link: 'https://matthew-portfolio-vert.vercel.app/',
        title: 'my portfolio',
      };
      it('should create a bookmark', async () => {
        return await pactum
          .spec()
          .post('http://localhost:3002/bookmarks')

          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // Corrected spelling here
          })
          .withBody(dto)
          .expectStatus(201)
          .inspect()
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get Bookmarks', () => {
      it('should return bookmark by id', async () => {
        return await pactum
          .spec()
          .get('http://localhost:3002/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // Corrected spelling here
          })
          .expectStatus(200)
          .inspect();
      });
    });
    describe('Get Bookmark by ID', () => {
      it('should return bookmark by id', async () => {
        return await pactum
          .spec()
          .get('http://localhost:3002/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // Corrected spelling here
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .inspect();
      });
    });
    describe('Edit bookmark by id', () => {
      const dto: editBookmarkDto = {
        link: 'link',
        title: 'Editing title',
        description: 'editing description',
      };
      it('should edit bookmark by id', async () => {
        return await pactum
          .spec()
          .patch('http://localhost:3002/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // Corrected spelling here
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .inspect();
      });
    });
    describe('Delete Bookmark', () => {
      it('should edit bookmark by id', async () => {
        return await pactum
          .spec()
          .delete('http://localhost:3002/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // Corrected spelling here
          })
          .expectStatus(204)
          .inspect();
      });
    });
  });
});
