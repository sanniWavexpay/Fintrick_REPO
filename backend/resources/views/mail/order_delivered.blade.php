<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Delivered Success</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 2px solid #e5e7eb; }
        .header { background: linear-gradient(135deg, #18181b 0%, #27272a 100%); padding: 35px 20px; text-align: center; color: #ffffff; border-bottom: 3px solid #10b981; }
        .header img { max-height: 45px; margin-bottom: 15px; display: inline-block; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #ffffff; }
        .content { padding: 40px 30px; }
        .order-id { font-size: 14px; font-weight: 700; color: #64748b; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; }
        .order-id span { color: #10b981; }
        .success-icon { font-size: 50px; color: #10b981; margin-bottom: 20px; }
        .section-title { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
        .address-box { background-color: #f1f5f9; padding: 20px; border-radius: 15px; margin-bottom: 30px; line-height: 1.6; font-size: 14px; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .btn { display: inline-block; padding: 15px 30px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <img src="{{ url('assets/images/logo/shopLogo.png') }}" alt="{{ config('app.name', 'Fintrick') }}">
            </div>
            <h1>Order Delivered!</h1>
        </div>
        <div class="content" style="text-align: center;">
            <div class="success-icon">📦✨</div>
            <p class="order-id">Order Reference: <span>#{{ $data['order_no'] }}</span></p>
            
            <p style="text-align: left;">Hi {{ $data['user_name'] }},</p>
            <p style="text-align: left;">Great news! Your order has been delivered successfully. We hope you love your new purchase!</p>

            <div class="section-title" style="text-align: left;">Shipping Summary</div>
            <div class="address-box" style="text-align: left;">
                <strong>{{ $data['address_name'] }}</strong><br>
                {{ $data['address_details'] }}
            </div>

            <div style="text-align: center;">
                <p>Enjoyed shopping with us? Leave us a review!</p>
                <a href="{{ config('app.frontend_url', 'https://fintrick.store') }}/profile/orders" class="btn">View Order Details</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.company_name', 'FINTRICK INNOVATIONS') }} ({{ config('app.name', 'Fintrick') }}). All Rights Reserved.</p>
            <p>Support: <a href="mailto:{{ config('app.email', 'tech@fintrickinnovations.com') }}" style="color: #10b981; text-decoration: none;">{{ config('app.email', 'tech@fintrickinnovations.com') }}</a></p>
            <p>Happy Shopping! ❤️</p>
        </div>
    </div>
</body>
</html>
