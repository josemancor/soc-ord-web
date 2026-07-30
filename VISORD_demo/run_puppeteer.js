const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    const fileUrl = `file://${path.resolve(__dirname, 'index.html')}`;
    console.log(`Loading ${fileUrl}...`);
    
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // Simulate user clicking on things
    console.log("Page loaded. Triggering UI events...");
    
    // Trigger Tour
    await page.evaluate(() => {
        const btn = document.getElementById('btn-tour');
        if (btn) btn.click();
    });
    
    await page.waitForTimeout(2000); // Wait 2s to see if tour errors
    
    // Trigger grid cells
    await page.evaluate(() => {
        document.querySelectorAll('.tc-cell').forEach(c => c.click());
    });
    
    await page.waitForTimeout(2000);
    
    await browser.close();
})();
