module.exports = {
  jwt: {
    JWT_TOKEN_SECRET: "ff8d71476e7f985ce7382116244fdbf4354c77958259ba90e76f6c213fdc3db09acf225dc802c3f8dbba6344d95e9f18c6354ad7f1005afedf1e9d95ae6f969a45595700d8287f6a2a933f16df4bdd27ae1ac6f1dc7a64b87f399d2af2587cbc552f556481ad9442053726d986aeb33ea88b95f6b29cbdb172cd975b7d13fcbb569d7e1746f3102f41b7ed0fe6babcee1f2d46e23167b294025694822697fa4ce2177a5dbbe68f31637ca295fe3efd7a898311c9aa69680e922c1badd5ec1b05d8499c0e5c7f6093d573a19ca10f77287e85718bc626555b3c0fc626182e5f69448055d2609b219cd258e15757b79f33823133bdaddfe23b1d5929967fa781d3",
    JWT_EXPIRY_TIME: "86400s"
  },
  cookie: {
    name: "token",
    maxAge: 86400000,
    path: "/"
  }
}