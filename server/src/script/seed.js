import { faker } from "@faker-js/faker";
import sequelize, { User, Event, Genre, EventGenre, Attendy } from "./models";

async function createUsers() {
  const users = [];
  for (let i = 0; i < 1000; i++) {
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }
  await User.bulkCreate(users);
}

async function createEvents() {
  const events = [];
  for (let i = 0; i < 3000; i++) {
    events.push({
      title: faker.lorem.words(),
      details: faker.lorem.paragraph(),
      thumbnailUrl: faker.image.imageUrl(),
      location: faker.address.city(),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      userId: faker.datatype.number({ min: 1, max: 1000 }),
    });
  }
  await Event.bulkCreate(events);
}

async function createGenres() {
  const genres = [];
  for (let i = 0; i < 10; i++) {
    genres.push({ name: faker.music.genre() });
  }
  await Genre.bulkCreate(genres);
}

async function createEventGenres() {
  const eventGenres = [];
  for (let i = 0; i < 5000; i++) {
    eventGenres.push({
      eventId: faker.datatype.number({ min: 1, max: 3000 }),
      genreId: faker.datatype.number({ min: 1, max: 10 }),
    });
  }
  await EventGenre.bulkCreate(eventGenres);
}

async function createAttendies() {
  const attendies = [];
  for (let i = 0; i < 5000; i++) {
    attendies.push({
      status: faker.datatype.number({ min: 1, max: 3 }),
      eventId: faker.datatype.number({ min: 1, max: 3000 }),
      userId: faker.datatype.number({ min: 1, max: 1000 }),
    });
  }
  await Attendy.bulkCreate(attendies);
}

async function seedDatabase() {
  try {
    await sequelize.sync(); // Reset tables
    //await createUsers();
    await createGenres();
    await createEvents();
    //await createEventGenres();
    //await createAttendies();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await sequelize.close();
  }
}

//seedDatabase();
