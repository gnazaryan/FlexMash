package de.unistuttgart.ipvs.as.flexmash.datacache;

import java.net.UnknownHostException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;

/**
 * Class to manage the cache that saves intermediate data during mashup execution
 * 
 */
public class DataCache {

	/**
	 * TODO: use config file
	 */
	static final String DBNAME = "mashup";

	/**
	 * receives a value to a corresponding key from the cache
	 * 
	 * @param key
	 *            the database key
	 * @return the corresponding value
	 */
	public static JSONArray getData(String key) {
		try {
			// TODO: use config
			MongoClient mongoClient = new MongoClient("localhost", 27017);
			DB db = mongoClient.getDB("mydb");
			DBCollection coll = db.getCollection(key);

			DBCursor cursor = coll.find();
			DBObject doc = null;

			JSONArray data = new JSONArray();

			while (cursor.hasNext() == true) {
				doc = cursor.next();
				JSONObject jsonO = new JSONObject(doc.toString());
				jsonO.remove("_id");
				data.put(jsonO);
			}

			return data;

		} catch (JSONException | UnknownHostException e) {
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * removes all data from the cache
	 * 
	 * TODO: implement
	 */
	public static void emptyCache() {

	}

	/**
	 * adds data to the cache
	 * 
	 * @param data
	 *            the data to be added
	 * @return the generated key to access the stored data
	 */
	public static String addData(JSONArray data) {
		String key = generateKey();
		try {

			MongoClient mongoClient = new MongoClient("localhost", 27017);
			DB db = mongoClient.getDB("mydb");
			DBCollection coll = db.getCollection(key);

			for (int i = 0; i < data.length(); i++) {
				DBObject doc = (DBObject) JSON.parse(data.getJSONObject(i).toString());
				coll.insert(doc);
			}
			return key;

		} catch (JSONException | UnknownHostException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * removes specific data from the cache
	 * 
	 * @param key
	 *            the key of the data to be removed
	 */
	public static void removeData(String key) {
		MongoClient mongoClient = null;
		try {
			mongoClient = new MongoClient("localhost", 27017);
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		DB db = mongoClient.getDB("mydb");
		DBCollection coll = db.getCollection(key);
		coll.drop();
	}

	/**
	 * helper method to generate a database key
	 * 
	 * TODO: move to utils
	 * 
	 * @return the generated key
	 */
	private static String generateKey() {
		final int STRING_LENGTH = 16;
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < STRING_LENGTH; i++) {
			sb.append((char) ((int) (Math.random() * 26) + 97));
		}
		return sb.toString();
	}
}
