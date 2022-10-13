const axios = require("axios");
const { faker } = require("@faker-js/faker");
const { server } = require("../../src/network");

const URL = `http://localhost:${process.env.PORT}`;

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("E2E test: Use cases from e-commerce", () => {
  const nameClient = faker.name.firstName();
  const lastNameClient = faker.name.lastName();
  const newClient = {
    name: nameClient,
    lastName: lastNameClient,
    email: faker.internet.email(nameClient, lastNameClient).toLowerCase(),
    password: faker.datatype.string(),
    role: 2,
  };
  const tokensClient = {
    accessToken: "",
    refreshToken: "",
  };
  let idClient = {}

  describe("Testing save client", () => {
    let response = {};
    test("Should return 201 as status code", async () => {
      response = await axios.post(`${URL}/api/user/signup`, newClient);
      expect(response.status).toBe(201);
      idClient = response.data.message._id
    });
  });

  describe("Testing login a client", () => {
    const keys = ["accessToken", "refreshToken"];

    test("Should return accessToken and refreshToken", async () => {
      const {
        data: { message },
      } = await axios.post(`${URL}/api/user/login`, {
        email: newClient.email,
        password: newClient.password,
      });

      expect(Object.keys(message)).toEqual(keys);
      tokensClient.accessToken = message.accessToken;
      tokensClient.refreshToken = message.refreshToken;
    });
  });

  describe("Testing charge balance", () => {
    test("Should return user information", async () => {
      const {
        data: { message: user },
      } = await axios.post(
        `${URL}/api/user/charge`,
        {
          amount: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${tokensClient.accessToken}`,
          },
        }
      );

      expect(user.email === newClient.email).toBe(true);
    });
  });

  const nameSalesperson = faker.name.firstName();
  const lastNameSalesperson = faker.name.lastName();
  const newSalesperson = {
    name: nameSalesperson,
    lastName: lastNameSalesperson,
    email: faker.internet
      .email(nameSalesperson, lastNameSalesperson)
      .toLowerCase(),
    password: faker.datatype.string(),
    role: 3,
  };
  const tokensSalesperson = {
    accessToken: "",
    refreshToken: "",
  };
  let article = {};
  let idSalesperson = {}

  describe("Testing save salesperson", () => {
    let response = {};
    test("Should return 201 as status code", async () => {
      response = await axios.post(`${URL}/api/user/signup`, newSalesperson);
      expect(response.status).toBe(201);
      idSalesperson = response.data.message._id
    });
  });

  describe("Testing login a salesperson", () => {
    const keys = ["accessToken", "refreshToken"];

    test("Should return accessToken and refreshToken", async () => {
      const {
        data: { message },
      } = await axios.post(`${URL}/api/user/login`, {
        email: newSalesperson.email,
        password: newSalesperson.password,
      });

      expect(Object.keys(message)).toEqual(keys);
      tokensSalesperson.accessToken = message.accessToken;
      tokensSalesperson.refreshToken = message.refreshToken;
    });
  });

  describe("Testing save article", () => {
    const newArticle = {
      name: faker.commerce.productName(),
      price: 2000,
      description: faker.commerce.productDescription(),
    };
    test("Should return the article created", async () => {
      const {
        status,
        data: { message },
      } = await axios.post(`${URL}/api/article`, newArticle, {
        headers: {
          Authorization: `Bearer ${tokensSalesperson.accessToken}`,
        },
      });

      expect(status).toBe(201);
      article = message;
    });
  });

  describe("Testing client tries to buy an article", () => {
    describe("Testing insufficient balance", () => {
      const data = {};
      test("Should return 400 as status code", async () => {
        const response = await axios.post(
          `${URL}/api/article/${article._id}/buy`,
          data,
          {
            headers: {
              Authorization: `Bearer ${tokensClient.accessToken}`,
            },
          }
        );

        expect(response.status).toBe(400);
      });
    });

    describe("Testing sufficient balance", () => {
      const data = {};
      test("Should return 200 as status code", async () => {
        await axios.post(
          `${URL}/api/user/charge`,
          {
            amount: 1000,
          },
          {
            headers: {
              Authorization: `Bearer ${tokensClient.accessToken}`,
            },
          }
        );
        const response = await axios.post(
          `${URL}/api/article/${article._id}/buy`,
          data,
          {
            headers: {
              Authorization: `Bearer ${tokensClient.accessToken}`,
            },
          }
        );

        expect(response.status).toBe(200);
      });
    });

    describe("Testing the balance passes from the client's account to the salespeson's account", () => {
      test("Should return the client balance at 0 and the salesperson balance at 2000", async () => {
        const {
          data: { message : client },
        } = await axios.get(
          `${URL}/api/user/${idClient}`,
          {
            headers: {
              Authorization: `Bearer ${tokensClient.accessToken}`,
            },
          }
        );

        const {
          data: { message : salesperson },
        } = await axios.get(
          `${URL}/api/user/${idSalesperson}`,
          {
            headers: {
              Authorization: `Bearer ${tokensSalesperson.accessToken}`,
            },
          }
        );

        expect(client.balance).toBe(0);
        expect(salesperson.balance).toBe(2000);
      });
    });

    describe("Testing The article goes from the seller's account to the customer's account", () => {
      test("The name of the owner should match the name of the client", async () => {
        const {
          data: { message : articleUpdate },
        } = await axios.get(`${URL}/api/article/${article._id}`, {
          headers: {
            Authorization: `Bearer ${tokensClient.accessToken}`,
          },
        });

        const {
          data: { message: user },
        } = await axios.get(`${URL}/api/user/${articleUpdate.owner}`, {
          headers: {
            Authorization: `Bearer ${tokensClient.accessToken}`,
          },
        });

        expect(user.name === newClient.name).toBe(true);
      });
    });
  });
});
