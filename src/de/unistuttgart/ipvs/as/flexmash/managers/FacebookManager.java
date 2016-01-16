package de.unistuttgart.ipvs.as.flexmash.managers;
import java.io.IOException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import facebook4j.Facebook;
import facebook4j.FacebookException;
import facebook4j.FacebookFactory;
import facebook4j.ResponseList;
import facebook4j.User;
import facebook4j.auth.AccessToken;

public class FacebookManager {

	private String appId = "";
	private String appSecret = "";
	private String accessToken = "CAACEdEose0cBAKVZBIYlZAwXTyfZAZCJksArZBQyT8vgOxZBZB6dRD3bZBzgFNJhNfbZARNJgah2yHfq7WQ2G0hJDNgTEkK79FYr3yzoN2U4ZA3uBItF0mqeMkPalfOjFolygSmTWROIbajpDpJc7K2T0c1I6KxOjYW2f3hTWo3FxcOgq2jphPpR8TgQKiT8k5rtkQsUbkA1bbpIssI6ALvrQ0";

	@SuppressWarnings("unchecked")
	public JSONObject performQuery(String inQuery) {
		Facebook facebook = new FacebookFactory().getInstance();
		facebook.setOAuthAppId("", "");
		facebook.setOAuthAccessToken(new AccessToken(accessToken, null));
		JSONObject result = new JSONObject();
		JSONArray users1 = new JSONArray();
		try {
			ResponseList<User> users = facebook.searchUsers(inQuery);
			if (users != null && users.size() > 0) {
				for (User user: users) {
					JSONObject user1 = new JSONObject();
					User extUser = facebook.getUser(user.getId());
					user1.put("id", extUser.getId());
					user1.put("firstName", extUser.getFirstName());
					user1.put("lastName", extUser.getLastName());
					user1.put("midleName", extUser.getMiddleName());
					user1.put("gender", extUser.getGender());
					user1.put("bio", extUser.getBio());
					users1.add(user1);
				}
			}
		} catch (FacebookException e) {
			e.printStackTrace();
		}
		result.put("users", users1);
		return result;
	}
}
