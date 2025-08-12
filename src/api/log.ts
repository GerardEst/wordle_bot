import { supabase } from '../lib/supabase.ts'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

async function logToDatabase(
    level: LogLevel,
    message: string,
    data?: any,
    bot_lang?: string
): Promise<void> {
    try {
        const { error } = await supabase
            .from('bot_logs')
            .insert({ title: message, data: data, lang: bot_lang, type: level })

        if (error) {
            console.error('Failed to log to database:', error)
            return
        }
        console.log({ message, data })
    } catch (err) {
        console.error('Error logging to database:', err)
    }
}

export const log = {
    debug: (message: string, data?: any, bot_lang?: string) =>
        logToDatabase('debug', message, data, bot_lang),

    info: (message: string, data?: any, bot_lang?: string) =>
        logToDatabase('info', message, data, bot_lang),

    warn: (message: string, data?: any, bot_lang?: string) =>
        logToDatabase('warn', message, data, bot_lang),

    error: (message: string, data?: any, bot_lang?: string) =>
        logToDatabase('error', message, data, bot_lang),
}
