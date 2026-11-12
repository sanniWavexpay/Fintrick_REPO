<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 2px solid #e5e7eb; }
        .header { background: linear-gradient(135deg, #18181b 0%, #27272a 100%); padding: 35px 20px; text-align: center; color: #ffffff; border-bottom: 3px solid #c59b27; }
        .header img { max-height: 45px; margin-bottom: 15px; display: inline-block; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #ffffff; }
        .content { padding: 40px 30px; }
        .order-id { font-size: 14px; font-weight: 700; color: #64748b; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; }
        .order-id span { color: #c59b27; }
        .section-title { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
        .address-box { background-color: #f1f5f9; padding: 20px; border-radius: 15px; margin-bottom: 30px; line-height: 1.6; font-size: 14px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px; }
        .summary-total { border-top: 2px solid #f1f5f9; padding-top: 20px; font-size: 18px; font-weight: 800; color: #1e293b; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .btn { display: inline-block; padding: 15px 30px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; border: 1px solid #c59b27; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <img src="{{ url('assets/images/logo/shopLogo.png') }}" alt="{{ config('app.name', 'Fintrick') }}">
            </div>
            <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
            <p class="order-id">Order Reference: <span>#{{ $data['order_no'] }}</span></p>
            
            <p>Hi {{ $data['user_name'] }},</p>
            <p>Thank you for shopping with us! Your order has been placed and is being processed for delivery.</p>

            <div class="section-title">Shipping Address</div>
            <div class="address-box">
                <strong>{{ $data['address_name'] }}</strong><br>
                {{ $data['address_details'] }}
            </div>

            <div class="section-title">Order Summary</div>
            <div class="summary-row">
                <span>Payment Mode:</span>
                <strong>{{ $data['payment_mode'] }}</strong>
            </div>
            <div class="summary-row summary-total">
                <span>Total Amount:</span>
                <span>₹{{ $data['grand_total'] }}</span>
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url', 'https://fintrick.store') }}/shop" class="btn">Shop More</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.company_name', 'FINTRICK INNOVATIONS') }} ({{ config('app.name', 'Fintrick') }}). All Rights Reserved.</p>
            <p>Support: <a href="mailto:{{ config('app.email', 'tech@fintrickinnovations.com') }}" style="color: #c59b27; text-decoration: none;">{{ config('app.email', 'tech@fintrickinnovations.com') }}</a></p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
