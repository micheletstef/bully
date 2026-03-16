# bully

## Shared hosting (no Node) - recommended for your host

This repo now includes a PHP API at `api/outputs.php` plus `.htaccess` routing.
On Apache/PHP hosting, shared outputs work without Node.

Verify after deploy:

```bash
curl -i https://lab.stefmichelet.com/bully/api/outputs
```

Expected: HTTP 200 and JSON.
