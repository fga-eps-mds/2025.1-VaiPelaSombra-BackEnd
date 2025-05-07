import { Request, Response } from 'express';

export class ExampleController {
  static getExample(req: Request, res: Response) {
    res.json({ message: 'Welcome to our API!' });
  }
}
