import { WordInfo } from './interfaces.ts'

const platform = Deno.env.get('PLATFORM')
let puppeteer: any = null
if (platform !== 'deno-deploy') puppeteer = await import('puppeteer')

export function getWordInfoFake(word: string): Promise<WordInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        word,
        etymology: [`${word} etymology`],
        meaning: [`${word} meaning`],
      })
    }, 1000)
  })
}

export async function getWordInfo(word: string): Promise<WordInfo> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(
    `https://www.diccionari.cat/cerca/gran-diccionari-de-la-llengua-catalana?search_api_fulltext_cust=${word}&search_api_fulltext_cust_1=&field_faceta_cerca_1=5065&show=title`
  )

  // Get all etymologies
  const etymSelectors = await page.$$('.etym')
  const etymologies = await Promise.all(
    etymSelectors.map(async (selector: any) => {
      const text = await selector.evaluate((el: any) => el.textContent)
      return text?.trim() || ''
    })
  )

  // Get all meanings
  const meaningSelectors = await page.$$('.div1')
  const meanings = await Promise.all(
    meaningSelectors.map(async (selector: any) => {
      const text = await selector.evaluate((el: any) => el.textContent)
      if (!text) return ''

      const cleanText = text
        .replace(/Vegeu\s+també:.*$/gim, '')
        .replace(/\s+/g, ' ')
        .trim()

      return cleanText
    })
  )

  await browser.close()

  return {
    word: word.toUpperCase(),
    etymology: etymologies.filter((etym) => etym.length > 0),
    meaning: meanings.filter((meaning) => meaning.length > 0),
  }
}
