package de.unistuttgart.ipvs.as.flexmash.servlet.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import de.unistuttgart.ipvs.as.flexmash.managers.FacebookManager;
import de.unistuttgart.ipvs.as.flexmash.managers.GoogleManager;

@WebServlet("/DataMock")
/**
 * Servlet to communicate with the client
 */
public class MockDataServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * receives a POST request from the client side
	 */
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		String inQuery = req.getParameter("inQuery");
		String inQuery1 = req.getParameter("inQuery1");

		FacebookManager fm = new FacebookManager();
		GoogleManager gm = new GoogleManager();
		JSONObject fmObject = fm.performQuery(inQuery);
		JSONArray fmData = new JSONArray();
		JSONObject gmObject = gm.performQuery(inQuery1);
		JSONArray gmData = new JSONArray();
		JSONArray result = new JSONArray();
		try {
			if (fmObject.has("users") && fmObject.getJSONArray("users") != null) {
				fmData  = fmObject.getJSONArray("users");
			}
			if (gmObject.has("users") && gmObject.getJSONArray("users") != null) {
				gmData = gmObject.getJSONArray("users");
			}
			result = merge(fmData, gmData);
			
			result = filter(result);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		PrintWriter out = resp.getWriter();
		out.println(result.toString());
	}

	private JSONArray merge(JSONArray arr1, JSONArray arr2)
	        throws JSONException {
	    JSONArray result = new JSONArray();
	    JSONObject temp = new JSONObject();
	    for (int i = 0; i < arr1.length(); i++) {
			JSONObject item = arr1.getJSONObject(i);
			String firstName = item.getString("firstName");
			String lastName = item.getString("lastName");
			String midleName = item.getString("midleName");
			String name = firstName + lastName + midleName;
			temp.put(name, item);
	    }
	    for (int i = 0; i < arr2.length(); i++) {
			JSONObject item = arr2.getJSONObject(i);
			String firstName = item.getString("firstName");
			String lastName = item.getString("lastName");
			String midleName = item.getString("midleName");
			String name = firstName + lastName + midleName;
			temp.put(name, item);
	    }
	    Iterator <String>it = temp.keys();
	    while(it.hasNext()) {
	    	result.put(temp.get(it.next()));
	    }
	    return result;
	}

	private JSONArray filter(JSONArray arr) throws JSONException {
		JSONArray result = new JSONArray();
		for (int i = 0; i < arr.length(); i++) {
			JSONObject item = arr.getJSONObject(i);
			String gender = item.has("gender") ? item.getString("gender") : null;
			if (gender == null || gender.equals("person")) {
				result.put(item);
			}
		}
		return result;
	}
}