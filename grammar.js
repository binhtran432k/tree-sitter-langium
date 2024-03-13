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
  // Terminal Definition
  TERMINAL_ALTERNATIVES: 1,
  TERMINAL_GROUP: 2,
});

module.exports = grammar({
  name: "langium",

  extras: ($) => [/\s+/, $.block_comment, $.line_comment],

  inline: ($) => [$.__rule_call],

  word: ($) => $.id,

  rules: {
    document: ($) =>
      seq(
        optional($.grammar_statement),
        repeat($.import_statement),
        repeat1($._abstract_rule_statement),
      ),

    grammar_statement: ($) =>
      prec.right(
        seq(
          "grammar",
          field("name", $.id),
          optional($.with_expression),
          optional($.hidden_expression),
        ),
      ),
    with_expression: ($) => seq("with", $._ids),
    hidden_expression: ($) => seq("hidden", "(", optional($._ids), ")"),

    _abstract_rule_statement: ($) =>
      choice($.parser_rule_statement, $.terminal_rule_statement),

    import_statement: ($) =>
      seq("import", field("path", $.string), optional(";")),

    parser_rule_statement: ($) =>
      seq(
        optional(choice("entry", "fragment")),
        $.rule_name_expression,
        optional(choice("*", $.returns_expression, $.infers_expression)),
        optional($.hidden_expression),
        ":",
        field("definition", $._definition_expression),
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
        $.predicated_rule_call_expression,
        $.predicated_group_expression,
        $.eof,
      ),
    _keyword_expression: ($) => alias($.string, $.keyword),
    rule_call_expression: ($) => $.__rule_call,
    __rule_call: ($) =>
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
      seq(choice("=>", "->"), $._keyword_expression),
    predicated_rule_call_expression: ($) =>
      seq(choice("=>", "->"), $.__rule_call),
    predicated_group_expression: ($) =>
      seq(choice("=>", "->"), "(", $._definition_expression, ")"),

    _assignable_terminal_expression: ($) =>
      choice(
        $._keyword_expression,
        $.rule_call_expression,
        $.parenthesized_assignable_element_expression,
        $.cross_reference_expression,
      ),
    parenthesized_assignable_element_expression: ($) =>
      seq("(", $.assignable_alternatives_expression, ")"),
    assignable_alternatives_expression: ($) =>
      seq(
        $._assignable_terminal_expression,
        repeat(seq("|", $._assignable_terminal_expression)),
      ),
    cross_reference_expression: ($) =>
      seq(
        "[",
        field("type", $.id),
        choice("|", ":"),
        $._cross_referencable_terminal_expression,
        "]",
      ),
    _cross_referencable_terminal_expression: ($) =>
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

    terminal_rule_statement: ($) =>
      seq(
        optional("hidden"),
        "terminal",
        choice(
          seq("fragment", field("name", $.id)),
          seq(field("name", $.id), optional($.returns_expression)),
        ),
        ":",
        field("definition", $._terminal_definition_expression),
        ";",
      ),

    _terminal_definition_expression: ($) =>
      choice($.terminal_alternatives_expression, $.terminal_group_exression),
    terminal_alternatives_expression: ($) =>
      prec.left(
        PREC.TERMINAL_ALTERNATIVES,
        seq(
          $._terminal_definition_expression,
          "|",
          $._terminal_definition_expression,
        ),
      ),
    terminal_group_exression: ($) =>
      prec.left(PREC.TERMINAL_GROUP, repeat1($.terminal_token_expression)),
    terminal_token_expression: ($) =>
      seq(
        $._terminal_token_element_expression,
        optional(choice("?", "*", "+")),
      ),

    _terminal_token_element_expression: ($) => choice($.regex),

    _feature_name_expression: ($) =>
      choice($.builtin_feature_name, $.primitive_type, $.id),

    id: () => /\^?[_a-zA-Z][\w_]*/,
    string: () => /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/,
    regex: ($) =>
      seq(
        "/",
        field("pattern", $.regex_pattern),
        token.immediate(prec(1, "/")),
        optional(field("flags", $.regex_flags)),
      ),
    regex_pattern: () =>
      token.immediate(
        prec(
          -1,
          repeat1(
            choice(
              seq("[", repeat(choice(/[^\r\n\]\\]/, /\\./)), "]"),
              /\\./,
              /[^\r\n\[/\\]/,
            ),
          ),
        ),
      ),
    regex_flags: () => token.immediate(/[a-z]+/),
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
    eof: () => "EOF",

    block_comment: () => /\/\*([^*]|\*[^/])*\*?\*\//,
    line_comment: () => /\/\/[^\n\r]*/,

    _ids: ($) => seq($.id, repeat(seq(",", $.id))),
  },
});
