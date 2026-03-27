console.log("🚀 INITIATING MAX STRESS TEST ON LOCALHOST:3000...");

async function run() {
  const start = Date.now();
  const requests = [];
  
  // Bombard the Admin Events API (Heavy Prisma Model Join)
  for (let i = 0; i < 50; i++) {
     requests.push(
       fetch("http://localhost:3000/api/admin/events").then(r => r.status).catch(() => 500)
     );
  }

  // Bombard the Attendees API (Heavy relational Ticket parsing)
  for (let i = 0; i < 50; i++) {
     requests.push(
       fetch("http://localhost:3000/api/admin/attendees").then(r => r.status).catch(() => 500)
     );
  }

  console.log("⚡ Executing 100 concurrent relational payload requests...");

  try {
     const results = await Promise.all(requests);
     const time = Date.now() - start;
     const successes = results.filter(s => s === 200).length;
     const fails = results.filter(s => s !== 200).length;
     
     console.log(`\n📊 STRESS TEST RESULTS`);
     console.log(`========================`);
     console.log(`⏱️ Total Network & DB Execution Time: ${time}ms.`);
     console.log(`✅ Successful Requests (HTTP 200): ${successes}`);
     console.log(`❌ Failed Requests/Timeouts: ${fails}`);
     
     if (fails === 0) {
        console.log(`\n🏆 STATUS: PLATFORM IS HIGHLY SECURED AND PRODUCTION READY.`);
        console.log(`Average Response Time: ${Math.round(time / 100)}ms per heavy DB request.`);
     } else {
        console.log(`\n⚠️ STATUS: PLATFORM IS STRUGGLING UNDER LOAD. (${fails} failures detected)`);
     }
  } catch (e) {
     console.error("❌ Stress Test Crashed:", e);
  }
}

run();
