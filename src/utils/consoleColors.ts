export function color(string: string, code: string): string {
    return `${code}${string}${colorCodes.reset}`;
}
export function colorBasic(string: string, color: string): string {
    return `${basic[color]}${string}${colorCodes.reset}`;
}
/**
 * Returns a color code from a SGR parameter.
 * @param code The SGR parameter to use. Explanation: https://en.wikipedia.org/wiki/ANSI_escape_code
 */
export function colorCodeFromSGR(code: number | string): string {
    return `\x1b[${code}m`;
}
export function alternativeFont(code: number): string {
    return colorCodeFromSGR(10 + code);
}
/**
 * Gets a color code that changes the foreground color of console output to a certain RGB value.
 * @param r The red value of the color.
 * @param g The green value of the color.
 * @param b The blue value of the color.
 */
export function foregroundColor(r: number, g: number, b: number): string {
    return colorCodeFromSGR(`38;2;${r};${g};${b}`);
}
/**
 * Gets a color code that changes the background color of console output to a certain RGB value.
 * @param r The red value of the color.
 * @param g The green value of the color.
 * @param b The blue value of the color.
 */
export function backgroundColor(r: number, g: number, b: number): string {
    return colorCodeFromSGR(`48;2;${r};${g};${b}`);
}
/**
 * Gets a color code that changes the underline color of console output to a certain RGB value.
 * @param r The red value of the color.
 * @param g The green value of the color.
 * @param b The blue value of the color.
 */
export function underlineColor(r: number, g: number, b: number): string {
    return colorCodeFromSGR(`58;2;${r};${g};${b}`);
}

export const colorCodes = {
    /** All attributes off */
    reset: colorCodeFromSGR(0),
    /** As with faint, the color change is a PC (SCO / CGA) invention. */
    bold: colorCodeFromSGR(1),
    /** May be implemented as a light font weight like bold. */
    faint: colorCodeFromSGR(2),
    /** Not widely supported. Sometimes treated as inverse or blink. */
    italic: colorCodeFromSGR(3),
    /** Style extensions exist for Kitty, VTE, mintty and iTerm2. */
    underline: colorCodeFromSGR(4),
    /** Sets blinking to less than 150 times per minute. */
    blinkSlow: colorCodeFromSGR(5),
    /** MS-DOS ANSI.SYS, 150+ per minute; not widely supported */
    blinkFast: colorCodeFromSGR(6),
    /** Swap foreground and background colors; inconsistent emulation. */
    invert: colorCodeFromSGR(7),
    /** Not widely supported. */
    conceal: colorCodeFromSGR(8),
    /** Characters legible but marked as if for deletion. Not supported in Terminal.app. */
    strikethrough: colorCodeFromSGR(9),
    /** Use the default font. */
    fontDefault: colorCodeFromSGR(10),
    /** Double-underline per ECMA-48, but instead disables bold intensity on several terminals, including in the Linux kernel's console before version 4.17. */
    underlineDouble: colorCodeFromSGR(21),
    /** Neither bold nor faint; color changes where intensity is implemented as such. */
    intensityReset: colorCodeFromSGR(22),
    italicReset: colorCodeFromSGR(23),
    /** Neither singly nor doubly underlined. */
    underlineReset: colorCodeFromSGR(24),
    /** Turn blinking off. */
    blinkReset: colorCodeFromSGR(25),
    /** ITU T.61 and T.416, not known to be used on terminals */
    proportionalSpacing: colorCodeFromSGR(26),
    invertReset: colorCodeFromSGR(27),
    /** Not concealed. */
    concealReset: colorCodeFromSGR(28),
    strikethroughReset: colorCodeFromSGR(29),
    /** Implementation defined (according to standard). */
    foregroundColorReset: colorCodeFromSGR(39),
    /** Implementation defined (according to standard). */
    backgroundColorReset: colorCodeFromSGR(49),
    /** T.61 and T.416. */
    proportionalSpacingReset: colorCodeFromSGR(50),
    /** Implemented as "emoji variation selector" in mintty. */
    framed: colorCodeFromSGR(51),
    /** Implemented as "emoji variation selector" in mintty. */
    encircled: colorCodeFromSGR(52),
    /** Not supported in Terminal.app. */
    overlined: colorCodeFromSGR(53),
    /** Neither framed or encircled. */
    encircledReset: colorCodeFromSGR(54),
    overlinedReset: colorCodeFromSGR(55),
    underlineColorReset: colorCodeFromSGR(59),
    /** Right side line. Rarely supported. */
    ideogramUnderline: colorCodeFromSGR(60),
    /** Double right side line. Rarely supported. */
    ideogramUnderlineDouble: colorCodeFromSGR(61),
    /** Left side line. Rarely supported. */
    ideogramOverline: colorCodeFromSGR(62),
    /** Double left side line. Rarely supported. */
    ideogramOverlineDouble: colorCodeFromSGR(63),
    ideogramStressMarking: colorCodeFromSGR(64),
    ideogramReset: colorCodeFromSGR(65),
    /** Only implemented in minty. */
    superscript: colorCodeFromSGR(73),
    /** Only implemented in minty. */
    subscript: colorCodeFromSGR(74),
    /** Only implemented in minty. */
    superscriptSubscriptReset: colorCodeFromSGR(75)
};
export const basic: { [key: string]: { fore: string; back: string; under: string } } = {
    red: { fore: foregroundColor(255, 0, 0), back: backgroundColor(255, 0, 0), under: underlineColor(255, 0, 0) },
    blue: { fore: foregroundColor(0, 255, 0), back: backgroundColor(0, 255, 0), under: underlineColor(0, 255, 0) },
    cyan: { fore: foregroundColor(102, 235, 244), back: backgroundColor(102, 235, 244), under: underlineColor(102, 235, 244) },
    white: { fore: foregroundColor(255, 255, 255), back: backgroundColor(255, 255, 255), under: underlineColor(255, 255, 255) },
    black: { fore: foregroundColor(0, 0, 0), back: backgroundColor(0, 0, 0), under: underlineColor(0, 0, 0) },
    green: { fore: foregroundColor(0, 255, 0), back: backgroundColor(0, 255, 0), under: underlineColor(0, 255, 0) },
    yellow: { fore: foregroundColor(255, 255, 0), back: backgroundColor(255, 255, 0), under: underlineColor(255, 255, 0) },
    magenta: { fore: foregroundColor(255, 0, 255), back: backgroundColor(255, 0, 255), under: underlineColor(255, 0, 255) },
    orange: { fore: foregroundColor(255, 165, 0), back: backgroundColor(255, 165, 0), under: underlineColor(255, 165, 0) },
    purple: { fore: foregroundColor(128, 0, 128), back: backgroundColor(128, 0, 128), under: underlineColor(128, 0, 128) },
    brown: { fore: foregroundColor(165, 42, 42), back: backgroundColor(165, 42, 42), under: underlineColor(165, 42, 42) },
    pink: { fore: foregroundColor(255, 192, 203), back: backgroundColor(255, 192, 203), under: underlineColor(255, 192, 203) },
    gray: { fore: foregroundColor(128, 128, 12), back: backgroundColor(128, 128, 12), under: underlineColor(128, 128, 12) }
};
