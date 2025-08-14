# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-language Telegram bot for Wordle league competitions built with Deno, TypeScript, and Supabase. The bot tracks daily Wordle game results, maintains monthly rankings, manages virtual characters, and awards trophies to winners.

### Multi-Language Architecture

The system is designed to run as **two separate deployments** on Deno Deploy:
- **Spanish bot** (`BOT_LANG=es`): Processes `#wardle` games, uses `TELEGRAM_TOKEN_ES`
- **Catalan bot** (`BOT_LANG=cat`): Processes `#mooot` games, uses `TELEGRAM_TOKEN_CAT`

Both bots share the same codebase but operate with different environment configurations. Each bot only reacts to games from its specific language hashtag, even in chats where both bots are present.

## Development Commands

### Basic Development
```bash
# Start development server with file watching
deno task dev

# Run all tests
deno test --env --allow-env --allow-read --allow-net

# Run specific test file
deno test tests/bot/utils.test.ts --env --allow-env --allow-read

# Run tests with coverage
deno test --coverage=coverage --env --allow-env --allow-read --allow-net
```

### Bot Management
```bash
# Set webhook URLs for both bots
deno task bot:set-webhook

# Check webhook status
deno task bot:check-webhook

# Set bot commands in Telegram
deno task bot:set-commands
```

### Development CLI Tools (with dev environment)
```bash
# Send classification to test chats
deno task dev:send-classificacio

# Send time trial rankings
deno task dev:send-contrarrellotge

# Send legend/points table
deno task dev:send-llegenda

# Simulate virtual character actions
deno task dev:send-characters-actions

# Create test game records
deno task dev:create-game-record

# Simulate end of month (awards distribution)
deno task dev:simulate-end-of-month
```

### Production Cron Jobs
```bash
# Scrape today's word (runs daily in production)
deno task prod-cron:save-today-word

# Send word information to chats (runs daily)
deno task prod-cron:send-word-info

# Send character actions (runs daily)
deno task prod-cron:send-characters-actions-prod
```

## Core Architecture

### Language System (`src/interfaces.ts`, `src/translations.ts`)
- All user-facing strings are internationalized using the `t()` function
- Language type: `'es' | 'cat'`
- Bot language determined by `BOT_LANG` environment variable
- Game language detected by hashtag: `#wardle` (Spanish) or `#mooot` (Catalan)

### Game Processing Flow
1. **Message Detection**: Bot receives Telegram message
2. **Language Detection**: Checks for `#wardle` or `#mooot` hashtag
3. **Bot Language Filtering**: Only processes games matching bot's configured language
4. **Parsing**: Extracts points (1-6 based on attempts) and time from message
5. **Duplicate Check**: Ensures user hasn't played today
6. **Reaction**: Sends emoji reaction based on performance
7. **Storage**: Saves game record to Supabase with language tag

### Database Schema (Supabase)
- **games_chats**: Game records with chat_id, user_id, points, time, lang
- **users**: Player information and statistics
- **characters**: Virtual famous characters with hability ratings
- **awards**: Trophy records for monthly winners
- **bot_logs**: Persistent logging for debugging (newly added)

### Virtual Characters System
Characters are famous figures with hability ratings (1-10) that play automatically:
- High hability (8-10): Consistently good scores (e.g., Jacint Verdaguer)
- Low hability (1-3): Poor performance (e.g., Rovelló the dog)
- Points and times generated based on hability using randomized algorithms

### Monthly League System
- Rankings reset at the end of each month
- Two separate classifications: normal (by points) and time trial (by cumulative time)
- Automatic trophy distribution to top 3 players
- Consolation prizes for other participants

## File Structure

### Core Bot Logic
- `main.ts`: Entry point, determines bot language from environment
- `src/bot/startup.ts`: Bot initialization, webhook handling
- `src/bot/commands.ts`: Command handlers and message processing
- `src/bot/messages.ts`: Message formatting and generation
- `src/bot/utils.ts`: Game parsing utilities (points, time extraction)

### API Layer
- `src/api/games.ts`: Game records, rankings, and statistics
- `src/api/players.ts`: User management
- `src/api/characters.ts`: Virtual character management
- `src/api/awards.ts`: Trophy and award system
- `src/api/log.ts`: Database logging utilities

### External Services
- `src/lib/supabase.ts`: Database connection
- `src/lib/timezones.ts`: Spain timezone handling with Temporal API
- `src/scrapping/`: Web scraping for daily words

### Scheduled Tasks
- `src/cronjobs/cronjobs.ts`: Cron job setup for production
- `src/cli-tools.ts`: CLI utilities for testing and administration

## Environment Configuration

### Required Environment Variables
```bash
# Bot tokens (one per language)
TELEGRAM_TOKEN_ES=<spanish_bot_token>
TELEGRAM_TOKEN_CAT=<catalan_bot_token>

# Deployment domains
DOMAIN_ES=<spanish_bot_webhook_url>
DOMAIN_CAT=<catalan_bot_webhook_url>

# Bot language (determines which bot this deployment runs)
BOT_LANG=es|cat

# Database
SUPABASE_URL=<supabase_project_url>
SUPABASE_ANON_KEY=<supabase_anon_key>

# Development mode
ENV=dev|prod
```

## Important Implementation Details

### Game Message Parsing
Games are parsed from Telegram messages with format:
```
#wardle 123
🎯3/6
⏳00:12:34
```
- Points calculated as: `7 - attempts` (max 6 points for 1 attempt)
- Time parsed from `⏳` line in HH:MM:SS format
- `X/6` (failed game) = 0 points

### Timezone Handling
All dates use Spain timezone (`Europe/Madrid`) with proper DST handling via Temporal API. Critical for daily game detection and monthly resets.

### Error Handling Patterns
- Database operations should use try-catch with proper error logging
- Silent failures in game processing prevent bot crashes
- Webhook errors are logged but don't stop bot operation

### Testing Strategy
- Unit tests in `tests/` directory mirror `src/` structure
- Tests focus on utility functions, message formatting, and API logic
- Use `@std/assert` for assertions
- Database operations use mocked data or test environment

## Common Debugging

### Webhook Issues
1. Check webhook status: `deno task bot:check-webhook`
2. Verify bot permissions in Telegram chat
3. Check Deno Deploy logs for webhook requests

### Game Not Processing
1. Verify hashtag format (`#wardle` vs `#mooot`)
2. Check if user already played today
3. Verify bot language matches game language
4. Check bot_logs table in Supabase for errors

### Language Detection
Games are only processed when:
- Message contains correct hashtag for bot language
- Bot's `BOT_LANG` matches detected game language (`isFromLang === lang`)