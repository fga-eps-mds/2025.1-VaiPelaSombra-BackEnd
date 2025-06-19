import request from "supertest";
import app from "../app";

describe("GET /users/me", () => {
  it("deve retornar status 200", async () => {
    const response = await request(app).get("/users/me");
    expect(response.status).toBe(200);
  });

  it("deve retornar um objeto no body", async () => {
    const response = await request(app).get("/users/me");
    expect(typeof response.body).toBe("object");
  });

  it("deve retornar body definido", async () => {
    const response = await request(app).get("/users/me");
    expect(response.body).toBeDefined();
  });
});

describe("PUT /users/me", () => {
  it("deve retornar status 200 ao atualizar", async () => {
    const response = await request(app).put("/users/me").send({
      name: "Novo Nome",
      email: "novo@email.com",
      travelPreferences: { travelerType: "Montanha" },
    });
    expect(response.status).toBe(200);
  });
  
  it("deve retornar um objeto no body após atualização", async () => {
    const response = await request(app).put("/users/me").send({
      name: "Teste",
      email: "teste@email.com",
      travelPreferences: { travelerType: "Praia" },
    });
    expect(typeof response.body).toBe("object");
  });

  it("não deve retornar 404 ao atualizar", async () => {
    const response = await request(app).put("/users/me").send({
      name: "Teste404",
      email: "teste404@email.com",
      travelPreferences: { travelerType: "Campo" },
    });
    expect(response.status).not.toBe(404);
  });
});
