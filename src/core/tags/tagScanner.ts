export type tTagObject = { name: string; parameter: string };
export type tTagElement = { type: "text"; value: string } | { type: "tag"; tagObjects: tTagObject[] };
export class tagScanner {
    public start: number = 0;
    public current: number = 0;
    public length: number;
    public elements: string[] = [];
    public hadError: boolean = false;
    public constructor(public input: string) {
        this.length = input.length;
    }
    private isAtEnd() {
        return this.current >= this.length;
    }
    private advance() {
        this.current++;
        return this.input.charAt(this.current - 1);
    }
    private peek() {
        return this.input[this.current];
    }
    private peekNext() {
        return this.input[this.current + 1];
    }
    private isNext(char: string) {
        return this.peekNext() === char;
    }
    public parse() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scan();
        }
        if (this.hadError) {
            return null;
        }
        return this.elements;
    }
    private scan() {
        let c = this.advance();
        if (["\n", "\r"].includes(c)) {
            return;
        }
        if (c === "<") {
            this.tag();
        } else {
            this.keyword();
        }
    }
    private tag() {
        while (!["<", ">", "[", "]", "."].includes(this.peek()) && !this.isAtEnd()) {
            this.advance();
        }
        if (this.isAtEnd()) {
            this.error("Unterminated tag.");
            return;
        }

        let tagName: string;
        let param: string;
        if (this.peek() === "[") {
            tagName = this.input.slice(this.start + 1, this.current);
            this.advance();
            param = this.tagParam() ?? "";
        } else if (this.peek() === ".") {
            tagName = this.input.slice(this.start + 1, this.current);
            this.advance();
            this.tag();
        }

        this.advance();
        const value = this.input.slice(this.start + 1, this.current - 1);
        this.elements.push(value);
        return value;
    }
    private error(error: string) {
        this.hadError = true;
        console.log(`Error while parsing tag: ${error}`);
    }
    private keyword() {
        while (this.peek() !== "<" && !this.isAtEnd()) {
            this.advance();
        }
        const value = this.input.slice(this.start, this.current);
        this.elements.push(value);
    }
    private tagParam() {
        while (this.peek() !== "]" && !this.isAtEnd()) {
            this.advance();
        }
        if (this.isAtEnd()) {
            this.error("Unterminated tag param.");
            return;
        }
        this.advance();
        const value = this.input.slice(this.start + 1, this.current - 1);
        return value;
    }
}
