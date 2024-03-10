module.exports = grammar({
  name: "langium",

  extras: ($) => [/\s+/, $.block_comment, $.line_comment],

  rules: {
    document: ($) =>
      optional($.grammar_statement),

    grammar_statement: ($) =>
      seq(
        "grammar",
        field("name", $.id),
        optional($.with_expression),
        optional($.hidden_expression),
      ),
    with_expression: ($) => seq("with", seq($.id, repeat(seq(",", $.id)))),
    hidden_expression: ($) =>
      seq("hidden", "(", optional(seq($.id, repeat(seq(",", $.id)))), ")"),

    id: () => /\^?[_a-zA-Z][\w_]*/,

    block_comment: () => /\/\*([^*]|\*[^/])*\*?\*\//,
    line_comment: () => /\/\/[^\n\r]*/,
  },
});
