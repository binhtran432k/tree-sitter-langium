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
  // Type Definition
  UNION_TYPE: 1,
  ARRAY_TYPE: 2,
  REFERENCE_TYPE: 3,
  SIMPLE_TYPE: 4,
});

module.exports = grammar({
  name: "langium",

  extras: ($) => [/\s+/, $.block_comment, $.line_comment],

  inline: ($) => [$.__rule_call],

  word: ($) => $.id,

  rules: {
    document: ($) =>
      seq(
        optional($.grammar),
        repeat($.import),
        repeat1(choice($._abstract_rule, $.interface, $.type)),
      ),

    grammar: ($) =>
      prec.right(
        seq(
          "grammar",
          field("name", $.id),
          optional($.with),
          optional($.hidden),
        ),
      ),
    with: ($) => seq("with", $._ids),
    hidden: ($) => seq("hidden", "(", optional($._ids), ")"),

    interface: ($) =>
      seq(
        "interface",
        field("name", $.id),
        optional($.extends),
        "{",
        repeat($.type_attribute),
        "}",
        optional(";"),
      ),
    extends: ($) => seq("extends", alias($._ids, $.super_types)),
    type_attribute: ($) =>
      seq(
        field("name", $._feature_name),
        optional("?"),
        ":",
        field("type", $._type_definition),
        optional(seq("=", field("value", $._value_literal))),
        optional(";"),
      ),

    type: ($) =>
      seq(
        "type",
        field("name", $.id),
        "=",
        field("type", $._type_definition),
        optional(";"),
      ),

    _type_definition: ($) =>
      choice(
        $.union_type,
        $.array_type,
        $.reference_type,
        $.group_type,
        choice($.id, $.primitive_type, $.string),
      ),
    union_type: ($) =>
      prec.left(
        PREC.UNION_TYPE,
        seq($._type_definition, "|", $._type_definition),
      ),
    array_type: ($) =>
      prec.left(PREC.ARRAY_TYPE, seq($._type_definition, "[", "]")),
    reference_type: ($) =>
      prec.right(PREC.REFERENCE_TYPE, seq("@", $._type_definition)),
    group_type: ($) =>
      prec(PREC.SIMPLE_TYPE, seq("(", $._type_definition, ")")),

    _value_literal: ($) => choice($.string, $.number, $.boolean, $.array),
    array: ($) =>
      seq(
        "[",
        optional(
          prec.left(seq($._value_literal, repeat(seq(",", $._value_literal)))),
        ),
        "]",
      ),

    _abstract_rule: ($) => choice($.parser_rule, $.terminal_rule),

    import: ($) => seq("import", field("path", $.string), optional(";")),

    parser_rule: ($) =>
      seq(
        optional(choice("entry", "fragment")),
        $.rule_name,
        optional(choice("*", $.returns, $.infers)),
        optional($.hidden),
        ":",
        field("definition", $._definition),
        ";",
      ),
    rule_name: ($) =>
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
    returns: ($) =>
      seq("returns", field("type", choice($.id, $.primitive_type))),
    infers: ($) => seq("infers", field("inferred_type", $.id)),
    infer: ($) => seq("infer", field("inferred_type", $.id)),

    _definition: ($) =>
      choice(
        $.alternatives,
        $.conditional_branch,
        $.unordered_group,
        $.group,
        $._abstract_token,
      ),
    alternatives: ($) =>
      prec.left(PREC.ALTERNATIVES, seq($._definition, "|", $._definition)),
    conditional_branch: ($) =>
      prec.left(
        PREC.CONDITIONAL_BRANCH,
        seq("<", $._condition, ">", repeat1($._abstract_token)),
      ),
    unordered_group: ($) =>
      prec.left(PREC.UNORDERED_GROUP, seq($._definition, "&", $._definition)),
    group: ($) =>
      prec.left(PREC.GROUP, seq($._abstract_token, repeat1($._abstract_token))),

    _abstract_token: ($) =>
      choice(
        $.cardinality,
        $.action,
        choice($.assignment, $._abstract_terminal),
      ),
    cardinality: ($) =>
      seq(choice($.assignment, $._abstract_terminal), choice("?", "*", "+")),
    assignment: ($) =>
      seq(
        optional(choice("=>", "->")),
        field("feature", $._feature_name),
        choice("+=", "=", "?="),
        field("terminal", $._assignable_terminal),
      ),
    action: ($) =>
      seq(
        "{",
        field("type", choice($.id, $.infer)),
        optional(
          seq(
            ".",
            field("feature", $._feature_name),
            choice("=", "+="),
            "current",
          ),
        ),
        "}",
      ),

    _abstract_terminal: ($) =>
      choice(
        $._keyword,
        $.rule_call,
        $.parenthesized_element,
        $.predicated_keyword,
        $.predicated_rule_call,
        $.predicated_group,
        $.eof,
      ),
    _keyword: ($) => alias($.string, $.keyword),
    rule_call: ($) => $.__rule_call,
    __rule_call: ($) =>
      seq(
        field("rule", $.id),
        optional(
          seq("<", $.named_argument, repeat(seq(",", $.named_argument)), ">"),
        ),
      ),
    named_argument: ($) =>
      seq(optional(seq(field("parameter", $.id), "=")), $._condition),
    parenthesized_element: ($) => seq("(", $._definition, ")"),
    predicated_keyword: ($) => seq(choice("=>", "->"), $._keyword),
    predicated_rule_call: ($) => seq(choice("=>", "->"), $.__rule_call),
    predicated_group: ($) => seq(choice("=>", "->"), "(", $._definition, ")"),

    _assignable_terminal: ($) =>
      choice(
        $._keyword,
        $.rule_call,
        $.parenthesized_assignable_element,
        $.cross_reference,
      ),
    parenthesized_assignable_element: ($) =>
      seq("(", $.assignable_alternatives, ")"),
    assignable_alternatives: ($) =>
      seq($._assignable_terminal, repeat(seq("|", $._assignable_terminal))),
    cross_reference: ($) =>
      seq(
        "[",
        field("type", $.id),
        choice("|", ":"),
        $._cross_referencable_terminal,
        "]",
      ),
    _cross_referencable_terminal: ($) => choice($._keyword, $.rule_call),

    _condition: ($) =>
      choice($.disjunction, $.conjunction, $.negation, $._atom),
    disjunction: ($) =>
      prec.left(PREC.DISJUNCTION, seq($._condition, "|", $._condition)),
    conjunction: ($) =>
      prec.left(PREC.CONJUNCTION, seq($._condition, "&", $._condition)),
    negation: ($) => prec.right(PREC.NEGATION, seq("!", $._condition)),
    _atom: ($) =>
      prec(
        PREC.ATOM,
        choice($._parameter_reference, $.parenthesized_condition, $.boolean),
      ),
    parenthesized_condition: ($) => seq("(", $._condition, ")"),
    _parameter_reference: ($) => alias($.id, $.parameter_reference),

    terminal_rule: ($) =>
      seq(
        optional("hidden"),
        "terminal",
        choice(
          seq("fragment", field("name", $.id)),
          seq(field("name", $.id), optional($.returns)),
        ),
        ":",
        field("definition", $._terminal_definition),
        ";",
      ),

    _terminal_definition: ($) =>
      choice($.terminal_alternatives, $.terminal_group, $._terminal_token),
    terminal_alternatives: ($) =>
      prec.left(
        PREC.TERMINAL_ALTERNATIVES,
        seq($._terminal_definition, "|", $._terminal_definition),
      ),
    terminal_group: ($) =>
      prec.left(
        PREC.TERMINAL_GROUP,
        seq($._terminal_token, repeat1($._terminal_token)),
      ),
    _terminal_token: ($) =>
      choice($._terminal_token_element, $.terminal_cardinality),
    terminal_cardinality: ($) =>
      seq($._terminal_token_element, choice("?", "*", "+")),

    _terminal_token_element: ($) =>
      choice(
        $._keyword,
        $.character_range,
        $.terminal_rule_call,
        $.parenthesized_terminal_element,
        $.negated_token,
        $.until_token,
        $.regex,
        $.wildcard,
      ),
    character_range: ($) => seq($._keyword, "..", $._keyword),
    terminal_rule_call: ($) => field("rule", $.id),
    parenthesized_terminal_element: ($) =>
      seq(
        "(",
        optional(choice("?=", "?!", "?<=", "?<!")),
        $._terminal_definition,
        ")",
      ),
    negated_token: ($) => prec.right(seq("!", $._terminal_token_element)),
    until_token: ($) => prec.right(seq("->", $._terminal_token_element)),

    _feature_name: ($) =>
      choice($.builtin_feature_name, $.primitive_type, $.id),

    id: () => /\^?[_a-zA-Z][\w_]*/,
    string: () => /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/,
    number: () => /NaN|-?((\d*\.\d+|\d+)([Ee][+-]?\d+)?|Infinity)/,
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
    wildcard: () => ".",
    primitive_type: () =>
      choice("string", "number", "boolean", "Date", "bigint"),
    boolean: () => choice("true", "false"),
    eof: () => "EOF",

    block_comment: () => /\/\*([^*]|\*[^/])*\*?\*\//,
    line_comment: () => /\/\/[^\n\r]*/,

    _ids: ($) => seq($.id, repeat(seq(",", $.id))),
  },
});
