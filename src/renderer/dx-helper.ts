globalThis.tw = function tw(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((acc, str, i) => {
    const value = values[i] ?? ""
    return acc + str + value
  }, "")
}
