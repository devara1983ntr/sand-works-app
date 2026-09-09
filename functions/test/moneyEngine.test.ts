import { calculateDistribution, DEFAULT_TRIP_RATE_PAISE } from "../src/index";

describe("Backend Financial Authority - MoneyEngine", () => {
  test("driver sole participant receives entire pool", () => {
    const shares = calculateDistribution(20000, "driver1", []);
    expect(shares["driver1"]).toBe(20000);
    expect(Object.keys(shares).length).toBe(1);
  });

  test("equal distribution among driver and 2 labourers with exact remainder reconciliation", () => {
    // 20000 paise / 3 = 6666 paise each, remainder 2 paise
    // First 2 participants get 6667, third gets 6666. Sum must equal 20000.
    const shares = calculateDistribution(20000, "driver1", ["lab1", "lab2"], "EQUAL");
    const total = Object.values(shares).reduce((a, b) => a + b, 0);
    expect(total).toBe(20000);
    expect(shares["driver1"]).toBe(6667);
  });

  test("driver labour ratio distribution", () => {
    // 40% driver (8000 paise), 60% labour pool (12000 paise) split across 3 labourers (4000 each)
    const shares = calculateDistribution(20000, "driver1", ["lab1", "lab2", "lab3"], "DRIVER_LABOUR_RATIO");
    const total = Object.values(shares).reduce((a, b) => a + b, 0);
    expect(total).toBe(20000);
    expect(shares["driver1"]).toBe(8000);
    expect(shares["lab1"]).toBe(4000);
    expect(shares["lab2"]).toBe(4000);
    expect(shares["lab3"]).toBe(4000);
  });

  test("invalid pool or empty driver returns empty object", () => {
    expect(calculateDistribution(0, "driver1", ["lab1"])).toEqual({});
    expect(calculateDistribution(-500, "driver1", ["lab1"])).toEqual({});
    expect(calculateDistribution(20000, "", ["lab1"])).toEqual({});
  });
});
