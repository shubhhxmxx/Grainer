package com.shubham.grain.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shubham.grain.model.DataSetSubscription;
import com.shubham.grain.model.User;
import com.shubham.grain.model.UserDataSet;
import com.shubham.grain.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;

import jakarta.transaction.Transactional;

@Service
public class UserEmailService {
    
    @Autowired
    private org.springframework.mail.javamail.JavaMailSender javaMailSender;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AiService aiservice;
    
    @Transactional
    @Scheduled(cron = "0 7 * * *")
    public void sendDailyMail() {
        List<User> activeUsers = userRepository.findAllUsersWithActiveDataSets("Active");
        for (User user : activeUsers) {
            List<String> topicList = new ArrayList<>();
            List<String> contentList = new ArrayList<>();

            for (DataSetSubscription dataSetSubscription : user.getSubscriptions()) {
                if (!"Active".equalsIgnoreCase(dataSetSubscription.getStatus())) continue;

                UserDataSet userDataSet = dataSetSubscription.getUserDataSet();
                topicList.add(userDataSet.getTopic());

                Integer index = dataSetSubscription.getCurrentIndex();
                String itemString = userDataSet.getItems().get(index).getRowData();
                if (Boolean.TRUE.equals(dataSetSubscription.getAiEnabled())) {
                    itemString = aiservice.getAiContent(userDataSet.getTopic(), itemString);
                }
                contentList.add(itemString);

                if (index + 1 >= userDataSet.getItems().size()) {
                    dataSetSubscription.setStatus("Inactive");
                }
                dataSetSubscription.setCurrentIndex(index + 1);
            }

            if (!contentList.isEmpty()) {
                String subject = "DailyLearner — Your topics for " + java.time.LocalDate.now();
                String html = prepareHtmlContent(contentList, topicList);
                sendEmail(user.getEmail(), subject, html);
            }
        }
    }

    private String prepareHtmlContent(List<String> contents, List<String> topics) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><head><meta charset=\"UTF-8\">")
          .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">")
          .append("<style>")
          .append("body{font-family:Arial,Helvetica,sans-serif;color:#1f2937;background:#f6f7fb;margin:0;padding:24px;}")
          .append(".container{max-width:680px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;}")
          .append(".header{background:#111827;color:#fff;padding:16px 20px;font-size:18px;font-weight:600;}")
          .append(".content{padding:20px;}")
          .append(".card{border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:12px;background:#fcfcfd;}")
          .append(".title{font-size:16px;font-weight:600;margin-bottom:8px;color:#111827;}")
          .append(".text{white-space:pre-wrap;line-height:1.55;}")
          .append(".footer{padding:14px 20px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb;background:#fafafa;}")
          .append("</style></head><body>")
          .append("<div class=\"container\">")
          .append("<div class=\"header\">DailyLearner</div>")
          .append("<div class=\"content\"><p>Here are your learning bites for today:</p>");

        for (int i = 0; i < topics.size(); i++) {
            sb.append("<div class=\"card\">")
              .append("<div class=\"title\">")
              .append(escapeHtml(topics.get(i)))
              .append(" of the day</div>")
              .append("<div class=\"text\">")
              .append(escapeHtml(contents.get(i)))
              .append("</div></div>");
        }

        sb.append("</div>")
          .append("<div class=\"footer\">You are receiving this email because you subscribed to topics in Grainer. ")
          .append("Manage subscriptions from your account.</div>")
          .append("</div></body></html>");
        return sb.toString();
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    public void sendEmail(String email, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setFrom("grainerlearn@gmail.com");
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // HTML
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            System.out.println("e:" + e.getMessage());
        }
    }
}