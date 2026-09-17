# MMH – Multimomentaufnahme App

Eine Next.js 16-Webanwendung zur digitalen Durchführung von Multimomentaufnahmen (Work Sampling / MMH) nach arbeitswissenschaftlicher Methode.

## Setup

### 1. Voraussetzungen

- Node.js 18+
- PostgreSQL-Datenbank

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.local.example .env.local
```

Dann `.env.local` bearbeiten:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/mmh
AUTH_SECRET=<zufälliger-langer-string>
NEXTAUTH_URL=http://localhost:3000
```

`AUTH_SECRET` erzeugen:
```bash
openssl rand -base64 32
```

### 3. Datenbank einrichten

**Option A – Schema direkt pushen (Entwicklung):**
```bash
npm run db:push
```

**Option B – Migrationen generieren und ausführen:**
```bash
npm run db:generate
npm run db:migrate
```

### 4. App starten

```bash
npm run dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000).

## Verwendung

1. Konto registrieren unter `/auth/register`
2. Studie anlegen unter `/studies/new`
3. Produktionssysteme, Stationen, Schichten und Ablaufarten konfigurieren
4. Sollwerte (HT/NT/VS/FK) für jede Kategorie festlegen
5. Rundgänge starten und Beobachtungen erfassen
6. Auswertung unter `/observations` mit Diagrammen und CSV-Export

## Technologien

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Drizzle ORM** + PostgreSQL
- **NextAuth.js v5** (JWT, bcrypt)
- **Recharts** (Donut, Balken, Histogramm)
- **Tailwind CSS**

## Datenbankbefehle

| Befehl | Beschreibung |
|--------|-------------|
| `npm run db:push` | Schema direkt auf DB pushen |
| `npm run db:generate` | Migrationsdateien generieren |
| `npm run db:migrate` | Migrationen ausführen |
