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
  infer_expression: Rule;

  _definition_expression: Rule;
  alternatives_expression: Rule;
  conditional_branch_expression: Rule;
  unordered_group_expression: Rule;
  group_exression: Rule;

  _abstract_token_expression: Rule;
  cardinality_expression: Rule;
  assignment_expression: Rule;
  action_expression: Rule;

  _condition_expression: Rule;
  disjunction_expression: Rule;
  conjunction_expression: Rule;
  negation_expression: Rule;
  _atom_expression: Rule;
  parenthesized_condition_expression: Rule;
  _parameter_reference_expression: Rule;

  _abstract_terminal_expression: Rule;
  _keyword_expression: Rule;
  rule_call_expression: Rule;
  named_argument_expression: Rule;
  parenthesized_element_expression: Rule;

  _assignable_terminal_expression: Rule;

  _feature_name_expression: Rule;

  id: Rule;
  string: Rule;
  builtin_feature_name: Rule;
  primitive_type: Rule;
  boolean_literal: Rule;
  block_comment: Rule;
  line_comment: Rule;

  _ids: Rule;

  // Aliases
  parameters?: Rule;
  keyword?: Rule;
  parameter_reference?: Rule;
}

interface LangiumExternalGrammarStruct {}

declare const grammar: GrammarFunc<
  LangiumGrammarStruct,
  LangiumExternalGrammarStruct
>;
