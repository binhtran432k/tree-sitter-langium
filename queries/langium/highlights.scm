[
  "grammar"
  "with"
  "hidden"
] @keyword

(id) @variable

(string) @string

"import" @keyword.import

[
  (line_comment)
  (block_comment)
] @comment @spell

[
  ";"
  ","
] @punctuation.delimiter

[
  "("
  ")"
] @punctuation.bracket
