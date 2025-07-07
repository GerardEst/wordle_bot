const platform = Deno.env.get('PLATFORM')

let puppeteer: any = null
import { WordInfo } from './interfaces.ts'

if (platform !== 'deno-deploy') {
  puppeteer = await import('puppeteer')
}

export function getWordInfoFake(word: string): Promise<WordInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        word,
        etymology: `${word} etymology`,
        meaning: `${word} meaning`,
      })
    }, 1000)
  })
}

export async function getWordInfo(word: string): Promise<WordInfo> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(`https://www.diccionari.cat/GDLC/${word}`)

  // Get the etymology
  const etymSelector = await page.waitForSelector('.etym')
  const etymology = await etymSelector?.evaluate((el: any) => el.textContent)

  // Get the meaning
  const meaningSelector = await page.waitForSelector('.div1')
  const meaning = await meaningSelector?.evaluate((el: any) => el.textContent)

  await browser.close()

  return {
    word: word.toUpperCase(),
    etymology: etymology.trim(),
    meaning: meaning.trim(),
  }
}
