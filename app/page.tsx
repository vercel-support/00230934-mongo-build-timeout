import { MongoClient } from 'mongodb';
import Image from 'next/image';

async function getData() {
  const uri = process.env.MONGODB_URI as string;

  // The MongoClient is the object that references the connection to our
  // datastore (Atlas, for example)
  const client = new MongoClient(uri);

  // The connect() method does not attempt a connection; instead it instructs
  // the driver to connect using the settings provided when a connection
  // is required.
  await client.connect();

  // Provide the name of the database and collection you want to use.
  // If the database and/or collection do not exist, the driver and Atlas
  // will create them automatically when you first write data.
  const dbName = 'myDatabase';
  const collectionName = 'recipes';

  // Create references to the database and collection in order to run
  // operations on them.
  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  const findQuery = { prepTimeInMinutes: { $lt: 45 } };

  try {
    const cursor = await collection.find(findQuery).sort({ name: 1 });
    await cursor.forEach((recipe) => {
      console.log(
        `${recipe.name} has ${recipe.ingredients.length} ingredients and takes ${recipe.prepTimeInMinutes} minutes to make.`
      );
    });

    return cursor.toArray();
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
  }
}

export default async function Home() {
  const data = await getData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
