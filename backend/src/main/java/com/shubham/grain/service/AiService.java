package com.shubham.grain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.errors.GenAiIOException;

@Service
public class AiService {

	
	
	@Autowired
	private Client client;
	
	public String getAiContent(String topic, String itemString) {
		
		 String userPrompt = """
				 You are preparing a short learning bite.

				 Topic: %s

				 Source:
				 %s

				 Requirements:
				 - 80–150 letters.
				 - 1-2 lines.
				 - Bold key terms.
				 - No links or apologies.
				 - Plain text only.
				 """.formatted(topic, itemString);
		 String reso=client.models.generateContent("gemini-1.5-flash",userPrompt, null).text();
		 return reso;
		}

}
