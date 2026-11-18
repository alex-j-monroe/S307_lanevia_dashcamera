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

const claims = load('pages/claims.json');
need(claims, ['seo_title', 'seo_description', 'title', 'intro', 'honest_text'], 'Claim Vault page');
(claims.faq || []).forEach((f, i) => need(f, ['q', 'a'], `Claim Vault FAQ ${i + 1}`));
// Promises that must stay true to the database rules (CLAIM_SHARE never feeds SHARE_RECORD).
const never = (claims.access || []).find((a) => /data buyers/i.test(a.who));
if (!never || never.answer !== 'Never') problems.push('Claim Vault page: the "Data buyers" row must say "Never"');
(home.features || []).forEach((f, i) => {
  if (f.link && !f.link.startsWith('/') && !/^https?:\/\//.test(f.link)) problems.push(`Home feature ${i + 1}: link must start with / or http`);
});

const ev = load('data/road_events.json');
(ev.events || []).forEach((e, i) => need(e, ['event_id', 'event_type'], `Road events row ${i + 1}`));
const bv = load('data/buyer_view.json');
const banned = ['customer_id', 'device_id', 'clip_id', 'source_clip_id', 'source_device_id', 'owner_customer_id'];
(bv.rows || []).forEach((r, i) => banned.forEach((k) => {
  if (k in r) problems.push(`Buyer feed row ${i + 1}: "${k}" must never appear in buyer data`);
}));

const ns = load('data/north_split_demo.json');
const ids = new Set((ns.events || []).map((e) => e.id));
(ns.events || []).forEach((e, i) => {
  need(e, ['id', 'type', 'lat', 'lon', 'x', 'y'], `North Split event ${i + 1}`);
  if (e.x < 0 || e.x > 800 || e.y < 0 || e.y > 600) problems.push(`North Split event ${e.id}: x/y must be inside the 800 x 600 map`);
});
(ns.detections || []).forEach((d, i) => {
  if (!ids.has(d.event)) problems.push(`North Split sighting ${i + 1}: event "${d.event}" does not exist`);
  if (d.minute < 0 || d.minute > ns.duration_min) problems.push(`North Split sighting ${i + 1}: minute is outside the playback`);
});

if (problems.length) {
  console.error('Content check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('Content check passed.');
