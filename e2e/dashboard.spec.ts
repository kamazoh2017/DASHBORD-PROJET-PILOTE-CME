import { test, expect } from '@playwright/test'

test.describe('Dashboard CME - Home Page', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check that the sidebar is visible
    await expect(page.locator('aside')).toBeVisible()
  })

  test('should display KPI cards', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check for KPI cards presence
    const kpiCards = page.locator('[class*="grid"]').first()
    await expect(kpiCards).toBeVisible()
  })

  test('should switch language', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Click on language switcher
    await page.click('button:has-text("日本語")')
    
    // Select English
    await page.click('button:has-text("English")')
    
    // Wait for page refresh
    await page.waitForLoadState('networkidle')
    
    // Verify language changed (check for English text)
    await expect(page.locator('text=Home')).toBeVisible()
  })

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to Supervision page
    await page.click('a[href="/supervision"]')
    await page.waitForURL('**/supervision')
    expect(page.url()).toContain('/supervision')
    
    // Navigate to Application page
    await page.click('a[href="/application"]')
    await page.waitForURL('**/application')
    expect(page.url()).toContain('/application')
    
    // Navigate to Comparison page
    await page.click('a[href="/comparaison"]')
    await page.waitForURL('**/comparaison')
    expect(page.url()).toContain('/comparaison')
    
    // Navigate back to home
    await page.click('a[href="/"]')
    await page.waitForURL('**/')
    expect(page.url()).toMatch(/\/$/)
  })

  test('should display charts on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Wait for charts to render (they use canvas or svg)
    await page.waitForSelector('canvas, svg', { timeout: 10000 })
    
    const charts = page.locator('canvas, svg')
    const count = await charts.count()
    
    // Expect at least one chart to be present
    expect(count).toBeGreaterThan(0)
  })

  test('should display data table', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check for table presence
    const table = page.locator('table')
    await expect(table).toBeVisible()
    
    // Check for table headers
    const headers = page.locator('th')
    const headerCount = await headers.count()
    expect(headerCount).toBeGreaterThan(0)
  })
})

test.describe('Dashboard CME - Responsive Design', () => {
  test('should be mobile responsive', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Check that the page renders on mobile
      await expect(page.locator('body')).toBeVisible()
    }
  })
})

test.describe('Dashboard CME - Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check for h1 heading
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
  })

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // All buttons should have accessible text or aria-label
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })
})
