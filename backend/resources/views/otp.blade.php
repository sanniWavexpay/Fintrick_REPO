<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account - {{ config('app.name', 'Fintrick') }}</title>
    <style>
        body {
            background-color: #FAF7EE;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #1C1917;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #FAF7EE;
            padding: 40px 15px;
        }

        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 520px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(28, 25, 23, 0.08);
            border: 1px solid #E8DFD0;
            overflow: hidden;
        }

        .header {
            background-color: #1C1917;
            padding: 32px 25px;
            text-align: center;
            border-bottom: 3px solid #C26D43;
        }

        .brand-title {
            color: #FAF7EE;
            margin: 0;
            font-size: 24px;
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 900;
        }

        .brand-subtitle {
            color: #C26D43;
            font-size: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 4px;
            font-weight: 700;
        }

        .content {
            padding: 40px 32px;
            text-align: center;
            color: #1C1917;
        }

        .content h2 {
            font-size: 22px;
            margin: 0 0 12px 0;
            color: #1C1917;
            font-weight: 700;
        }

        .content p {
            line-height: 1.6;
            font-size: 14px;
            color: #78716C;
            margin: 0 0 25px 0;
        }

        .otp-box {
            background-color: #FAF7EE;
            margin: 25px auto;
            padding: 22px 20px;
            border-radius: 16px;
            border: 2px dashed #C26D43;
            max-width: 320px;
        }

        .otp-code {
            font-size: 38px;
            font-weight: 900;
            color: #1C1917;
            letter-spacing: 10px;
            display: inline-block;
            font-family: 'Courier New', Courier, monospace;
        }

        .expiry-note {
            font-size: 12px;
            color: #A8A29E;
            margin-top: 10px;
        }

        .footer {
            background-color: #F3EFE6;
            text-align: center;
            padding: 24px 20px;
            font-size: 11px;
            color: #78716C;
            border-top: 1px solid #E8DFD0;
            line-height: 1.6;
        }

        .footer p {
            margin: 4px 0;
        }

        .footer a {
            color: #C26D43;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="main">
            <!-- Header with Fintrick Brand -->
            <div class="header">
                <div class="brand-title">FINTRICK</div>
                <div class="brand-subtitle">CONTEMPORARY APPAREL • STORE</div>
            </div>

            <!-- Content -->
            <div class="content">
                <h2>Verification Code</h2>
                <p>To complete your sign-in to your Fintrick account, please use the secure one-time verification passcode below.</p>

                <div class="otp-box">
                    <span class="otp-code">{{ $data['otp'] }}</span>
                </div>

                <div class="expiry-note">
                    ⏱️ This code is valid for <strong>5 minutes</strong>.
                </div>

                <p style="font-size: 12px; color: #A8A29E; margin-top: 25px;">
                    If you didn't request this verification code, you can safely ignore this email.
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>&copy; {{ date('Y') }} {{ config('app.company_name', 'FINTRICK INNOVATIONS') }}. All rights reserved.</p>
                <p>Support: <a href="mailto:{{ config('app.email', 'tech@fintrickinnovations.com') }}">{{ config('app.email', 'tech@fintrickinnovations.com') }}</a></p>
                <p style="font-size: 10px; color: #A8A29E;">Spectrum Business Centre, Mangaluru, Karnataka - 575005</p>
            </div>
        </div>
    </div>
</body>

</html>
