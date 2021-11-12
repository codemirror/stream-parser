// Counts the column offset in a string, taking tabs into account.
// Used mostly to find indentation.
function countCol(string: string, end: number | null, tabSize: number, startIndex = 0, startValue = 0): number {
  if (end == null) {
    end = string.search(/[^\s\u00a0]/)
    if (end == -1) end = string.length
  }
  let n = startValue
  for (let i = startIndex; i < end; i++) {
    if (string.charCodeAt(i) == 9) n += tabSize - (n % tabSize)
    else n++
  }
  return n
}

/// Encapsulates a single line of input. Given to stream syntax code,
/// which uses it to tokenize the content.
export class StringStream {
  /// The current position on the line.
  pos: number = 0
  /// The start position of the current token.
  start: number = 0
  private lastColumnPos: number = 0
  private lastColumnValue: number = 0

  constructor(
    /// The line.
    public string: string,
    private tabSize: number,
    /// The current indent unit size.
    public indentUnit: number
  ) {}

  /// True if we are at the end of the line.
  eol(): boolean {return this.pos >= this.string.length}

  /// True if we are at the start of the line.
  sol(): boolean {return this.pos == 0}

  /// Get the next code unit after the current position, or undefined
  /// if we're at the end of the line.
  peek() {return this.string.charAt(this.pos) || undefined}

  /// Read the next code unit and advance `this.pos`.
  next(): string | void {
    if (this.pos < this.string.length)
      return this.string.charAt(this.pos++)
  }

  /// Match the next character against the given string, regular
  /// expression, or predicate. Consume and return it if it matches.
  eat(match: string | RegExp | ((ch: string) => boolean)): string | void {
    let ch = this.string.charAt(this.pos)
    let ok
    if (typeof match == "string") ok = ch == match
    else ok = ch && (match instanceof RegExp ? match.test(ch) : match(ch))
    if (ok) {++this.pos; return ch}
  }

  /// Continue matching characters that match the given string,
  /// regular expression, or predicate function. Return true if any
  /// characters were consumed.
  eatWhile(match: string | RegExp | ((ch: string) => boolean)): boolean {
    let start = this.pos
    while (this.eat(match)){}
    return this.pos > start
  }

  /// Consume whitespace ahead of `this.pos`. Return true if any was
  /// found.
  eatSpace() {
    let start = this.pos
    while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos
    return this.pos > start
  }

  /// Move to the end of the line.
  skipToEnd() {this.pos = this.string.length}

  /// Move to directly before the given character, if found on the
  /// current line.
  skipTo(ch: string): boolean | void {
    let found = this.string.indexOf(ch, this.pos)
    if (found > -1) {this.pos = found; return true}
  }

  /// Move back `n` characters.
  backUp(n: number) {this.pos -= n}

  /// Get the column position at `this.pos`.
  column() {
    if (this.lastColumnPos < this.start) {
      this.lastColumnValue = countCol(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue)
      this.lastColumnPos = this.start
    }
    return this.lastColumnValue
  }

  /// Get the indentation column of the current line.
  indentation() {
    return countCol(this.string, null, this.tabSize)
  }

  /// Match the input against the given string or regular expression
  /// (which should start with a `^`). Return true or the regexp match
  /// if it matches.
  ///
  /// Unless `consume` is set to `false`, this will move `this.pos`
  /// past the matched text.
  ///
  /// When matching a string `caseInsensitive` can be set to true to
  /// make the match case-insensitive.
  match(pattern: string | RegExp, consume?: boolean, caseInsensitive?: boolean): boolean | RegExpMatchArray | null {
    if (typeof pattern == "string") {
      let cased = (str: string) => caseInsensitive ? str.toLowerCase() : str
      let substr = this.string.substr(this.pos, pattern.length)
      if (cased(substr) == cased(pattern)) {
        if (consume !== false) this.pos += pattern.length
        return true
      } else return null
    } else {
      let match = this.string.slice(this.pos).match(pattern)
      if (match && match.index! > 0) return null
      if (match && consume !== false) this.pos += match[0].length
      return match
    }
  }

  /// Get the current token.
  current(){return this.string.slice(this.start, this.pos)}
}
