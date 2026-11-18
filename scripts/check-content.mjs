// Runs before every build. Stops the deploy if required content is missing,
// so a half-filled Pages CMS form can't publish a broken page.
import { readFileSync } from 'node:fs';

const load = (p) => JSON.parse(readFileSync(new URL(`../src/content/${p}`, import.meta.url), 'utf8'));
const problems = [];
const need = (obj, keys, where) => keys.forEach((k) => {
  if (obj[k] === undefined || obj[k] === null || (typeof obj[k] === 'string' && !obj[k].trim())) problems.push(`${where}: "${k}" is empty`);
});

const site = load('settings/site.json');
need(site, ['company_name', 'product_name', 'contact_email', 'disclaimer'], 'Site settings');
if (site.contact_email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.contact_email)) problems.push('Site settings: contact email looks wrong');

const home = load('pages/home.json');
need(home, ['seo_title', 'seo_description', 'hero_title', 'hero_text'], 'Home page');
const how = load('pages/how.json');
need(how, ['seo_title', 'seo_description', 'title'], 'How it works page');
const buyers = load('pages/buyers.json');
need(buyers, ['seo_title', 'seo_description', 'title'], 'For data buyers page');

const ev = load('data/road_events.json');
(ev.events || []).forEach((e, i) => need(e, ['event_id', 'event_type'], `Road events row ${i + 1}`));
const bv = load('data/buyer_view.json');
const banned = ['customer_id', 'device_id', 'clip_id', 'source_clip_id', 'source_device_id', 'owner_customer_id'];
(bv.rows || []).forEach((r, i) => banned.forEach((k) => {
  if (k in r) problems.push(`Buyer feed row ${i + 1}: "${k}" must never appear in buyer data`);
}));

if (problems.length) {
  console.error('Content check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('Content check passed.');
