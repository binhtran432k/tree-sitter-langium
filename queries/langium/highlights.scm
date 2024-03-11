[
  "grammar"
  "with"
  "hidden"
  "entry"
  "fragment"
] @keyword

(id) @variable

(string) @string

"import" @keyword.import

[
  "="
  "+="
  "?="
  "=>"
  "->"
  "*"
  "+"
  "?"
] @operator

[
  (line_comment)
  (block_comment)
] @comment @spell

[
  ":"
  ";"
  ","
] @punctuation.delimiter

[
  "("
  ")"
  "<"
  ">"
] @punctuation.bracket

(parameters
  (id) @variable.parameter)

(assignment_expression
  feature: (id) @property)
