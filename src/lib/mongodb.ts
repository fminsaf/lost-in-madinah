import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

type MongooseCache = {
	connection: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
	mongooseCache?: MongooseCache;
};

function getCache(): MongooseCache {
	const existing = globalForMongoose.mongooseCache;
	if (existing) return existing;
	const created: MongooseCache = { connection: null, promise: null };
	globalForMongoose.mongooseCache = created;
	return created;
}

const cache = getCache();

export async function connectToDatabase() {
	if (!uri) {
		throw new Error(
			"Database is unavailable because MONGODB_URI is not configured.",
		);
	}
	if (cache.connection) return cache.connection;
	cache.promise ??= mongoose.connect(uri);
	cache.connection = await cache.promise;
	return cache.connection;
}
