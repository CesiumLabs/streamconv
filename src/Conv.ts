/*
based on https://github.com/Borewit/readable-web-to-node-stream

License:
(The MIT License)

Copyright (c) 2019 Borewit

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { Readable } from "https://deno.land/std@0.88.0/node/stream.ts";

export class StreamConv extends Readable {

    public bytesRead: number = 0;
    public released = false;
    private reader: ReadableStreamReader;
    private pendingRead!: Promise<any>;

    constructor(stream: ReadableStream) {
        super();
        this.reader = stream.getReader();
    }

    public async _read() {
        if (this.released) {
            this.push(null);
            return;
        }
        this.pendingRead = this.reader.read();
        const data = await this.pendingRead;
        // @ts-ignore
        delete this.pendingRead;
        if (data.done || this.released) {
            this.push(null);
        } else {
            this.bytesRead += data.value.length;
            this.push(data.value);
        }
    }

    public async waitForReadToComplete() {
        if (this.pendingRead) {
            await this.pendingRead;
        }
    }

    public async close(): Promise<void> {
        await this.syncAndRelease();
    }

    private async syncAndRelease() {
        this.released = true;
        await this.waitForReadToComplete();
        await this.reader.releaseLock();
    }
}

export default StreamConv;