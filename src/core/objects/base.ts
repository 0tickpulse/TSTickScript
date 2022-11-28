export interface TBaseObject {
    toString: () => string;
    /**
     * How this object is identified when converted to a string.
     */
    identify: () => string;
    /**
     * Whether the object is "truthy", used in the truthy tag.
     */
    isTruthy: () => boolean;
    /**
     * Compares two objects and returns whether they should be considered equal.
     * @param other The object to compare to.
     */
    equals: (other: TBaseObject) => boolean;
    /**
     * Whether the object matches a specific pattern.
     * @param matcher The matcher to use.
     */
    matches: (matcher: string) => boolean;
    /**
     * How this object is identified when displayed (i.e. console).
     */
    display: () => string;
    /**
     * Whether a string, when parsed, could result in a valid instance of this object.
     * @param str The string to parse.
     */
    stringCanBeType: (str: string) => boolean;
}

export class TTextObject implements TBaseObject {
    public constructor(public value: string, public isPlainText: boolean) {}
    public toString() {
        return this.value;
    }
    public identify() {
        return this.value;
    }
    public isTruthy() {
        return this.value.length > 0;
    }
    public equals(other: TBaseObject): boolean {
        return this.identify() === other.identify();
    }
    public matches(matcher: string) {
        return this.value === matcher;
    }
    public display() {
        return this.value;
    }
    public stringCanBeType(str: string) {
        return true;
    }
}