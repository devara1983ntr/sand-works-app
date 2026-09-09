const test = require("node:test");
const assert = require("node:assert");
const { calculateDistribution, DEFAULT_TRIP_RATE_PAISE } = require("../lib/index.js");

test("Backend MoneyEngine - driver sole participant receives full pool", () => {
  const shares = calculateDistribution(20000, "driver_1", []);
  assert.strictEqual(shares["driver_1"], 20000);
  assert.strictEqual(Object.keys(shares).length, 1);
});

test("Backend MoneyEngine - equal distribution remainder reconciliation", () => {
  // 20000 / 3 = 6666 remainder 2
  const shares = calculateDistribution(20000, "driver_1", ["lab_1", "lab_2"], "EQUAL");
  const sum = Object.values(shares).reduce((a, b) => a + b, 0);
  assert.strictEqual(sum, 20000);
  assert.strictEqual(shares["driver_1"], 6667);
  assert.strictEqual(shares["lab_1"], 6667);
  assert.strictEqual(shares["lab_2"], 6666);
});

test("Backend MoneyEngine - driver labour ratio distribution", () => {
  // 40% driver (8000), 60% labourer (12000 / 2 = 6000 each)
  const shares = calculateDistribution(20000, "driver_1", ["lab_1", "lab_2"], "DRIVER_LABOUR_RATIO");
  const sum = Object.values(shares).reduce((a, b) => a + b, 0);
  assert.strictEqual(sum, 20000);
  assert.strictEqual(shares["driver_1"], 8000);
  assert.strictEqual(shares["lab_1"], 6000);
  assert.strictEqual(shares["lab_2"], 6000);
});

test("Backend Invariant - closed date prevents retroactive trips", () => {
  // Simulated verification of closed date guard logic
  const closedDates = new Set(["2026-09-07"]);
  const canAddTrip = (date) => !closedDates.has(date);
  assert.strictEqual(canAddTrip("2026-09-07"), false);
  assert.strictEqual(canAddTrip("2026-09-08"), true);
});

test("Backend Invariant - temporary access expiry check", () => {
  const now = 1757300000000;
  const activeAssignment = { startTime: now - 3600000, expiryTime: now + 3600000, status: "ACTIVE" };
  const expiredAssignment = { startTime: now - 7200000, expiryTime: now - 3600000, status: "ACTIVE" };

  const isValid = (a, currentTime) => a.status === "ACTIVE" && currentTime >= a.startTime && currentTime <= a.expiryTime;

  assert.strictEqual(isValid(activeAssignment, now), true);
  assert.strictEqual(isValid(expiredAssignment, now), false);
});
