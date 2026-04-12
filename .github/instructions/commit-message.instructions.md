# Padrao de mensagem de commit (pt-BR)

Ao gerar mensagem de commit:
- Ler alteracoes staged (`git diff --staged`).
- Ler branch atual (`git branch --show-current`).
- Responder em Portugues-BR tecnico e direto.
- Citar somente o que existe no diff staged.

Formato obrigatorio:
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

Regras adicionais:
- Primeira linha obrigatoriamente com identificador da branch.
- Se a branch tiver padrao de tarefa (ex.: SL-123), usar esse identificador.
- Se nao houver padrao, usar o nome completo da branch.
- Nao usar termos genericos como "update", "ajustes gerais" ou equivalentes.
- Se nao houver notas, escrever: "- Sem observacoes adicionais.".
