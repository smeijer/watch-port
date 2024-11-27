# watch-port

Run an arbitrary command when a server reboots.

As most servers temporarily close their socket when rebooting, we can listen to the `connect` and `disconnect` events to decide when a given command needs to rerun.

## Usage

```shell
watch-port -p 3003 -c "node regen-types.js --spec https://example.com/openapi.json"
```
