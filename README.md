# LogicPlay

Plataforma Interativa para Desenvolvimento do Raciocínio Lógico e Pensamento Computacional.

Atividade Extensionista — 1º Semestre 2026 — UNIFACEAR — Curso de Análise e Desenvolvimento de Sistemas.

**Equipe:** Luan Cordeiro, Danilo Zanin
**Orientação:** Profª Msc. Jolena de Santi Soares

---

## Sobre o projeto

O LogicPlay é uma plataforma web educacional gamificada voltada para estudantes do ensino fundamental II e médio. O objetivo é desenvolver raciocínio lógico, identificação de padrões, estruturação de algoritmos e pensamento computacional por meio de mini-jogos interativos.

## Tecnologias

- HTML5
- CSS3 (custom + Bootstrap 5.3)
- JavaScript (vanilla)
- Bootstrap Icons
- Google Fonts (Poppins)

## Estrutura

```
Logic_Play/
├── index.html          → Página inicial
├── desafios.html       → Hub de mini-jogos + progresso
├── padroes.html        → Mini-jogo 1: padrões e sequências
├── logica.html         → Mini-jogo 2: lógica e dedução
├── algoritmo.html      → Mini-jogo 3: construção de algoritmos (drag & drop)
├── robo.html           → Mini-jogo 4: robô programável (labirinto)
├── sobre.html          → Sobre o projeto (objetivos, cronograma, referências)
├── feedback.html       → Formulário de feedback (avaliação 2.6 do plano)
├── css/style.css       → Estilos globais
└── js/
    ├── common.js       → Pontuação, navbar, helpers
    ├── padroes.js
    ├── logica.js
    ├── algoritmo.js
    └── robo.js
```

## Como rodar

Basta abrir o arquivo `index.html` em qualquer navegador moderno. Não há build nem dependências de servidor.

Para uma experiência ideal, é possível servir com qualquer servidor estático:

```bash
# com Python
python -m http.server 8000

# com Node
npx serve .
```

E acesse `http://localhost:8000`.

## Mini-jogos

| Jogo | Categoria | Pontos por acerto |
|------|-----------|-------------------|
| Padrões e Sequências | Identificação de padrões | 10 |
| Lógica e Dedução | Raciocínio dedutivo | 15 |
| Construção de Algoritmos | Pensamento estruturado | 20 |
| Robô Programável | Pensamento computacional | 25 + bônus |

Pontuação acumulada é persistida em `localStorage` e exibida na navbar e na página de desafios.

## Referências

- WING, J. M. *Computational Thinking*. Communications of the ACM, 2006.
- SHUTE, V. J.; SUN, C.; ASBELL-CLARKE, J. *Demystifying computational thinking*. 2017.
- LOCKWOOD, J.; MOONEY, A. *Computational Thinking in Education*. 2017.
- KAPP, K. M. *The Gamification of Learning and Instruction*. Pfeiffer, 2012.
