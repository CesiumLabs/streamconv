# StreamConv
Based on **[Borewit/readable-web-to-node-stream](https://github.com/Borewit/readable-web-to-node-stream)**.

# Example
## Web streams to node stream

```js
import Converter from "https://deno.land/x/streamconv/mod.ts";

const res = await fetch("https://mysite.com");

if (res.body) {
    const stream = Converter.WebToReadable(res.body); // Readable stream instance
    stream.on("data", chunk => console.log(chunk.toString()));
} else {
    console.log("no stream");
}
```

## Node stream to web stream

```js
import Converter from "https://deno.land/x/streamconv/mod.ts";

const res = await fetch("https://mysite.com");

if (res.body) {
    const stream = Converter.WebToReadable(res.body);
    const webstream = Converter.ReadableToWeb(stream); // web ReadableStream instance
} else {
    console.log("no stream");
}
```