interface LangiumGrammarStruct {
  document: Rule;
  grammar_statement: Rule;
  with_expression: Rule;
  hidden_expression: Rule;
  import_statement: Rule;

  id: Rule;
  string: Rule;
  block_comment: Rule;
  line_comment: Rule;
}

interface LangiumExternalGrammarStruct {}

declare const grammar: GrammarFunc<
  LangiumGrammarStruct,
  LangiumExternalGrammarStruct
>;
