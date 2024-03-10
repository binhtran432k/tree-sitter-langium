interface LangiumGrammarStruct {
  document: Rule;
}

interface LangiumExternalGrammarStruct {}

declare const grammar: GrammarFunc<
  LangiumGrammarStruct,
  LangiumExternalGrammarStruct
>;
