package com.nutrilife.service;

import com.nutrilife.dto.WeeklyStatsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendWeeklyReport(String toEmail, String userName,
            WeeklyStatsDto stats, String aiFeedback) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🥗 Your NutriLife Weekly Wellness Report");
            helper.setText(buildEmailHtml(userName, stats, aiFeedback), true);

            mailSender.send(message);
            System.out.println("Weekly report email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }

    private String buildEmailHtml(String userName,
            WeeklyStatsDto stats, String aiFeedback) {
        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #4CAF50; color: white; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <h1 style="margin: 0;">🥗 NutriLife</h1>
                        <p style="margin: 8px 0 0;">Weekly Wellness Report</p>
                    </div>

                    <p style="font-size: 16px;">Hi <strong>%s</strong>,</p>
                    <p>Here's your personalized weekly wellness summary!</p>

                    <div style="display: grid; background: #f9f9f9; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #4CAF50; margin-top: 0;">📊 This Week's Stats</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 8px 0; color: #666;">🔥 Avg Daily Calories</td>
                                <td style="padding: 8px 0; font-weight: bold; text-align: right;">%.0f kcal</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 8px 0; color: #666;">💪 Avg Daily Protein</td>
                                <td style="padding: 8px 0; font-weight: bold; text-align: right;">%.1f g</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 8px 0; color: #666;">💧 Avg Daily Water</td>
                                <td style="padding: 8px 0; font-weight: bold; text-align: right;">%.0f ml</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 8px 0; color: #666;">🏋️ Total Workouts</td>
                                <td style="padding: 8px 0; font-weight: bold; text-align: right;">%d sessions</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">🎯 Goal Achievement</td>
                                <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #4CAF50;">%d%%</td>
                            </tr>
                        </table>
                    </div>

                    <div style="background: #f0fff0; border-left: 4px solid #4CAF50; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #4CAF50; margin-top: 0;">🤖 Your AI Wellness Coach Says:</h3>
                        <p style="white-space: pre-line; line-height: 1.6;">%s</p>
                    </div>

                    <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #eee;">
                        <p style="color: #888; font-size: 13px;">Keep up the great work! See you next week.</p>
                        <p style="color: #888; font-size: 12px;">NutriLife — Your Personal Wellness Partner</p>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        userName,
                        stats.getAvgDailyCalories(),
                        stats.getAvgDailyProtein(),
                        stats.getAvgDailyWaterMl(),
                        stats.getTotalWorkouts(),
                        (int) ((stats.getDaysCalorieGoalMet() + stats.getDaysProteinGoalMet()
                                + stats.getDaysHydrationGoalMet()) / 3.0 * 100 / 7),
                        aiFeedback);
    }
}