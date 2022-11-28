export class TTextObject {
    value;
    isPlainText;
    constructor(value, isPlainText) {
        this.value = value;
        this.isPlainText = isPlainText;
    }
    toString() {
        return this.value;
    }
    identify() {
        return this.value;
    }
    isTruthy() {
        return this.value.length > 0;
    }
    equals(other) {
        return this.identify() === other.identify();
    }
    matches(matcher) {
        return this.value === matcher;
    }
    display() {
        return this.value;
    }
    stringCanBeType(str) {
        return true;
    }
}
