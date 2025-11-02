// src/shared/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  // eslint-disable-next-line prettier/prettier
  private transporter: nodemailer.Transporter;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // hoặc dùng host/port SMTP riêng
      auth: {
        user: process.env.MAIL_USER, // ví dụ: your-email@gmail.com
        pass: process.env.MAIL_PASS, // App Password của Gmail
      },
    });
  }

  async sendActivationEmail(to: string, activationLink: string) {
    try{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.transporter.sendMail({
      from: `"MyMovie" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Kích hoạt tài khoản',
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Chào mừng bạn đến với MyMovie 🎬</h2>
          <p>Nhấn vào nút bên dưới để kích hoạt tài khoản:</p>
          <p>
            <a href="${activationLink}"
               style="display:inline-block;padding:10px 16px;background:#1976d2;color:#fff;text-decoration:none;border-radius:6px">
               KÍCH HOẠT TÀI KHOẢN
            </a>
          </p>
          <p>Nếu nút không hoạt động, sao chép link sau vào trình duyệt:</p>
          <p>${activationLink}</p>
          <hr/>
          <small>Liên kết sẽ hết hạn sau 24 giờ.</small>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
 async sendNewPassword(to: string, newPassword: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.transporter.sendMail({
        from: `"MyMovie" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Mật khẩu mới của bạn',
        html: `
          <div style="font-family:Arial,sans-serif">
            <h2>Xin chào 🎬</h2>
            <p>Chúng tôi đã tạo mật khẩu mới cho tài khoản của bạn:</p>
            <p style="font-size:18px;font-weight:bold;color:#d32f2f">${newPassword}</p>
            <p>Vui lòng đăng nhập bằng mật khẩu trên, sau đó đổi lại mật khẩu trong phần cài đặt tài khoản để bảo mật tốt hơn.</p>
            <hr/>
            <small>Đừng quên đổi mật khẩu ngay sau khi đăng nhập.</small>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending new password email:', error);
    }
  }


}
