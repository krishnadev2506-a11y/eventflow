async function testAPI() {
  console.log("\n--- EVENTFLOW QUALITY ASSURANCE ---");
  console.log("Testing POST /api/admin/events...");
  const createRes = await fetch("http://localhost:3000/api/admin/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "QA Event Flow Telemetry Test",
      description: "Automated testing system verifying full stack db hookups.",
      location: "Cyber Space",
      date: "2026-12-01T00:00",
      capacity: 500,
      price: 100,
      category: "Test"
    })
  });
  
  const createData = await createRes.json();
  console.log("Create Response:", createData);

  if (createData.success && createData.event.id) {
    const eventId = createData.event.id;
    console.log(`\nTesting DELETE /api/admin/events/${eventId}...`);
    const deleteRes = await fetch(`http://localhost:3000/api/admin/events/${eventId}`, {
      method: "DELETE"
    });
    const deleteData = await deleteRes.json();
    console.log("Delete Response:", deleteData);
  } else {
    console.error("FAILED to create event logic.");
  }
}

testAPI();
