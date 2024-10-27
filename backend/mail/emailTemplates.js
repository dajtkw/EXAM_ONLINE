export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Cảm ơn bạn đã đăng ký! Mã xác của của bạn là:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Vui lòng nhập mã xác thực vào trang xác thực.</p>
    <p>Mã xác thực sẽ hết hạn trong 15 phút.</p>
    <p>Nếu bạn không có đăng ký trang web của chúng tôi, xin vui lòng bỏ qua he.</p>
    <p>Xin cảm ơn,<br>From DDH Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động xin vui lòng không trả lời lại email này.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password thành công</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Reset Password thành công</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Chúng tôi muốn xác nhận rằng mật khẩu của bạn đã được reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Nếu mà bạn không phải là người chủ động reset, xin hãy báo lại team chúng tôi.</p>
    <p>Vì vấn đề bảo mật, chúng tôi đề nghị:</p>
    <ul>
      <li>Sử dụng mật khẩu mạnh, độc nhất thiên hạ</li>
      <li>Bật tính năng xác thực 2FA (đang phát triển)</li>
      <li>Tránh sử dụng mật khẩu này ở nhiều ứng dụng / trang web khác</li>
    </ul>
    <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.</p>
    <p>Xin cảm ơn,<br>From DDH Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động xin vui lòng không trả lời lại email này.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yêu cầu reset password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Chúng tôi đã nhận được yêu cầu reset mật khẩu. Nếu không phải bạn, xin vui lòng bỏ qua.</p>
    <p>Để reset mật khẩu, hãy chọn vào nút bên dưới:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>Đường dẫn sẽ hết hạn trong 1 giờ vì lý do bảo mật.</p>
    <p>Xin cảm ơn,<br>From DDH Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động xin vui lòng không trả lời lại email này.</p>
  </div>
</body>
</html>
`;

export const SEND_WELCOME_TEMPLATE =
`
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chào Mừng Bạn Đến Với Chúng Tôi</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Chào Mừng Bạn Đến Với Chúng Tôi!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào,</p>
    <p>Cảm ơn bạn đã tham gia cộng đồng của chúng tôi! Chúng tôi rất vui mừng khi bạn đã đăng ký tài khoản.</p>
    <p>Bây giờ bạn có thể bắt đầu khám phá các tính năng và dịch vụ mà chúng tôi cung cấp. Chúng tôi đang nỗ lực để cung cấp cho bạn trải nghiệm tốt nhất.</p>
    <p>Nếu có bất kỳ câu hỏi nào hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.</p>
    <p>Xin cảm ơn,<br>Đội ngũ DDH</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động xin vui lòng không trả lời lại email này.</p>
  </div>
</body>
</html>
`