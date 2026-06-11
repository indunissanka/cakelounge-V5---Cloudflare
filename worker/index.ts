export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET: string;
}

interface OrderItem {
  productName: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryDate: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  status: string;
  date: string;
}

function itemsHtml(items: OrderItem[]): string {
  return items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #f0e8e0">${i.productName}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #f0e8e0">${i.size}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #f0e8e0;text-align:center">${i.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #f0e8e0;text-align:right">Rs. ${(i.price * i.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join('');
}

function storeEmailHtml(order: Order): string {
  return `
  <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fdf9f6;border:1px solid #e8d8cc;border-radius:12px;overflow:hidden">
    <div style="background:#5c3d2e;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:22px">🎂 New Order — The Cake Lounge</h1>
      <p style="color:#e8d0c0;margin:6px 0 0;font-size:13px">Reference: <strong>${order.id}</strong></p>
    </div>
    <div style="padding:28px 32px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px">
        <tr><td style="padding:6px 0;color:#7a5c4a;font-weight:bold;width:140px">Customer</td><td>${order.customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#7a5c4a;font-weight:bold">Email</td><td>${order.customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#7a5c4a;font-weight:bold">Delivery Date</td><td>${order.deliveryDate}</td></tr>
        <tr><td style="padding:6px 0;color:#7a5c4a;font-weight:bold">Address</td><td>${order.address}, ${order.city} ${order.postalCode}</td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px">
        <thead>
          <tr style="background:#f0e8e0">
            <th style="padding:8px 12px;text-align:left;color:#5c3d2e">Item</th>
            <th style="padding:8px 12px;text-align:left;color:#5c3d2e">Size</th>
            <th style="padding:8px 12px;text-align:center;color:#5c3d2e">Qty</th>
            <th style="padding:8px 12px;text-align:right;color:#5c3d2e">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml(order.items)}</tbody>
      </table>
      <div style="text-align:right;font-size:14px;border-top:2px solid #e8d8cc;padding-top:12px">
        <p style="margin:4px 0;color:#7a5c4a">Subtotal: Rs. ${order.subtotal.toLocaleString()}</p>
        <p style="margin:4px 0;color:#7a5c4a">Delivery: Rs. ${order.delivery.toLocaleString()}</p>
        <p style="margin:4px 0;color:#7a5c4a">Tax (9%): Rs. ${order.tax.toLocaleString()}</p>
        <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#5c3d2e">Total: Rs. ${order.total.toLocaleString()}</p>
      </div>
    </div>
  </div>`;
}

function customerEmailHtml(order: Order): string {
  return `
  <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fdf9f6;border:1px solid #e8d8cc;border-radius:12px;overflow:hidden">
    <div style="background:#5c3d2e;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:22px">🎂 Order Confirmed — The Cake Lounge</h1>
      <p style="color:#e8d0c0;margin:6px 0 0;font-size:13px">Your reference: <strong>${order.id}</strong></p>
    </div>
    <div style="padding:28px 32px">
      <p style="font-size:15px;color:#3d2b1e">Dear <strong>${order.customerName}</strong>,</p>
      <p style="font-size:13px;color:#5c3d2e;line-height:1.7">Thank you for your order! Our baking team has received your request and will begin preparation for your delivery on <strong>${order.deliveryDate}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin:20px 0">
        <thead>
          <tr style="background:#f0e8e0">
            <th style="padding:8px 12px;text-align:left;color:#5c3d2e">Item</th>
            <th style="padding:8px 12px;text-align:left;color:#5c3d2e">Size</th>
            <th style="padding:8px 12px;text-align:center;color:#5c3d2e">Qty</th>
            <th style="padding:8px 12px;text-align:right;color:#5c3d2e">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml(order.items)}</tbody>
      </table>
      <div style="text-align:right;font-size:14px;border-top:2px solid #e8d8cc;padding-top:12px">
        <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#5c3d2e">Total: Rs. ${order.total.toLocaleString()}</p>
      </div>
      <p style="font-size:12px;color:#7a5c4a;margin-top:24px">Delivering to: ${order.address}, ${order.city} ${order.postalCode}</p>
      <p style="font-size:12px;color:#9e8070;margin-top:16px">Questions? Reply to this email or contact us at info@cakelounge.lk</p>
    </div>
    <div style="background:#f0e8e0;padding:16px 32px;text-align:center;font-size:11px;color:#7a5c4a">
      The Cake Lounge · Nawala, Sri Lanka · info@cakelounge.lk
    </div>
  </div>`;
}

async function sendEmail(to: string, subject: string, html: string, apiKey: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'The Cake Lounge <admin@cakelounge.lk>',
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error ${res.status}: ${text}`);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // POST /api/orders — save order + send emails
    if (url.pathname === '/api/orders' && request.method === 'POST') {
      let order: Order;
      try {
        order = await request.json() as Order;
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }

      // Save to D1
      await env.DB.prepare(
        `INSERT OR REPLACE INTO orders
          (id, customer_name, customer_email, address, city, postal_code,
           delivery_date, items_json, subtotal, delivery, tax, total, status, date,
           payment_transaction_id, payment_type, payment_email)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          order.id,
          order.customerName,
          order.customerEmail,
          order.address,
          order.city,
          order.postalCode,
          order.deliveryDate,
          JSON.stringify(order.items),
          order.subtotal,
          order.delivery,
          order.tax,
          order.total,
          order.status ?? 'PENDING',
          order.date,
          (order as any).paymentTransactionId ?? null,
          (order as any).paymentType ?? null,
          (order as any).paymentEmail ?? null
        )
        .run();

      // Send emails (non-blocking — don't fail the order if email fails)
      const emailPromises = [
        sendEmail('info@cakelounge.lk', `New Order ${order.id} — The Cake Lounge`, storeEmailHtml(order), env.RESEND_API_KEY),
        sendEmail(order.customerEmail, `Your Order is Confirmed — ${order.id}`, customerEmailHtml(order), env.RESEND_API_KEY),
      ];
      await Promise.allSettled(emailPromises);

      return new Response(JSON.stringify({ success: true, id: order.id }), {
        status: 201,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // GET /api/orders — fetch all orders from D1
    if (url.pathname === '/api/orders' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM orders ORDER BY date DESC'
      ).all();

      const orders = results.map((row) => ({
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        address: row.address,
        city: row.city,
        postalCode: row.postal_code,
        deliveryDate: row.delivery_date,
        items: JSON.parse(row.items_json as string),
        subtotal: row.subtotal,
        delivery: row.delivery,
        tax: row.tax,
        total: row.total,
        status: row.status,
        date: row.date,
        paymentTransactionId: row.payment_transaction_id,
        paymentType: row.payment_type,
        paymentEmail: row.payment_email,
      }));

      return new Response(JSON.stringify(orders), {
        headers: { 'content-type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders },
      });
    }

    // PATCH /api/orders/:id/status — update order status in D1
    if (url.pathname.startsWith('/api/orders/') && url.pathname.endsWith('/status') && request.method === 'PATCH') {
      const parts = url.pathname.split('/');
      const orderId = decodeURIComponent(parts[parts.length - 2]);
      const validStatuses = ['PENDING', 'CONFIRMED', 'BAKING', 'READY', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELLED'];
      let body: { status?: string };
      try {
        body = await request.json() as { status?: string };
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      if (!body.status || !validStatuses.includes(body.status)) {
        return new Response(JSON.stringify({ error: 'Invalid status' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      try {
        await env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(body.status, orderId).run();
      } catch (e: any) {
        return new Response(JSON.stringify({ error: 'DB update failed', detail: e?.message }), {
          status: 500, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }

      // If cancelling, attempt PayPal refund if payment exists
      let refundResult: { refunded: boolean; refundId?: string; error?: string } = { refunded: false };
      if (body.status === 'CANCELLED') {
        const orderRow = await env.DB.prepare('SELECT payment_transaction_id FROM orders WHERE id = ?').bind(orderId).first();
        const captureId = orderRow?.payment_transaction_id as string | null;
        if (captureId) {
          try {
            // Get PayPal access token
            const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
              method: 'POST',
              headers: {
                'Authorization': 'Basic ' + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`),
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: 'grant_type=client_credentials',
            });
            const tokenData = await tokenRes.json() as { access_token?: string };
            if (tokenData.access_token) {
              const refundRes = await fetch(`https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${tokenData.access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
              });
              const refundData = await refundRes.json() as { id?: string; status?: string };
              if (refundRes.ok && refundData.id) {
                refundResult = { refunded: true, refundId: refundData.id };
              } else {
                refundResult = { refunded: false, error: JSON.stringify(refundData) };
              }
            }
          } catch (e: any) {
            refundResult = { refunded: false, error: e?.message };
          }
        }
      }

      return new Response(JSON.stringify({ success: true, status: body.status, ...refundResult }), {
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // GET /api/orders/customer?email= — fetch orders for a specific customer
    if (url.pathname === '/api/orders/customer' && request.method === 'GET') {
      const email = url.searchParams.get('email') || '';
      if (!email) {
        return new Response(JSON.stringify([]), {
          headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      const { results } = await env.DB.prepare(
        'SELECT * FROM orders WHERE LOWER(customer_email) = LOWER(?) ORDER BY date DESC'
      ).bind(email).all();
      const orders = results.map((row) => ({
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        address: row.address,
        city: row.city,
        postalCode: row.postal_code,
        deliveryDate: row.delivery_date,
        items: JSON.parse(row.items_json as string),
        subtotal: row.subtotal,
        delivery: row.delivery,
        tax: row.tax,
        total: row.total,
        status: row.status,
        date: row.date,
        paymentTransactionId: row.payment_transaction_id,
        paymentType: row.payment_type,
        paymentEmail: row.payment_email,
      }));
      return new Response(JSON.stringify(orders), {
        headers: { 'content-type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders },
      });
    }

    // POST /api/auth/register
    if (url.pathname === '/api/auth/register' && request.method === 'POST') {
      const body = await request.json() as any;
      const { name, email, password, phone, address, city, postalCode } = body;
      if (!name || !email || !password) {
        return new Response(JSON.stringify({ error: 'Name, email and password are required.' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      const existing = await env.DB.prepare('SELECT id FROM customers WHERE LOWER(email) = LOWER(?)').bind(email.trim()).first();
      if (existing) {
        return new Response(JSON.stringify({ error: 'An account with this email already exists.' }), {
          status: 409, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      const id = `cust-${Date.now()}`;
      const createdAt = new Date().toISOString();
      await env.DB.prepare(
        'INSERT INTO customers (id, name, email, phone, address, city, postal_code, password, created_at) VALUES (?,?,?,?,?,?,?,?,?)'
      ).bind(id, name.trim(), email.trim().toLowerCase(), phone||'', address||'', city||'', postalCode||'', password, createdAt).run();
      const user = { id, name: name.trim(), email: email.trim().toLowerCase(), phone: phone||'', address: address||'', city: city||'', postalCode: postalCode||'', createdAt };
      return new Response(JSON.stringify({ user }), {
        status: 201, headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // POST /api/auth/login
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json() as any;
      const { email, password } = body;
      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required.' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      const row = await env.DB.prepare('SELECT * FROM customers WHERE LOWER(email) = LOWER(?)').bind(email.trim()).first();
      if (!row) {
        return new Response(JSON.stringify({ error: 'No account found with that email.' }), {
          status: 401, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      if (row.password !== password) {
        return new Response(JSON.stringify({ error: 'Invalid password.' }), {
          status: 401, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      const user = { id: row.id, name: row.name, email: row.email, phone: row.phone, address: row.address, city: row.city, postalCode: row.postal_code, createdAt: row.created_at };
      return new Response(JSON.stringify({ user }), {
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // PUT /api/auth/profile — update customer details
    if (url.pathname === '/api/auth/profile' && request.method === 'PUT') {
      const body = await request.json() as any;
      const { id, name, phone, address, city, postalCode } = body;
      if (!id || !name) {
        return new Response(JSON.stringify({ error: 'ID and name are required.' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      await env.DB.prepare(
        'UPDATE customers SET name=?, phone=?, address=?, city=?, postal_code=? WHERE id=?'
      ).bind(name.trim(), phone||'', address||'', city||'', postalCode||'', id).run();
      const row = await env.DB.prepare('SELECT * FROM customers WHERE id=?').bind(id).first();
      const user = { id: row!.id, name: row!.name, email: row!.email, phone: row!.phone, address: row!.address, city: row!.city, postalCode: row!.postal_code, createdAt: row!.created_at };
      return new Response(JSON.stringify({ user }), {
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // POST /api/admin/login
    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      const body = await request.json() as { username?: string; password?: string };
      const row = await env.DB.prepare('SELECT password FROM admins WHERE username = ?').bind(body.username || '').first();
      if (!row || row.password !== body.password) {
        return new Response(JSON.stringify({ error: 'Invalid credentials.' }), {
          status: 401, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // POST /api/admin/change-password
    if (url.pathname === '/api/admin/change-password' && request.method === 'POST') {
      const body = await request.json() as { username?: string; currentPassword?: string; newPassword?: string };
      const row = await env.DB.prepare('SELECT password FROM admins WHERE username = ?').bind(body.username || '').first();
      if (!row || row.password !== body.currentPassword) {
        return new Response(JSON.stringify({ error: 'Current password is incorrect.' }), {
          status: 401, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }
      await env.DB.prepare('UPDATE admins SET password = ? WHERE username = ?').bind(body.newPassword, body.username).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // POST /api/auth/forgot-password — generate reset token and email link
    if (url.pathname === '/api/auth/forgot-password' && request.method === 'POST') {
      let body: { email?: string };
      try {
        body = await request.json() as { email?: string };
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }

      const email = (body.email || '').trim().toLowerCase();
      if (email) {
        const token = crypto.randomUUID();
        const expiresAt = Date.now() + 3600000; // 1 hour
        await env.DB.prepare(
          'INSERT OR REPLACE INTO password_resets (token, email, expires_at) VALUES (?, ?, ?)'
        ).bind(token, email, expiresAt).run();

        const resetLink = `https://cakelounge-v5.indunissanka.workers.dev/?reset=${token}`;
        await sendEmail(email, 'Reset your Cake Lounge password', `
          <div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;background:#fdf9f6;border:1px solid #e8d8cc;border-radius:12px;overflow:hidden">
            <div style="background:#5c3d2e;padding:24px 32px">
              <h1 style="color:#fff;margin:0;font-size:20px">🎂 Password Reset Request</h1>
            </div>
            <div style="padding:28px 32px">
              <p style="font-size:14px;color:#3d2b1e">We received a request to reset your password for <strong>${email}</strong>.</p>
              <p style="font-size:13px;color:#5c3d2e">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
              <div style="text-align:center;margin:28px 0">
                <a href="${resetLink}" style="background:#5c3d2e;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:bold">Reset My Password</a>
              </div>
              <p style="font-size:11px;color:#9e8070">If you didn't request this, you can safely ignore this email.</p>
              <p style="font-size:11px;color:#9e8070;word-break:break-all">Or copy this link: ${resetLink}</p>
            </div>
          </div>`,
          env.RESEND_API_KEY
        ).catch(() => {});
      }

      // Always return 200 — don't reveal if email exists
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // POST /api/auth/reset-password — validate token, return email
    if (url.pathname === '/api/auth/reset-password' && request.method === 'POST') {
      let body: { token?: string };
      try {
        body = await request.json() as { token?: string };
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }

      const { token } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: 'Token required' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }

      const row = await env.DB.prepare(
        'SELECT email, expires_at FROM password_resets WHERE token = ?'
      ).bind(token).first();

      if (!row || (row.expires_at as number) < Date.now()) {
        await env.DB.prepare('DELETE FROM password_resets WHERE token = ?').bind(token).run();
        return new Response(JSON.stringify({ error: 'Reset link has expired or is invalid.' }), {
          status: 400, headers: { 'content-type': 'application/json', ...corsHeaders },
        });
      }

      // Update password in D1 and delete token
      await env.DB.prepare('UPDATE customers SET password=? WHERE LOWER(email)=LOWER(?)').bind((body as any).newPassword, row.email as string).run();
      await env.DB.prepare('DELETE FROM password_resets WHERE token = ?').bind(token).run();

      const customer = await env.DB.prepare('SELECT * FROM customers WHERE LOWER(email)=LOWER(?)').bind(row.email as string).first();
      const user = customer ? { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, city: customer.city, postalCode: customer.postal_code, createdAt: customer.created_at } : null;
      return new Response(JSON.stringify({ email: row.email, user }), {
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // Serve static assets (Cloudflare Pages integration)
    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};
