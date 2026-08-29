// Cloudflare Pages Serverless Function: /api/gallery
// Supports Cloudflare D1 database (env.DB)

export async function onRequestGet(context) {
  const { env } = context;

  try {
    if (env.DB) {
      const { results } = await env.DB.prepare(
        "SELECT * FROM gallery ORDER BY created_at DESC"
      ).all();
      return new Response(JSON.stringify(results || []), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

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
    const id = data.id || "photo_" + Date.now();
    const title = data.title || "School Photo";
    const description = data.description || "";
    const category = data.category || "classrooms";
    const tag = data.tag || "Gallery";
    const image_url = data.image_url || "";
    const created_at = data.created_at || new Date().toISOString();

    if (env.DB) {
      await env.DB.prepare(
        `INSERT INTO gallery (id, title, description, category, tag, image_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(id, title, description, category, tag, image_url, created_at)
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

export async function onRequestDelete(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (env.DB && id) {
      await env.DB.prepare("DELETE FROM gallery WHERE id = ?").bind(id).run();
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
