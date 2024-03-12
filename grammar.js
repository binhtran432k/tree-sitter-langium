const PREC = Object.freeze({
  // Definition
  ALTERNATIVES: 1,
  CONDITIONAL_BRANCH: 2,
  UNORDERED_GROUP: 3,
  GROUP: 4,
  // Condition
  DISJUNCTION: 1,
  CONJUNCTION: 2,
  NEGATION: 3,
  ATOM: 4,
});

module.exports = grammar({
  name: "langium",

  extras: ($) => [/\s+/, $.block_comment, $.line_comment],

  rules: {
    document: ($) =>
      seq(
        optional($.grammar_statement),
        repeat($.import_statement),
        repeat1($._abstract_rule_statement),
      ),

    grammar_statement: ($) =>
      seq(
        "grammar",
        field("name", $.id),
        optional($.with_expression),
        optional($.hidden_expression),
      ),
    with_expression: ($) => seq("with", $._ids),
    hidden_expression: ($) => seq("hidden", "(", optional($._ids), ")"),

    _abstract_rule_statement: ($) => $.parser_rule_statement,

    import_statement: ($) =>
      seq("import", field("path", $.string), optional(";")),

    parser_rule_statement: ($) =>
      seq(
        optional(choice("entry", "fragment")),
        $.rule_name_expression,
        optional(choice("*", $.returns_expression, $.infers_expression)),
        optional($.hidden_expression),
        ":",
        $._definition_expression,
        ";",
      ),
    rule_name_expression: ($) =>
      seq(
        field("name", $.id),
        optional(
          seq(
            "<",
            optional(field("parameters", alias($._ids, $.parameters))),
            ">",
          ),
        ),
      ),
    returns_expression: ($) =>
      seq("returns", field("type", choice($.id, $.primitive_type))),
    infers_expression: ($) => seq("infers", field("inferred_type", $.id)),
    infer_expression: ($) => seq("infer", field("inferred_type", $.id)),

    _definition_expression: ($) =>
      choice(
        $.alternatives_expression,
        $.conditional_branch_expression,
        $.unordered_group_expression,
        $.group_exression,
      ),
    alternatives_expression: ($) =>
      prec.left(
        PREC.ALTERNATIVES,
        seq($._definition_expression, "|", $._definition_expression),
      ),
    conditional_branch_expression: ($) =>
      prec.left(
        PREC.CONDITIONAL_BRANCH,
        seq(
          "<",
          $._condition_expression,
          ">",
          repeat1($._abstract_token_expression),
        ),
      ),
    unordered_group_expression: ($) =>
      prec.left(
        PREC.UNORDERED_GROUP,
        seq($._definition_expression, "&", $._definition_expression),
      ),
    group_exression: ($) =>
      prec.left(PREC.GROUP, repeat1($._abstract_token_expression)),

    _abstract_token_expression: ($) =>
      choice($.cardinality_expression, $.action_expression),
    cardinality_expression: ($) =>
      seq(
        choice($.assignment_expression, $._abstract_terminal_expression),
        optional(choice("?", "*", "+")),
      ),
    assignment_expression: ($) =>
      seq(
        optional(choice("=>", "->")),
        field("feature", $._feature_name_expression),
        choice("+=", "=", "?="),
        field("terminal", $._assignable_terminal_expression),
      ),
    action_expression: ($) =>
      seq(
        "{",
        field("type", choice($.id, $.infer_expression)),
        optional(
          seq(
            ".",
            field("feature", $._feature_name_expression),
            choice("=", "+="),
            "current",
          ),
        ),
        "}",
      ),

    _abstract_terminal_expression: ($) =>
      choice(
        $._keyword_expression,
        $.rule_call_expression,
        $.parenthesized_element_expression,
        $.predicated_keyword_expression,
      ),
    _keyword_expression: ($) => alias($.string, $.keyword),
    rule_call_expression: ($) =>
      seq(
        field("rule", $.id),
        optional(
          seq(
            "<",
            $.named_argument_expression,
            repeat(seq(",", $.named_argument_expression)),
            ">",
          ),
        ),
      ),
    named_argument_expression: ($) =>
      seq(
        optional(seq(field("parameter", $.id), "=")),
        $._condition_expression,
      ),
    parenthesized_element_expression: ($) =>
      seq("(", $._definition_expression, ")"),
    predicated_keyword_expression: ($) =>
      seq(choice("=>", "->"), alias($.string, $.keyword)),

    _assignable_terminal_expression: ($) =>
      choice($._keyword_expression, $.rule_call_expression),

    _condition_expression: ($) =>
      choice(
        $.disjunction_expression,
        $.conjunction_expression,
        $.negation_expression,
        $._atom_expression,
      ),
    disjunction_expression: ($) =>
      prec.left(
        PREC.DISJUNCTION,
        seq($._condition_expression, "|", $._condition_expression),
      ),
    conjunction_expression: ($) =>
      prec.left(
        PREC.CONJUNCTION,
        seq($._condition_expression, "&", $._condition_expression),
      ),
    negation_expression: ($) =>
      prec.right(PREC.NEGATION, seq("!", $._condition_expression)),
    _atom_expression: ($) =>
      prec(
        PREC.ATOM,
        choice(
          $._parameter_reference_expression,
          $.parenthesized_condition_expression,
          $.boolean_literal,
        ),
      ),
    parenthesized_condition_expression: ($) =>
      seq("(", $._condition_expression, ")"),
    _parameter_reference_expression: ($) => alias($.id, $.parameter_reference),

    _feature_name_expression: ($) =>
      choice($.builtin_feature_name, $.primitive_type, $.id),

    id: () => /\^?[_a-zA-Z][\w_]*/,
    string: () => /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/,
    builtin_feature_name: () =>
      choice(
        "current",
        "entry",
        "extends",
        "false",
        "fragment",
        "grammar",
        "hidden",
        "import",
        "interface",
        "returns",
        "terminal",
        "true",
        "type",
        "infer",
        "infers",
        "with",
      ),
    primitive_type: () =>
      choice("string", "number", "boolean", "Date", "bigint"),
    boolean_literal: () => choice("true", "false"),

    block_comment: () => /\/\*([^*]|\*[^/])*\*?\*\//,
    line_comment: () => /\/\/[^\n\r]*/,

    _ids: ($) => seq($.id, repeat(seq(",", $.id))),
  },
});
