import nodemailer from "nodemailer";

const createTransporter = () => nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export const sendOtpEmail = async (email, otp) => {
    await createTransporter().sendMail({
        from: `"Prime Interior" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Your OTP - Prime Interior",
        html: `
            <div style="font-family: Arial; padding: 30px; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Prime Interior</h2>
                <hr/>
                <p style="font-size: 15px;">Hello,</p>
                <p style="font-size: 15px;">Your OTP is:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <h1 style="color: #000; letter-spacing: 10px; font-size: 42px; background: #f5f5f5; padding: 15px; border-radius: 8px;">${otp}</h1>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center;">This OTP is valid for 5 minutes only.</p>
                <p style="color: #999; font-size: 12px; text-align: center;">If you did not request this, please ignore this email.</p>
                <hr/>
                <p style="font-size: 12px; color: #aaa; text-align: center;">© 2025 Prime Interior. All rights reserved.</p>
            </div>
        `,
    });
};

export const sendOrderEmail = async (email, order) => {
    const { shippingAddress: addr, items, summary, paymentMethod, _id } = order;
    const orderId = String(_id).slice(-8).toUpperCase();

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin:0; font-weight:600; color:#111; font-size:14px;">${item.name}</p>
                <p style="margin:4px 0 0; color:#999; font-size:12px;">Qty: ${item.qty} x $${item.price?.toFixed(2)}</p>
            </td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align:right; font-weight:700; color:#111; font-size:14px;">
                $${(item.price * item.qty).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const discountRow = summary.discount > 0 ? `
        <tr>
            <td style="padding: 6px 0; color:#555; font-size:14px;">Discount</td>
            <td style="padding: 6px 0; text-align:right; font-weight:600; font-size:14px; color:#dc2626;">-$${summary.discount?.toFixed(2)}</td>
        </tr>` : '';

    await createTransporter().sendMail({
        from: `"Prime Interior" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Order Confirmed #${orderId} - Prime Interior`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff;">

            <div style="background: #111; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 26px; letter-spacing: 2px;">PRIME INTERIOR</h1>
                <p style="color: #aaa; margin: 8px 0 0; font-size: 13px;">Premium Home & Office Furniture</p>
            </div>

            <div style="background: #f0fdf4; padding: 24px; text-align: center; border-bottom: 1px solid #d1fae5;">
                <h2 style="color: #15803d; margin: 0; font-size: 22px;">Order Confirmed!</h2>
                <p style="color: #555; margin: 8px 0 0; font-size: 14px;">Thank you for your purchase. We are preparing your order.</p>
            </div>

            <div style="padding: 24px; background: #fafafa; border-bottom: 1px solid #eee;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr>
                        <td style="padding: 6px 0; width:50%;">
                            <span style="color:#999; font-size:13px;">Order ID</span><br>
                            <strong style="color:#111; font-size:15px;">#${orderId}</strong>
                        </td>
                        <td style="padding: 6px 0; text-align:right;">
                            <span style="color:#999; font-size:13px;">Payment</span><br>
                            <strong style="color:#111; font-size:15px;">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</strong>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0;">
                            <span style="color:#999; font-size:13px;">Estimated Delivery</span><br>
                            <strong style="color:#111; font-size:15px;">5-7 Business Days</strong>
                        </td>
                        <td style="padding: 6px 0; text-align:right;">
                            <span style="color:#999; font-size:13px;">Status</span><br>
                            <span style="background:#fef9c3; color:#854d0e; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700;">Pending</span>
                        </td>
                    </tr>
                </table>
            </div>

            <div style="padding: 24px;">
                <h3 style="color:#111; margin: 0 0 16px; font-size:16px; border-bottom:2px solid #111; padding-bottom:8px;">Items Ordered</h3>
                <table style="width:100%; border-collapse:collapse;">
                    ${itemsHtml}
                </table>
            </div>

            <div style="padding: 0 24px 24px;">
                <div style="background:#f9f9f9; border-radius:10px; padding:16px;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr>
                            <td style="padding: 6px 0; color:#555; font-size:14px;">Subtotal</td>
                            <td style="padding: 6px 0; text-align:right; font-weight:600; font-size:14px;">$${summary.subtotal?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color:#555; font-size:14px;">Shipping</td>
                            <td style="padding: 6px 0; text-align:right; font-weight:600; font-size:14px; color:#15803d;">${summary.shippingCost === 0 ? 'FREE' : '$' + summary.shippingCost?.toFixed(2)}</td>
                        </tr>
                        ${discountRow}
                        <tr>
                            <td style="padding: 12px 0 0; border-top:2px solid #e5e5e5; font-size:16px; font-weight:700; color:#111;">Total</td>
                            <td style="padding: 12px 0 0; border-top:2px solid #e5e5e5; text-align:right; font-size:20px; font-weight:800; color:#111;">$${summary.total?.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div style="padding: 0 24px 24px;">
                <h3 style="color:#111; margin: 0 0 12px; font-size:16px; border-bottom:2px solid #111; padding-bottom:8px;">Shipping Address</h3>
                <div style="background:#f9f9f9; border-radius:10px; padding:16px; font-size:14px; color:#555; line-height:1.8;">
                    <strong style="color:#111;">${addr.firstName} ${addr.lastName}</strong><br>
                    ${addr.street}, ${addr.city}, ${addr.state} ${addr.postal}<br>
                    ${addr.country}<br>
                    Phone: ${addr.phone}
                </div>
            </div>

            <div style="background:#111; padding:24px; text-align:center; border-radius:0 0 10px 10px;">
                <p style="color:#fff; margin:0 0 8px; font-size:14px;">Questions? Reply to this email anytime.</p>
                <p style="color:#aaa; margin:0; font-size:12px;">© 2025 Prime Interior. All rights reserved.</p>
            </div>

        </div>
        `,
    });
};

// ✅ Cancel Order Confirmation Email
export const sendCancelEmail = async (email, order) => {
    const { shippingAddress: addr, items, summary, paymentMethod, _id } = order;
    const orderId = String(_id).slice(-8).toUpperCase();

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin:0; font-weight:600; color:#555; font-size:14px;">${item.name}</p>
                <p style="margin:4px 0 0; color:#999; font-size:12px;">Qty: ${item.qty} x $${item.price?.toFixed(2)}</p>
            </td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0; text-align:right; color:#555; font-size:14px;">
                $${(item.price * item.qty).toFixed(2)}
            </td>
        </tr>
    `).join('');

    await createTransporter().sendMail({
        from: `"Prime Interior" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Order Cancelled #${orderId} - Prime Interior`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff;">

            <!-- Header -->
            <div style="background: #111; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 26px; letter-spacing: 2px;">PRIME INTERIOR</h1>
                <p style="color: #aaa; margin: 8px 0 0; font-size: 13px;">Premium Home & Office Furniture</p>
            </div>

            <!-- Cancel Banner -->
            <div style="background: #fef2f2; padding: 24px; text-align: center; border-bottom: 1px solid #fecaca;">
                <div style="font-size: 40px; margin-bottom: 8px;">❌</div>
                <h2 style="color: #dc2626; margin: 0; font-size: 22px;">Order Cancelled</h2>
                <p style="color: #666; margin: 10px 0 0; font-size: 14px;">
                    Your order <strong>#${orderId}</strong> has been successfully cancelled.
                </p>
            </div>

            <!-- Order Info -->
            <div style="padding: 24px; background: #fafafa; border-bottom: 1px solid #eee;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr>
                        <td style="padding: 6px 0; width:50%;">
                            <span style="color:#999; font-size:13px;">Order ID</span><br>
                            <strong style="color:#111; font-size:15px;">#${orderId}</strong>
                        </td>
                        <td style="padding: 6px 0; text-align:right;">
                            <span style="color:#999; font-size:13px;">Payment Method</span><br>
                            <strong style="color:#111; font-size:15px;">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</strong>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0;">
                            <span style="color:#999; font-size:13px;">Order Total</span><br>
                            <strong style="color:#111; font-size:15px;">$${(summary.total || 0).toFixed(2)}</strong>
                        </td>
                        <td style="padding: 6px 0; text-align:right;">
                            <span style="color:#999; font-size:13px;">Status</span><br>
                            <span style="background:#fef2f2; color:#dc2626; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700;">Cancelled</span>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Refund Note (COD te nahi, card te haan) -->
            ${paymentMethod !== 'cod' ? `
            <div style="padding: 16px 24px; background: #eff6ff; border-left: 4px solid #3b82f6; margin: 0;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    💳 <strong>Refund Notice:</strong> If payment was deducted, it will be refunded to your original payment method within 5-7 business days.
                </p>
            </div>
            ` : ''}

            <!-- Cancelled Items -->
            <div style="padding: 24px;">
                <h3 style="color:#111; margin: 0 0 16px; font-size:16px; border-bottom:2px solid #eee; padding-bottom:8px;">Cancelled Items</h3>
                <table style="width:100%; border-collapse:collapse;">
                    ${itemsHtml}
                </table>
            </div>

            <!-- Shop Again CTA -->
            <div style="padding: 0 24px 24px; text-align: center;">
                <p style="color:#555; font-size:14px; margin-bottom:16px;">
                    Changed your mind? Browse our collection and place a new order anytime.
                </p>
               <a href="http://localhost:3001/products"
                   style="display:inline-block; background:#111; color:#fff; padding:12px 32px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:600; letter-spacing:1px;">
                    Shop Again ↗
                </a>
            </div>

            <!-- Footer -->
            <div style="background:#111; padding:24px; text-align:center; border-radius:0 0 10px 10px;">
                <p style="color:#fff; margin:0 0 8px; font-size:14px;">Questions? Reply to this email anytime.</p>
                <p style="color:#aaa; margin:0; font-size:12px;">© 2025 Prime Interior. All rights reserved.</p>
            </div>

        </div>
        `,
    });
};

// ✅ Order Status Update Email (used by admin panel status dropdown)
export const sendStatusUpdateEmail = async (email, order, newStatus) => {
    const { _id } = order;
    const orderId = String(_id).slice(-8).toUpperCase();

    const statusMessages = {
        pending:   { title: "Order Pending ⏳",   color: "#b8681c", bg: "#fff0db", msg: "Your order status has been updated to Pending. We'll keep you posted." },
        confirmed: { title: "Order Confirmed ✅", color: "#0369a1", bg: "#e0f2fe", msg: "Good news! Your order has been confirmed and will be processed soon." },
        shipped:   { title: "Order Shipped 🚚",   color: "#7e22ce", bg: "#f5f3ff", msg: "Your order has been shipped and is on its way to you." },
        delivered: { title: "Order Delivered 📦", color: "#15803d", bg: "#e0f2e9", msg: "Your order has been delivered. We hope you love it!" },
        cancelled: { title: "Order Cancelled ❌", color: "#dc2626", bg: "#fef2f2", msg: "Your order has been cancelled. If you have any questions, feel free to reply to this email." },
    };

    const info = statusMessages[newStatus] || statusMessages.pending;

    await createTransporter().sendMail({
        from: `"Prime Interior" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Order Update #${orderId} - Prime Interior`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff;">

            <div style="background: #111; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 26px; letter-spacing: 2px;">PRIME INTERIOR</h1>
                <p style="color: #aaa; margin: 8px 0 0; font-size: 13px;">Premium Home & Office Furniture</p>
            </div>

            <div style="background: ${info.bg}; padding: 24px; text-align: center; border-bottom: 1px solid #eee;">
                <h2 style="color: ${info.color}; margin: 0; font-size: 22px;">${info.title}</h2>
                <p style="color: #555; margin: 8px 0 0; font-size: 14px;">${info.msg}</p>
            </div>

            <div style="padding: 24px; text-align: center;">
                <span style="color:#999; font-size:13px;">Order ID</span><br>
                <strong style="color:#111; font-size:16px;">#${orderId}</strong>
                <br/><br/>
                <span style="background:${info.bg}; color:${info.color}; padding:5px 16px; border-radius:20px; font-size:13px; font-weight:700; text-transform:capitalize;">
                    ${newStatus}
                </span>
            </div>

            <div style="background:#111; padding:24px; text-align:center; border-radius:0 0 10px 10px;">
                <p style="color:#fff; margin:0 0 8px; font-size:14px;">Questions? Reply to this email anytime.</p>
                <p style="color:#aaa; margin:0; font-size:12px;">© 2025 Prime Interior. All rights reserved.</p>
            </div>

        </div>
        `,
    });
};