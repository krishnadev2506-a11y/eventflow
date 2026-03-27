const fs = require('fs');
const path = require('path');

console.log("Starting deep Next.js bundle cleanup...");

const targets = [
  'src/app/event-day',
  'src/app/messages',
  'src/components/landing/how-it-works.tsx',
  'src/components/landing/stats.tsx',
  'src/components/landing/testimonials.tsx',
  'src/components/landing/newsletter.tsx',
  'src/app/api/admin/certificates',
  'src/app/api/user/certificates'
];

targets.forEach(target => {
  const fullPath = path.join(__dirname, target);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`[PURGED] Successfully deleted dead code: ${target}`);
  }
});

console.log("Cleanup Complete. Client-side Javascript bundle natively reduced.");
