module.exports = grammar({
  name: "langium",

  extras: ($) => [/\s+/],

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
  },
});
