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
                You are creating a short, insightful learning bite about the given topic.

                Context:
                The topic belongs to a larger learning series under the category "%s". 
                Each item should help the reader quickly understand or appreciate the concept.

                Requirements:.
                - 2–5 lines (200–500 characters).
                - Explain the topic clearly with a key takeaway.
        		- Use metaphors or simple analogies if natural.
                - Do not ask questions.
                - Plain text only — no links or markdown.
                - Maintain an informative, engaging tone.
                -Include facts or did u know to make the content more learnable and less touristy.

                Input:
                Topic: %s

                Output:
                A final 2–5 line learning bite.
                """.formatted(topic, itemString);
		String reso = client.models.generateContent("gemini-2.5-flash", userPrompt, null).text();
		return reso;
	}

}
