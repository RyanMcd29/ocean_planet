
import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API_KEY);

export class EmailService {
  static async sendRegistrationEmail(email: string, name: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Ocean Planet <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to Ocean Planet! 🌊',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0A4D68 0%, #05668D 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: #0A4D68; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🌊 Welcome to Ocean Planet!</h1>
                </div>
                <div class="content">
                  <h2>Hi ${name},</h2>
                  <p>Thank you for joining Ocean Planet, your gateway to exploring the world's most incredible dive sites!</p>
                  
                  <p>With Ocean Planet, you can:</p>
                  <ul>
                    <li>🗺️ Discover amazing dive sites worldwide</li>
                    <li>📝 Log your dives and track your progress</li>
                    <li>🐠 Identify marine species you encounter</li>
                    <li>📚 Learn about ocean conservation</li>
                    <li>👥 Connect with the diving community</li>
                  </ul>
                  
                  <p>Ready to dive in? Start exploring dive sites and log your first dive!</p>
                  
                  <div style="text-align: center;">
                    <a href="${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:5000'}" class="button">
                      Explore Dive Sites
                    </a>
                  </div>
                  
                  <p>If you have any questions, feel free to reach out to our support team.</p>
                  
                  <p>Happy diving! 🤿</p>
                  <p><strong>The Ocean Planet Team</strong></p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Ocean Planet. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Error sending registration email:', error);
        return { success: false, error };
      }

      console.log('Registration email sent successfully to:', email);
      return { success: true, data };
    } catch (error) {
      console.error('Exception sending registration email:', error);
      return { success: false, error };
    }
  }
}
