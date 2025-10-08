import { supabase } from "../lib/supabase.ts";
import { supalog } from './log.ts'

export async function updateChartName(chatId: number, newName: string) {
    console.log(`Updating chat name ${chatId}`);
    try {
        const { data, error } = await supabase
            .from('chats')
            .upsert({ id: chatId, name: newName })
            .eq('id', chatId)
            .select()

        if (error) throw error

        supalog.debug(JSON.stringify(data))

        console.log(data)
    } catch (error) {
        console.error(error)
        supalog.debug(JSON.stringify(error))
    }
}

export async function getChatName(chatId: number) {
    try {
        const { data: chats, error } = await supabase
            .from('chats')
            .select('name')
            .eq('id', chatId)

        if (error) throw error

        console.log(chats)

        return chats
    } catch (error) {
        console.error(error)
    }
}