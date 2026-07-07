import { HealthController } from "../health.controller";
import { HealthService } from "../health.service";

describe("HealthController", () => {
  const setup = () => {
    const service = new HealthService();
    const controller = new HealthController(service);
    return { controller, service };
  };

  it("returns ok status", () => {
    const { controller } = setup();

    const result = controller.check();

    expect(result.status).toBe("ok");
  });

  it("includes uptime and an ISO timestamp", () => {
    const { controller } = setup();

    const result = controller.check();

    expect(typeof result.uptime).toBe("number");
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
