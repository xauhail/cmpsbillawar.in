// Cloudflare Pages Serverless Function: /api/enquiries
// Supports Cloudflare D1 database (env.DB) with persistent JSON fallback

export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    if (env.DB) {
      // Query Cloudflare D1
      const { results } = await env.DB.prepare(
        "SELECT * FROM enquiries ORDER BY created_at DESC"
      ).all();
      return new Response(JSON.stringify(results || []), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Fallback if D1 is not bound
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const id = data.id || "lead_" + Date.now();
    const parent_name = data.parent_name || "";
    const child_name = data.child_name || "";
    const phone = data.phone || "";
    const program = data.program || "";
    const message = data.message || "";
    const status = data.status || "new";
    const created_at = data.created_at || new Date().toISOString();

    if (env.DB) {
      await env.DB.prepare(
        `INSERT INTO enquiries (id, parent_name, child_name, phone, program, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(id, parent_name, child_name, phone, program, message, status, created_at)
        .run();
    }

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { id, status } = data;

    if (env.DB && id && status) {
      await env.DB.prepare("UPDATE enquiries SET status = ? WHERE id = ?")
        .bind(status, id)
        .run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (env.DB && id) {
      await env.DB.prepare("DELETE FROM enquiries WHERE id = ?").bind(id).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
