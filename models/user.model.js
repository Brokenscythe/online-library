const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const express = require("express");

const prisma = new PrismaClient();

class User {
  constructor({ username, fullname, email, password, JMBG }) {
    this.username = username;
    this.fullname = fullname;
    this.email = email;
    this.password = password;
    this.JMBG = JMBG;
  }

  hasMatchingUsername() {
    return prisma.users.findFirst({
      where: {
        username: this.username,
      },
    });
  }

  hasMatchingEmail() {
    return prisma.users.findFirst({
      where: {
        email: this.email,
      },
    });
  }

  async existsAlready() {
    const existingUser =
      (await this.hasMatchingUsername()) || (await this.hasMatchingEmail());
    if (existingUser) {
      return true;
    }
    return false;
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    await prisma.users.create({
      data: {
        username: this.username,
        fullname: this.fullname,
        email: this.email,
        password: hashedPassword,
        JMBG: this.JMBG,
      },
    });
  }
}

module.exports = User;
