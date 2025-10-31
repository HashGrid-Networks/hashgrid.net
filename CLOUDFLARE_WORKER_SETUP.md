# Cloudflare Worker Setup for NIP-05

This guide explains how to deploy the Cloudflare Worker to properly serve the NIP-05 Nostr identifier verification endpoint.

## Why This Worker is Needed

NIP-05 requires that `/.well-known/nostr.json` must be served with:
- `Access-Control-Allow-Origin: *` header (CORS)
- `Content-Type: application/json` header
- NO HTTP redirects
- Optional `?name=<username>` query parameter support

GitHub Pages and many static hosts don't provide fine-grained control over headers, which is why we use a Cloudflare Worker.

## Prerequisites

1. A Cloudflare account
2. Your domain (hashgrid.net) must be using Cloudflare DNS
3. Node.js installed (for Wrangler CLI)

## Installation

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate.

### 3. Configure Your Worker

Edit `wrangler.toml` and update the route configuration:

```toml
routes = [
  { pattern = "hashgrid.net/*", zone_name = "hashgrid.net" }
]
```

Or get your zone_id from Cloudflare dashboard and use:

```toml
routes = [
  { pattern = "hashgrid.net/*", zone_id = "your-zone-id-here" }
]
```

### 4. Deploy the Worker

For production:
```bash
wrangler deploy
```

For development/testing:
```bash
wrangler deploy --env development
```

## Testing Your Deployment

### Test the NIP-05 Endpoint

```bash
# Test full response
curl -H "Origin: https://example.com" \
  https://hashgrid.net/.well-known/nostr.json

# Test with name query parameter (per NIP-05 spec)
curl -H "Origin: https://example.com" \
  "https://hashgrid.net/.well-known/nostr.json?name=elvis"

# Verify CORS headers
curl -I https://hashgrid.net/.well-known/nostr.json
```

You should see:
- `Access-Control-Allow-Origin: *`
- `Content-Type: application/json`
- HTTP 200 status (no redirects)

### Test in Nostr Clients

1. Open a Nostr client (Damus, Amethyst, Primal, etc.)
2. Go to your profile settings
3. Add NIP-05 identifier: `elvis@hashgrid.net` or `ryno@hashgrid.net`
4. The client should verify and show a checkmark

### Verify with Online Tools

- https://nostr.band/ - Search for your NIP-05 identifier
- https://metadata.nostr.com/ - Check NIP-05 verification status

## Updating Nostr Identifiers

To add or modify Nostr identities, edit the `NOSTR_IDENTIFIERS` object in `worker.js`:

```javascript
const NOSTR_IDENTIFIERS = {
  "names": {
    "username": "hex-pubkey-here",
    "another": "another-hex-pubkey"
  },
  "relays": {
    "hex-pubkey-here": [
      "wss://relay.example.com"
    ]
  }
};
```

Then redeploy:
```bash
wrangler deploy
```

## How the Worker Works

1. **NIP-05 Requests**: When a request comes to `/.well-known/nostr.json`, the worker:
   - Returns the JSON with proper CORS headers
   - Handles optional `?name=` query parameter
   - No redirects (critical for NIP-05 compliance)

2. **All Other Requests**: Proxied to your origin server (GitHub Pages, etc.)
   - Your static site continues to work normally
   - Only `/.well-known/nostr.json` is intercepted

## Troubleshooting

### Worker Not Active
```bash
# Check worker status
wrangler tail

# View recent logs
wrangler tail --format=pretty
```

### CORS Issues
- Verify `Access-Control-Allow-Origin: *` header is present
- Check browser console for CORS errors
- Test with `curl -I` to see response headers

### NIP-05 Not Verifying
1. Ensure no redirects: Test with `curl -L` to see if redirects occur
2. Verify JSON format matches NIP-05 spec exactly
3. Check that public keys are in hex format (not npub)
4. Ensure domain exactly matches (www.hashgrid.net vs hashgrid.net)

### Development Testing

Test locally with Wrangler:
```bash
wrangler dev
```

This starts a local server at http://localhost:8787

## Cost

Cloudflare Workers free tier includes:
- 100,000 requests per day
- No bandwidth charges

This is more than sufficient for NIP-05 verification traffic.

## Security Notes

- The worker only handles GET requests for `/.well-known/nostr.json`
- All other requests are proxied to origin
- No sensitive data is exposed (public keys are meant to be public)
- CORS is intentionally permissive per NIP-05 specification

## References

- [NIP-05 Specification](https://github.com/nostr-protocol/nips/blob/master/05.md)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
