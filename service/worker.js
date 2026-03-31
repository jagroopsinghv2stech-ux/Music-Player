/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(req) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
        },
      });
    }

    const url = new URL(req.url);
    const playlistId = url.searchParams.get('playlist_id') || url.searchParams.get('playlistId');

    if (!playlistId) {
      return new Response(JSON.stringify({ error: 'playlist_id required' }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    try {
      const ytRes = await fetch(
        `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; CloudflareWorker/1.0)',
          },
        },
      );

      if (!ytRes.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch playlist' }), {
          status: ytRes.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
      }

      const xml = await ytRes.text();

      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=300',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }
  },

  

  
};
