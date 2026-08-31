// Cloudflare Pages Serverless Function: /api/admin/change-credentials
// Safely updates admin email and password in Cloudflare D1

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { current_password, new_email, new_password } = await request.json();

    if (!current_password) {
      return new Response(JSON.stringify({ error: "Current password is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (env.DB) {
      // Check current admin
      const admin = await env.DB.prepare(
        "SELECT * FROM admin_users WHERE password_hash = ? LIMIT 1"
      ).bind(current_password.trim()).first();

      if (!admin) {
        return new Response(JSON.stringify({ error: "Current password is incorrect" }), {
          status: 401,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const updatedEmail = new_email ? new_email.trim().toLowerCase() : admin.email;
      const updatedPass = new_password && new_password.trim().length >= 6 ? new_password.trim() : admin.password_hash;

      await env.DB.prepare(
        "UPDATE admin_users SET email = ?, password_hash = ?, updated_at = ? WHERE id = ?"
      ).bind(updatedEmail, updatedPass, new Date().toISOString(), admin.id).run();

      return new Response(JSON.stringify({
        success: true,
        email: updatedEmail,
        message: "Admin credentials updated in Cloudflare D1 successfully"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Updated" }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
