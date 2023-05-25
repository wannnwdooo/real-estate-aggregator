import { options } from '../db/data-source';
import { createConnection } from 'typeorm';
import { Apartment } from '../src/modules/apartments/entities/apartment.entity';
import * as testData from './testData.json';
async function loadTestData() {
  const connection = await createConnection({
    ...options(),
    entities: [Apartment],
  });

  const apartmentRepository = connection.getRepository(Apartment);

  for (const data of testData) {
    const apartment = new Apartment();

    // apartment.id = data.id;
    apartment.number = data.number;
    apartment.rooms = data.rooms;
    apartment.area = parseFloat(data.area);
    apartment.pricePerMeter = data.pricePerMeter;
    apartment.floor = data.floor;
    apartment.price = parseFloat(data.prce);
    apartment.createdAt = data.createdAt;
    apartment.updatedAt = data.updatedAt;

    await apartmentRepository.save(apartment);
  }

  await connection.close();
}

loadTestData()
  .then(() => console.log('Test data loaded successfully'))
  .catch((error) => console.error('Failed to load test data:', error));
