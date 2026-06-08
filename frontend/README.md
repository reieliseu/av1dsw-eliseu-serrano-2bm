# Frontend - Sistema de Tarefas

Interface web desenvolvida em **React** com **Vite** para o gerenciamento de tarefas, consumindo a API backend Node.js.

## Funcionalidades

- Visualização de tarefas
- Criação, edição e remoção de tarefas
- Integração com API RESTful

## Estrutura do Projeto

```
frontend/
├── public/           # Arquivos estáticos
├── src/              # Código-fonte React
│   ├── assets/       # Imagens e outros assets
│   ├── App.jsx       # Componente principal
│   ├── main.jsx      # Ponto de entrada
│   └── ...           # Outros componentes e estilos
├── package.json      # Dependências e scripts
└── vite.config.js    # Configuração do Vite
```

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo de ambiente a partir do exemplo e configure se necessário:
   - Unix / Git Bash / WSL:
     ```bash
     cp .env.example .env
     ```
   - PowerShell (Windows):
     ```powershell
     Copy-Item .env.example .env
     ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Observações

Certifique-se de que o backend esteja rodando para que a interface funcione corretamente.

## Variáveis de ambiente

- `VITE_API_BASE_URL`: URL base da API backend (ex.: `http://localhost:3000`).

O arquivo `src/services/api.js` usa `import.meta.env.VITE_API_BASE_URL` e
cairá para `http://localhost:3000` caso não haja variável definida.
