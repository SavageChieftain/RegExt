class RegExt extends RegExp {
  constructor(pattern, flags) {
    super(pattern, flags);
    this.originalPattern = pattern;
  }

  loopExec(str) {
    if (this.originalPattern === "") {
      return [this.exec(str)];
    }
    const result = [];
    let match;
    while ((match = this.exec(str))) {
      result.push(match);
      if (match[0] === str) {
        break;
      }
    }
    return result.length ? result : null;
  }

  safeTest(str) {
    const lastIndex = this.lastIndex;
    const result = this.test(str);
    this.lastIndex = lastIndex;
    return result;
  }
}

export default RegExt;
