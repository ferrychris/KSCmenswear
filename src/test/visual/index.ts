import { toMatchImageSnapshot } from 'jest-image-snapshot';
import puppeteer from 'puppeteer';

expect.extend({ toMatchImageSnapshot });

export async function captureScreenshot(url: string, options = {}) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  const screenshot = await page.screenshot({
    fullPage: true,
    ...options,
  });

  await browser.close();
  return screenshot;
}

export async function compareScreenshots(
  before: Buffer,
  after: Buffer,
  options = {}
) {
  expect(after).toMatchImageSnapshot({
    customSnapshotIdentifier: 'visual-regression',
    failureThreshold: 0.01,
    failureThresholdType: 'percent',
    ...options,
  });
}