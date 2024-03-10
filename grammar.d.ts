interface LangiumGrammarStruct {
  document: Rule;
  grammar_statement: Rule;
  with_expression: Rule;
  hidden_expression: Rule;

  id: Rule;
}

interface LangiumExternalGrammarStruct {}

declare const grammar: GrammarFunc<
  LangiumGrammarStruct,
  LangiumExternalGrammarStruct
>;
