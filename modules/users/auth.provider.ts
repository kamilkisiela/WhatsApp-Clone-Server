import { Injectable, Inject, Scope } from 'graphql-modules';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secret, expiration } from '../../env';
import { validateLength, validatePassword } from '../../validators';
import { Users } from './users.provider';
import { User } from '../../db';
import { REQUEST, RESPONSE } from '../../app/session';

@Injectable({
  scope: Scope.Operation,
})
export class Auth {
  private _currentUser: User;

  constructor(
    private users: Users,
    @Inject(REQUEST) private request: Request,
    @Inject(RESPONSE) private response: Response
  ) {}

  async signIn({ username, password }: { username: string; password: string }) {
    const user = await this.users.findByUsername(username);

    if (!user) {
      throw new Error('user not found');
    }

    const passwordsMatch = bcrypt.compareSync(password, user.password);

    if (!passwordsMatch) {
      throw new Error('password is incorrect');
    }

    const authToken = jwt.sign(username, secret);

    this.response.cookie('authToken', authToken, { maxAge: expiration });

    return user;
  }

  async signUp({
    name,
    password,
    passwordConfirm,
    username,
  }: {
    name: string;
    password: string;
    passwordConfirm: string;
    username: string;
  }) {
    validateLength('req.name', name, 3, 50);
    validateLength('req.username', username, 3, 18);
    validatePassword('req.password', password);

    if (password !== passwordConfirm) {
      throw Error("req.password and req.passwordConfirm don't match");
    }

    const existingUser = await this.users.findByUsername(username);

    if (existingUser) {
      throw Error('username already exists');
    }

    return this.users.newUser({
      username,
      name,
      password,
    });
  }

  async currentUser(): Promise<User | null> {
    if (this._currentUser) {
      return this._currentUser;
    }

    if (this.request.cookies.authToken) {
      const username = jwt.verify(
        this.request.cookies.authToken,
        secret
      ) as string;

      if (username) {
        this._currentUser = await this.users.findByUsername(username);
        return this._currentUser;
      }
    }

    return null;
  }
}
