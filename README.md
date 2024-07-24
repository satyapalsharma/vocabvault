# VocabVault

**A vocabulary flashcards app with spaced repetition to help users learn new words.**

VocabVault is a client-side web application that helps you build and retain vocabulary through scientifically-backed spaced repetition. Create custom decks, add words with definitions and example sentences, and review them on an optimized schedule that adapts to your performance.

All data is stored locally in your browser — no account, no server, no cloud sync required.

---

## Features

### Deck Management
- **Create and organize decks** — Group words by topic, language, source material, or any scheme you prefer.
- **Edit and delete decks** — Rename or remove decks at any time.
- **Deck-level overview** — See card counts, due counts, and retention rates per deck.

### Word & Card Management
- **Add words with rich metadata** — Each word stores a term, definition, example sentence, pronunciation, and tags.
- **Add words to multiple decks** — The same word can appear in different decks without duplication.
- **Edit and delete flashcards** — Update or remove individual cards from any deck.

### Spaced Repetition System (SRS)
- **SM-2-inspired algorithm** — Cards are scheduled for review based on how well you know them.
- **Quality ratings (0–5)** — Rate each review from "complete blackout" (0) to "perfect recall" (5).
- **Adaptive intervals** — Easy cards are shown less frequently; difficult cards are shown more often.
- **Ease factor tracking** — Each card maintains its own ease factor that adjusts with every review.

### Review Mode
- **Dedicated review session** — Focused, distraction-free review of all due cards.
- **Flip-to-reveal interaction** — See the definition only after you attempt to recall the word.
- **Session progress tracking** — Monitor how many cards you've reviewed in the current session.
- **Deck-specific or global review** — Review a single deck or all due cards across every deck.

### Dashboard & Progress Tracking
- **At-a-glance stats** — Total cards, cards due today, and overall retention rate.
- **Per-deck breakdown** — See stats for each deck individually.
- **Retention rate calculation** — Track the percentage of reviewed cards with active intervals.

### Search & Filter
- **Full-text search** — Search across word terms and definitions.
- **Deck filter** — Limit the browser to a specific deck.
- **Review status filter** — Show all, due, reviewed, or new cards.

### Import & Export
- **JSON export/import** — Back up or transfer your full deck and card data.
- **CSV export** — Export flashcards to a standard CSV format for use in spreadsheets or other tools.

### Data Persistence
- **LocalStorage-backed storage** — All data persists across browser sessions with no backend required.

---

## Project Structure

```
VocabVault/
├── index.html                 # Vite entry HTML
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── vitest.config.ts           # Vitest test configuration
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── .editorconfig              # Editor formatting rules
├── LICENSE                    # MIT License
├── README.md                  # This file
├── CONTRIBUTING.md            # Contribution guidelines
├── CHANGELOG.md               # Version history
├── SECURITY.md                # Security policy
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.ts                # Application entry point
    ├── App.vue                # Root component
    ├── style.css              # Global styles
    ├── vite-env.d.ts          # Vite type declarations
    ├── assets/                # Static assets (images, logos)
    ├── components/            # Reusable UI components
    │   ├── DeckList.vue
    │   ├── DeckManager.vue
    │   ├── CardReview.vue
    │   ├── ReviewMode.vue
    │   ├── ReviewSessionInner.vue
    │   ├── AddWordForm.vue
    │   ├── FlashcardBrowser.vue
    │   ├── FlashcardEditor.vue
    │   ├── ImportExport.vue
    │   └── Dashboard.vue
    ├── views/                 # Page-level route components
    │   ├── DashboardView.vue
    │   ├── ReviewView.vue
    │   └── DeckView.vue
    ├── router/                # Vue Router configuration
    │   └── index.ts
    ├── stores/                # Pinia state management
    │   ├── deck.ts            # Deck CRUD operations
    │   ├── decks.ts           # Deck collection operations
    │   ├── card.ts            # Word & card CRUD + review logic
    │   ├── flashcards.ts      # Flashcard collection operations
    │   ├── review.ts          # Review session state
    │   └── index.ts
    ├── composables/           # Vue composables (reusable logic)
    │   ├── useReviewSession.ts
    │   ├── useDashboardStats.ts
    │   └── useFlashcardFilters.ts
    ├── services/              # Business logic & data access
    │   ├── storage.ts         # LocalStorage persistence layer
    │   ├── srs.ts             # Spaced repetition calculations
    │   └── index.ts
    ├── utils/                 # Pure utility functions
    │   ├── spacedRepetition.ts
    │   └── importExport.ts
    ├── types/                 # TypeScript type definitions
    │   ├── vocab.ts           # Word, Deck, Card interfaces
    │   ├── srs.ts             # SRS config & result types
    │   ├── progress.ts        # Progress & daily stats types
    │   ├── flashcard.ts       # Flashcard interface
    │   ├── deck.ts            # Deck interface
    │   └── index.ts
    ├── lib/                   # Shared libraries
    │   ├── utils.ts           # General utilities (ID gen, date helpers)
    │   ├── constants.ts       # App-wide constants
    │   ├── logger.ts          # Structured logging
    │   └── errors.ts          # Custom error classes
    └── __tests__/             # Unit tests
        ├── utils.test.ts
        └── srs.test.ts
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript (strict mode) |
| Build Tool | Vite |
| State Management | Pinia |
| Routing | Vue Router 4 |
| HTTP Client | Axios |
| Testing | Vitest |
| Styling | Plain CSS with design tokens |
| Storage | Browser LocalStorage |

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x (or pnpm / yarn)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VocabVault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional — the app works without a backend, but you can add variables for future extensibility)
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

5. **Build for production**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` directory.

6. **Preview the production build**
   ```bash
   npm run preview
   ```

---

## Usage

### Creating Your First Deck

1. Open the app and navigate to the **Dashboard**.
2. Click **"New Deck"** and enter a name (e.g., "GRE Vocabulary").
3. Optionally add a description.

### Adding Words

1. Navigate to a deck by clicking its name.
2. Click **"Add Word"** and fill in:
   - **Term** — the word or phrase
   - **Definition** — what it means
   - **Example Sentence** — optional usage example
   - **Pronunciation** — optional phonetic spelling
   - **Tags** — optional labels for categorization
3. Click **Save** — the word is added to the deck as a flashcard.

### Reviewing Cards

1. Go to the **Review** page from the navigation.
2. Each card shows the word first. Try to recall the definition.
3. Click **Flip** to reveal the answer.
4. Rate your recall using the 0–5 scale:
   - **0** — Complete blackout
   - **1** — Incorrect response; correct one remembered
   - **2** — Incorrect response; the correct answer seemed easy to recall
   - **3** — Correct response recalled with serious difficulty
   - **4** — Correct response after a hesitation
   - **5** — Perfect recall
5. The SRS algorithm schedules the next review automatically.

### Searching & Filtering

1. Navigate to the **Flashcard Browser**.
2. Use the search bar to find words by term or definition.
3. Use the deck dropdown to filter by a specific deck.
4. Use the status filter to show only due, reviewed, or new cards.

### Importing & Exporting

1. Go to the **Import/Export** page.
2. To **export**, choose JSON (full backup) or CSV (spreadsheet-compatible) and click the export button.
3. To **import**, paste a previously exported JSON string or select a CSV file and click import.

---

## API Documentation

VocabVault is a fully client-side application. There is no backend API. All data operations go through the **Pinia stores** and **StorageService**, which persist to `localStorage`.

### Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `vv_decks` | `Deck[]` | All deck objects |
| `vv_cards` | `Card[]` | All card objects |
| `vv_words` | `Word[]` | All word objects |
| `vv_progress` | `Progress` | Progress tracking data |

### Core Interfaces

```typescript
// A vocabulary word with metadata
interface Word {
  id: string
  term: string
  definition: string
  example?: string
  pronunciation?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// A deck that groups cards
interface Deck {
  id: string
  name: string
  description?: string
  cardIds: string[]
  createdAt: Date
  updatedAt: Date
}

// A card linking a word to a deck with SRS state
interface Card {
  id: string
  wordId: string
  deckId: string
  interval: number        // Days until next review
  easeFactor: number      // Multiplier for interval growth
  repetitions: number    // Consecutive successful reviews
  dueDate: Date          // When the card is next due
  lastReviewDate?: Date  // When the card was last reviewed
  createdAt: Date
  updatedAt: Date
}

// SRS quality rating
// 0 = complete blackout, 5 = perfect recall
type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5
```

### SRS Algorithm

The review calculation follows an SM-2-inspired algorithm:

- **Quality < 3**: Reset repetitions to 0, reset interval to the initial interval (1 day).
- **Quality >= 3**: Increment repetitions. First success → 1 day, second → 6 days, subsequent → `interval × easeFactor`.
- **Ease factor adjustment**: `easeFactor += 0.1 - (5 - quality) × (0.08 + (5 - quality) × 0.02)`. Clamped to a minimum of 1.3.

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## Browser Support

VocabVault uses modern browser APIs (ES2020+, `localStorage`, `Proxy`). It is tested and supported on:

- Chrome / Edge >= 90
- Firefox >= 88
- Safari >= 14

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on development setup, code style, and the pull request process.
