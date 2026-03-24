# 💱 CambioTrack — Rastreador de Cotações

API REST desenvolvida com **Django REST Framework** para rastreamento de cotações de moedas em tempo real, com autenticação JWT e frontend integrado.

---

## 📋 Sobre o Projeto

O CambioTrack consome a [AwesomeAPI](https://economia.awesomeapi.com.br/) para consultar cotações de moedas em tempo real. Cada usuário pode cadastrar moedas favoritas, definir alertas de preço e visualizar o histórico completo de consultas.

---

## 🚀 Funcionalidades

- ✅ Cadastro e autenticação de usuários com JWT
- ✅ Consulta de cotações em tempo real (USD-BRL, EUR-BRL, BTC-BRL, etc.)
- ✅ Gerenciamento de moedas favoritas por usuário
- ✅ Alertas de preço configuráveis (acima ou abaixo de um valor)
- ✅ Histórico de todas as consultas realizadas
- ✅ Frontend integrado com HTML, CSS e JavaScript
- ✅ Suporte a Docker

---

## 🛠️ Tecnologias

| Tecnologia | Versão |
|------------|--------|
| Python | 3.12 |
| Django | 6.0.3 |
| Django REST Framework | 3.17.0 |
| djangorestframework-simplejwt | 5.5.1 |
| django-cors-headers | 4.3.1 |
| PyJWT | 2.12.1 |
| requests | 2.31.0 |
| SQLite | — |

---

## 📁 Estrutura do Projeto

```
wsBackend/
├── api/
│   ├── migrations/
│   │   └── 0001_initial.py
│   ├── static/
│   │   ├── css/
│   │   │   ├── auth.css
│   │   │   ├── base.css
│   │   │   └── painel.css
│   │   └── js/
│   │       ├── auth.js
│   │       ├── base.js
│   │       ├── painel.js
│   │       ├── favoritas.js
│   │       ├── alertas.js
│   │       └── historico.js
│   ├── templates/
│   │   ├── auth.html
│   │   ├── painel.html
│   │   ├── favoritas.html
│   │   ├── alertas.html
│   │   └── historico.html
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── apps.py
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── .gitignore
├── manage.py
├── dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## ⚙️ Como Rodar o Projeto

### ▶️ Sem Docker

**1. Clone o repositório**
```bash
git clone https://github.com/igorsilvabrito/wsBackend-Fabrica26.1.git
cd wsBackend-Fabrica26.1
```

**2. Crie e ative o ambiente virtual**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

**3. Instale as dependências**
```bash
python -m pip install -r requirements.txt
```

**4. Rode as migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

**5. Suba o servidor**
```bash
python manage.py runserver
```

**6. Acesse no navegador**
```
http://localhost:8000/
```

---

### 🐳 Com Docker

**1. Build da imagem**
```bash
docker-compose build
```

**2. Suba os containers**
```bash
docker-compose up -d
```

**3. Rode as migrations**
```bash
docker-compose exec web python manage.py migrate
```

**4. Acesse no navegador**
```
http://localhost:8000/
```

**5. Para parar os containers**
```bash
docker-compose down
```

---

## 🌐 Páginas do Frontend

| Página | URL | Descrição |
|--------|-----|-----------|
| Login/Cadastro | `/` | Autenticação do usuário |
| Painel | `/painel/` | Consulta cotações em tempo real |
| Favoritas | `/favoritas/` | Gerencia moedas favoritas |
| Alertas | `/alertas/` | Configura alertas de preço |
| Histórico | `/historico/` | Visualiza consultas anteriores |

---

## 🔑 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/Registro/` | create conta | ❌ |
| POST | `/api/token/` | Login — retorna access e refresh token | ❌ |
| POST | `/api/token/refresh/` | Renovar access token | ❌ |

### Cotações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/cotacao/<par>/` | Consulta cotação ao vivo e salva no histórico | ✅ |

> Exemplos de pares: `USD-BRL`, `EUR-BRL`, `BTC-BRL`, `ARS-BRL`, `GBP-BRL`, `JPY-BRL`, `CAD-BRL`

### Moedas Favoritas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/favoritas/` | Lista moedas favoritas | ✅ |
| POST | `/api/favoritas/` | Adiciona moeda favorita | ✅ |
| PUT | `/api/favoritas/<id>/update/` | Atualiza apelido de uma favorita | ✅ |
| DELETE | `/api/favoritas/<id>/` | Remove moeda favorita | ✅ |

### Alertas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/alertas/` | Lista alertas | ✅ |
| POST | `/api/alertas/` | Cria alerta de preço | ✅ |
| DELETE | `/api/alertas/<id>/` | Remove alerta | ✅ |

### Histórico

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/historico/` | Lista todas as consultas feitas | ✅ |

---

## 🔐 Autenticação JWT

Todas as rotas marcadas com ✅ requerem o header:

```
Authorization: Bearer <access_token>
```

| Token | Duração |
|-------|---------|
| access | 1 hora |
| refresh | 7 dias |

Para renovar o access token expirado:

```json
POST /api/token/refresh/
{
    "refresh": "seu_refresh_token"
}
```

---

## 📦 Exemplos de Requisição

### create conta
```json
POST /api/Registro/
{
    "username": "joao",
    "email": "joao@email.com",
    "password": "senha123"
}
```

### Login
```json
POST /api/token/
{
    "username": "joao",
    "password": "senha123"
}
```

### Consultar cotação
```
GET /api/cotacao/USD-BRL/
Authorization: Bearer <token>
```

### Adicionar favorita
```json
POST /api/favoritas/
Authorization: Bearer <token>
{
    "par": "USD-BRL",
    "apelido": "Dólar"
}
```
### Atualizar apelido de favorita
```json
PUT /api/favoritas/1/update/
Authorization: Bearer 
{
    "par": "USD-BRL",
    "apelido": "Dólar Americano"
}
```

### create alerta
```json
POST /api/alertas/
Authorization: Bearer <token>
{
    "par": "USD-BRL",
    "tipo": "acima",
    "valor_referencia": "6.00"
}
```

---

## 🗄️ Modelos

### MoedaFavorita
| Campo | Tipo | Descrição |
|-------|------|-----------|
| usuario | ForeignKey | Usuário dono da favorita |
| par | CharField | Par de moedas (ex: USD-BRL) |
| apelido | CharField | Apelido opcional |
| criado_em | DateTimeField | Data de criação |

### HistoricoCotacao
| Campo | Tipo | Descrição |
|-------|------|-----------|
| usuario | ForeignKey | Usuário que consultou |
| par | CharField | Par de moedas |
| valor_compra | DecimalField | Valor de compra |
| valor_venda | DecimalField | Valor de venda |
| variacao | DecimalField | Variação percentual do dia |
| consultado_em | DateTimeField | Data/hora da consulta |

### Alerta
| Campo | Tipo | Descrição |
|-------|------|-----------|
| usuario | ForeignKey | Usuário dono do alerta |
| par | CharField | Par de moedas |
| tipo | CharField | `acima` ou `abaixo` |
| valor_referencia | DecimalField | Valor gatilho |
| ativo | BooleanField | Se o alerta está ativo |
| disparado | BooleanField | Se o alerta foi disparado |
| criado_em | DateTimeField | Data de criação |
| disparado_em | DateTimeField | Quando foi disparado |

---

## 🔧 Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `DEBUG` | `True` | Modo debug do Django |
| `SECRET_KEY` | — | Chave secreta do Django |

> ⚠️ Em produção sempre defina `DEBUG=False` e use uma `SECRET_KEY` segura via variável de ambiente.

---

## 👤 Autor

**Igor Silva Brito**  
[GitHub](https://github.com/igorsilvabrito)
