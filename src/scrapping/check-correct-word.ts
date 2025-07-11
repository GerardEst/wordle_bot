const platform = Deno.env.get('PLATFORM')
let puppeteer: any = null
if (platform !== 'deno-deploy') puppeteer = await import('puppeteer')

export async function getWordSolution(): Promise<string> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  await page.goto(`https://gelozp.com/games/elmot/`)

  console.log('Found elmot site')

  for (let i = 0; i < 7; i++) {
    await page
      .locator('game-app >>> game-keyboard >>> button[data-key="b"]')
      .click()
    await page
      .locator('game-app >>> game-keyboard >>> button[data-key="o"]')
      .click()
    await page
      .locator('game-app >>> game-keyboard >>> button[data-key="n"]')
      .click()
    await page
      .locator('game-app >>> game-keyboard >>> button[data-key="e"]')
      .click()
    await page
      .locator('game-app >>> game-keyboard >>> button[data-key="s"]')
      .click()
    await page
      .locator('game-app >>> game-keyboard >>> button[data-key="↵"]')
      .click()

    console.log(`Try ${i} simulated`)

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  // await page.screenshot({
  //   path: `src/scrapping/ready-to-get-word.png`,
  //   fullPage: true,
  // })
  const word = await page
    .locator('game-app >>> game-toast >>> .toast')
    .map((button: any) => button.textContent)
    .wait()

  console.log('Got the word: ' + word.split(' ')[1])

  await browser.close()
  return word.split(' ')[1]
}
