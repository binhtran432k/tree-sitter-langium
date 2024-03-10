module.exports = grammar({
  name: "langium",

  extras: ($) => [/\s+/, $.block_comment, $.line_comment],

  rules: {
    document: ($) =>
      seq(optional($.grammar_statement), repeat($.import_statement)),

    grammar_statement: ($) =>
      seq(
        "grammar",
        field("name", $.id),
        optional($.with_expression),
        optional($.hidden_expression),
      ),
    with_expression: ($) => seq("with", $._ids),
    hidden_expression: ($) => seq("hidden", "(", optional($._ids), ")"),

    import_statement: ($) =>
      seq("import", field("path", $.string), optional(";")),

    id: () => /\^?[_a-zA-Z][\w_]*/,
    string: () => /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/,

    block_comment: () => /\/\*([^*]|\*[^/])*\*?\*\//,
    line_comment: () => /\/\/[^\n\r]*/,

    _ids: ($) => seq($.id, repeat(seq(",", $.id))),
  },
});
