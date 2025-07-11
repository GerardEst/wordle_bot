const platform = Deno.env.get('PLATFORM')
let puppeteer: any = null
if (platform !== 'deno-deploy') puppeteer = await import('puppeteer')

export async function getWordSolution(): Promise<string> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    timeout: 60000,
  })
  const page = await browser.newPage()

  // Set longer timeout for CI environments
  page.setDefaultTimeout(30000)

  await page.goto(`https://gelozp.com/games/elmot/`, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  })

  console.log('Found elmot site')

  // Wait for the game to fully load
  await page.waitForFunction(
    () => {
      const gameApp = document.querySelector('game-app')
      if (!gameApp || !gameApp.shadowRoot) return false
      const keyboard = gameApp.shadowRoot.querySelector('game-keyboard')
      if (!keyboard || !keyboard.shadowRoot) return false
      const button = keyboard.shadowRoot.querySelector('button[data-key="b"]')
      return button !== null
    },
    { timeout: 30000 }
  )

  console.log('Game components loaded')

  // Helper function to safely click a button with retry logic
  async function safeClick(selector: string, keyName: string, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await page.locator(selector).click()
        console.log(`Successfully clicked ${keyName}`)
        return
      } catch (error) {
        console.log(
          `Attempt ${attempt + 1} failed for ${keyName}:`,
          error.message
        )
        if (attempt === retries - 1) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  await page.screenshot({
    path: `src/scrapping/consent.png`,
    fullPage: true,
  })

  await safeClick('button.stpd_cta_btn', 'Consent button')

  await new Promise((resolve) => setTimeout(resolve, 3000))

  await page.screenshot({
    path: `src/scrapping/prepare.png`,
    fullPage: true,
  })

  await safeClick('game-app >>> game-help >>> .close-icon', 'close help')

  await page.screenshot({
    path: `src/scrapping/prepare2.png`,
    fullPage: true,
  })

  for (let i = 0; i < 6; i++) {
    console.log(`Starting attempt ${i + 1}`)

    try {
      await safeClick(
        'game-app >>> game-keyboard >>> button[data-key="b"]',
        'b'
      )
      await new Promise((resolve) => setTimeout(resolve, 500))

      await safeClick(
        'game-app >>> game-keyboard >>> button[data-key="o"]',
        'o'
      )
      await new Promise((resolve) => setTimeout(resolve, 500))

      await safeClick(
        'game-app >>> game-keyboard >>> button[data-key="n"]',
        'n'
      )
      await new Promise((resolve) => setTimeout(resolve, 500))

      await safeClick(
        'game-app >>> game-keyboard >>> button[data-key="e"]',
        'e'
      )
      await new Promise((resolve) => setTimeout(resolve, 500))

      await safeClick(
        'game-app >>> game-keyboard >>> button[data-key="s"]',
        's'
      )
      await new Promise((resolve) => setTimeout(resolve, 500))

      await safeClick(
        'game-app >>> game-keyboard >>> button[data-key="↵"]',
        'enter'
      )

      console.log(`Try ${i + 1} completed`)

      await page.screenshot({
        path: `src/scrapping/step-${i + 1}.png`,
        fullPage: true,
      })

      // Wait longer for game processing, especially in CI
      await new Promise((resolve) => setTimeout(resolve, 5000))
    } catch (error) {
      console.error(`Failed on attempt ${i + 1}:`, error)

      // Take screenshot for debugging
      await page.screenshot({
        path: `debug-attempt-${i + 1}.png`,
        fullPage: true,
      })

      // Continue with next attempt instead of failing completely
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  // Take final screenshot before extracting the word
  await page.screenshot({
    path: `src/scrapping/final-state.png`,
    fullPage: true,
  })

  // Wait for the toast to appear with retry logic
  let word: string
  try {
    word = await page
      .locator('game-app >>> game-toast >>> .toast')
      .map((element: any) => element.textContent)
      .wait()

    console.log('Got the word: ' + word.split(' ')[1])
  } catch (error) {
    console.error('Failed to get word from toast:', error)

    // Take debug screenshot
    await page.screenshot({
      path: `src/scrapping/error-final-state.png`,
      fullPage: true,
    })

    await browser.close()
    throw new Error('Failed to extract word from game')
  }

  await browser.close()
  return word.split(' ')[1]
}

getWordSolution()
