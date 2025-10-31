/**
 * Cloudflare Worker for hashgrid.net
 * Handles NIP-05 Nostr identifier verification with proper CORS headers
 */

// NIP-05 data - update this object when adding/removing Nostr identities
const NOSTR_IDENTIFIERS = {
  "names": {
    "ryno": "736fe2c18b5e064e8c4a9afdb2ec5e71288590e9e775e6f838e87343e8685574",
    "elvis": "04ff5a72481d19bb110f643eee03d77425e1116e95243b6de55c0dd922ba7b2d"
  },
  // Optional: Add relay information for better user discovery
  "relays": {
    "736fe2c18b5e064e8c4a9afdb2ec5e71288590e9e775e6f838e87343e8685574": [
      "wss://relay.primal.net",
      "wss://relay.nostr.band",
      "wss://relay.damus.io",
      "wss://nos.lol",
      "wss://relay.snort.social",
      "wss://relay.0xchat.com",
      "wss://auth.nostr1.com",
      "wss://premium.primal.net",
      "wss://nostr-01.yakihonne.com",
      "wss://nostr-02.yakihonne.com"
    ],
    "04ff5a72481d19bb110f643eee03d77425e1116e95243b6de55c0dd922ba7b2d": [
      "wss://relay.primal.net",
      "wss://relay.nostr.band",
      "wss://relay.damus.io",
      "wss://nos.lol",
      "wss://relay.snort.social",
      "wss://relay.0xchat.com",
      "wss://auth.nostr1.com",
      "wss://premium.primal.net",
      "wss://nostr-01.yakihonne.com",
      "wss://nostr-02.yakihonne.com"
    ]
  }
};

/**
 * Create proper CORS headers for NIP-05 compliance
 */
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300' // Cache for 5 minutes (reduced for testing)
  };
}

/**
 * Handle OPTIONS preflight requests
 */
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}

/**
 * Serve NIP-05 nostr.json with proper formatting
 */
function serveNostrJson(url) {
  // Parse query parameter - NIP-05 spec allows ?name=username queries
  const name = url.searchParams.get('name');

  // If a specific name is requested, we can optionally filter the response
  // However, returning all names is also valid per spec
  let responseData = NOSTR_IDENTIFIERS;

  // Optional: Filter to only requested name if specified
  if (name && NOSTR_IDENTIFIERS.names[name.toLowerCase()]) {
    const pubkey = NOSTR_IDENTIFIERS.names[name.toLowerCase()];
    responseData = {
      names: {
        [name.toLowerCase()]: pubkey
      }
    };

    // Include relay info if available
    if (NOSTR_IDENTIFIERS.relays && NOSTR_IDENTIFIERS.relays[pubkey]) {
      responseData.relays = {
        [pubkey]: NOSTR_IDENTIFIERS.relays[pubkey]
      };
    }
  }

  return new Response(JSON.stringify(responseData, null, 2), {
    status: 200,
    headers: getCorsHeaders()
  });
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle OPTIONS preflight for CORS
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Serve NIP-05 nostr.json - must be exact path, NO REDIRECTS
    if (url.pathname === '/.well-known/nostr.json') {
      return serveNostrJson(url);
    }

    // For all other requests, fetch from origin (GitHub Pages, etc.)
    // This allows the worker to co-exist with your existing static site
    return fetch(request);
  }
};
