export class tagScanner {
    input;
    start = 0;
    current = 0;
    length;
    elements = [];
    hadError = false;
    constructor(input) {
        this.input = input;
        this.length = input.length;
    }
    isAtEnd() {
        return this.current >= this.length;
    }
    advance() {
        this.current++;
        return this.input.charAt(this.current - 1);
    }
    peek() {
        return this.input[this.current];
    }
    peekNext() {
        return this.input[this.current + 1];
    }
    isNext(char) {
        return this.peekNext() === char;
    }
    parse() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scan();
        }
        if (this.hadError) {
            return null;
        }
        return this.elements;
    }
    scan() {
        let c = this.advance();
        if (["\n", "\r"].includes(c)) {
            return;
        }
        if (c === "<") {
            this.tag();
        }
        else {
            this.keyword();
        }
    }
    tag() {
        while (!["<", ">", "[", "]", "."].includes(this.peek()) && !this.isAtEnd()) {
            this.advance();
        }
        if (this.isAtEnd()) {
            this.error("Unterminated tag.");
            return;
        }
        let tagName;
        let param;
        if (this.peek() === "[") {
            tagName = this.input.slice(this.start + 1, this.current);
            this.advance();
            param = this.tagParam() ?? "";
        }
        else if (this.peek() === ".") {
            tagName = this.input.slice(this.start + 1, this.current);
            this.advance();
            this.tag();
        }
        this.advance();
        const value = this.input.slice(this.start + 1, this.current - 1);
        this.elements.push(value);
        return value;
    }
    error(error) {
        this.hadError = true;
        console.log(`Error while parsing tag: ${error}`);
    }
    keyword() {
        while (this.peek() !== "<" && !this.isAtEnd()) {
            this.advance();
        }
        const value = this.input.slice(this.start, this.current);
        this.elements.push(value);
    }
    tagParam() {
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
