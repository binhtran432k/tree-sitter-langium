interface LangiumGrammarStruct {
  document: Rule;
  grammar_statement: Rule;
  with_expression: Rule;
  hidden_expression: Rule;
  import_statement: Rule;

  _abstract_rule_statement: Rule;
  parser_rule_statement: Rule;
  rule_name_expression: Rule;
  returns_expression: Rule;
  infers_expression: Rule;

  _definition_expression: Rule;
  group_exression: Rule;

  _abstract_token_expression: Rule;
  cardinality_expression: Rule;
  assignment_expression: Rule;
  _abstract_terminal_expression: Rule;
  keyword_expression: Rule;
  rule_call_expression: Rule;

  _assignable_terminal_expression: Rule;

  _feature_name_expression: Rule;

  id: Rule;
  string: Rule;
  builtin_feature_name: Rule;
  primitive_type: Rule;
  block_comment: Rule;
  line_comment: Rule;

  _ids: Rule;

  parameters?: Rule;
}

interface LangiumExternalGrammarStruct {}

declare const grammar: GrammarFunc<
  LangiumGrammarStruct,
  LangiumExternalGrammarStruct
>;
