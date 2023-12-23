- [x] Criar componente Header básico
- [x] Criar componente input básico
- [x] Criar input customizado para select - https://www.youtube.com/watch?v=weCKm6AWuO4
- [x] Criar input customizado para data - lib react-datepicker
- [x] Criar input customizado para radiogroup
- [ ] Criar input customizado para tempo
- [x] Criar input customizado para multiselect
- [x] Colocar ícone em editText e botão componente

## libs
- [x] react-icons
- [x] react-datepicker - https://www.npmjs.com/package//react-datepicker - melhor tutorial https://www.youtube.com/watch?v=iYZryimRK9w&t=33s
- [x] react-hook-form
- [x] yup

- [x] Corrigir recuperação do multiselectDropdownRadio
- [x] Corrigir problemas de envio de formulário de atendimento.
- [x] Corrigir problemas de validação de formulário de atendimento.
- [x] Verificar e validar lógicas de validação do banco de dados para a tabela de atendimentos

----Nova fase Autenticação e prontuário
- [x] Criar lógica e sistema de autenticação com provider ou email
- [x] Criar estrutura de prontuário do atendido
- [x] Refatorar Header para responsividade
- [x] Refatorar tela de Login para responsividade (versão web)
- [x] Refatorar Dashboard para responsividade
- [x] Implementar função de gerar prontuário em pdf
- [x] Adicionar função upload pdf assinado
- [x] Implementar melhoria no carregamento dos formulários
- [x] Adiciona barra de busca na listagem de atendimentos
- [x] Adicionar políticas no banco de dados
- [x] Criar função para transação de cadastro de cliente
- [x] Criar funções para transação de cadastro de atendimento
- [x] Adicionar máscara de data no datapicker
- [x] Adicionar melhoria no dropdown (input confundindo usuário)
- [x] Criar formulário para cadastro de usuário
- [x] Cadastrar avatar de usuário
- [x] Implementar header responsivo
- [x] Criar email e senha (aleatória) para usuário e enviar para email do usuário recém cadastrado
- [x] Associar tabela de email e senha com tabela de usuário pelo id
- [x] Enviar email para com password aleatório para usuário recém-criado
- [x] Implementar recuperação de senha de usuário
- [x] Implementar download de prontuário completo em pdf
- [x] Implementar anexos para cada atendimento
- [x] Formatar página de atendimento em pdf
- [x] Implementar atualização de perfil de atendido
- [x] Colocar máscara no campo de cpf e cep nos formulários de atualização de endereço e contatos
- [x] Apresentar erros de validação no formulário de atualização de contatos
- [x] Melhorar apresentação dos inputs do estilo dropdown nos formulários de atualização no mobile
- [x] Adicionar paginação na listagem de atendidos //depois verificar como fazer paginação acompanhar a busca
- [x] Adicionar paginação na listagem de atendimentos //depois verificar como fazer paginação acompanhar a busca
- [ ] Implementar roles
- [ ] Criar capa para prontuário
- [ ] Reduzir número de itens exibidos em cada dropdown para 5 ou 10 itens
- [ ] Implementar gestão de dados de atendido (atualizar e deletar) usuários
- [ ] Implementar controle de alterações no perfil do usuário
- [ ] Implementar atualização de perfil de usuário
- [ ] Implementar gestão de usuários (listagem, delete e update via admin)
- [ ] Recuperar as listas na ordenação desejada
- [ ] Implementar backup diário automático do banco de dados
- [ ] Implementar política de autorização adequada para os usuários com base nas roles
- [ ] Desenhar nova Dashboard
- [ ] Melhorar UI nos loadings de avatar
- [ ] Implementar função de assinatura digital
- [ ] Popular banco de dados com dados oficiais
- [ ] Observar se pode haver alguma confusão do usuário com a seleção do customDropdown, pois ele mantém o item selecionado, mesmo o usuário apagando o seu nome da barra de busca. Não é um erro, mas pode confundir o usuário. Segue para teste.

Correções
- [ ] Corrigir seleção de cidade em formulário de cadastro de cliente e de usuário. Problema: Quando 
aplica seleção de cidade com filtro, por algum motivo, a primeira seleção não dá certo, somente a próxima.


Implementações com menor prioridade
- [] Implementar pesquisa de dados de endereção automaticamente com base no CEP no formulário de atualização 
de endereço

- [ ] Revisar lógica para manter campos de formulário mantendo valores previamente selecionados.