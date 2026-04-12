# Instrucoes para mensagens de commit

Sempre que o usuario pedir uma mensagem de commit, analise o diff staged (`git diff --staged`) antes de responder.
Tambem identifique a branch atual antes de montar a mensagem (`git branch --show-current`).

## Formato obrigatorio

[Identificador da branch]
[Titulo curto no infinitivo, objetivo e tecnico]

Alteracoes:
- [Arquivo/Modulo]
  - [Mudanca objetiva]
- [Arquivo/Modulo]
  - [Mudanca objetiva]

Notas:
- [Regra de negocio, impacto ou efeito colateral relevante]
- [Limitacoes, validacoes, observacoes importantes]

## Regras de escrita

- Escrever em Portugues-BR.
- Nao usar mensagens genericas (ex.: "update models", "ajustes gerais").
- Citar apenas o que realmente foi alterado no diff.
- A primeira linha deve ser o identificador da branch (ex.: SL-XX).
- Extrair o identificador com padrao de tarefa (ex.: SL-123). Se nao houver padrao, usar o nome completo da branch.
- Quando houver regra de negocio, detalhar em "Notas".
- Evitar floreio; manter texto direto e tecnico.
- Se nao houver item para "Notas", usar "Notas:" com "- Sem observacoes adicionais.".

## Exemplo de estilo

SL-XX
Criacao de Rota de Patch

Alteracoes:
- LoanRoutes
  - Criada rota de patch de /:id
- LoanController
  - Implementada funcao de updateLoan
- LoanService
  - Introduzida funcao de updateLoan

Notas:
- O sistema altera os dados do BookCopy conforme o status e condicoes aplicado.
- So e possivel alterar a Data de Emprestimo, Data Limite, Data de Retorno, Notas, Status do Emprestimo e Condicao do Livro.
