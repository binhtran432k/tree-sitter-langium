interface LangiumGrammarStruct {
  document: Rule;
  grammar: Rule;
  with: Rule;
  hidden: Rule;
  import: Rule;

  _abstract_rule: Rule;
  parser_rule: Rule;
  rule_name: Rule;
  returns: Rule;
  infers: Rule;
  infer: Rule;

  _definition: Rule;
  alternatives: Rule;
  conditional_branch: Rule;
  unordered_group: Rule;
  group: Rule;

  _abstract_token: Rule;
  cardinality: Rule;
  assignment: Rule;
  action: Rule;

  _condition: Rule;
  disjunction: Rule;
  conjunction: Rule;
  negation: Rule;
  _atom: Rule;
  parenthesized_condition: Rule;
  _parameter_reference: Rule;

  _abstract_terminal: Rule;
  _keyword: Rule;
  __rule_call: Rule;
  rule_call: Rule;
  named_argument: Rule;
  parenthesized_element: Rule;
  predicated_keyword: Rule;
  predicated_rule_call: Rule;
  predicated_group: Rule;

  _assignable_terminal: Rule;
  parenthesized_assignable_element: Rule;
  assignable_alternatives: Rule;
  cross_reference: Rule;
  _cross_referencable_terminal: Rule;

  _feature_name: Rule;

  terminal_rule: Rule;

  _terminal_definition: Rule;
  terminal_alternatives: Rule;
  terminal_group: Rule;
  _terminal_token: Rule;
  terminal_cardinality: Rule;

  _terminal_token_element: Rule;
  character_range: Rule;
  terminal_rule_call: Rule;
  parenthesized_terminal_element: Rule;
  negated_token: Rule;
  until_token: Rule;

  id: Rule;
  string: Rule;
  regex: Rule;
  regex_pattern: Rule;
  regex_flags: Rule;
  builtin_feature_name: Rule;
  wildcard: Rule;
  primitive_type: Rule;
  boolean_literal: Rule;
  eof: Rule;
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
