import express, { Response } from 'express';
import { Customer, Request, RequestCustomer, validateCustomer } from 'model';
import { BodyHandler, ParamHandler, SecurityHandler } from 'handler';

export const router = express.Router();

router.get('/', async (_req: Request, res: Response<Customer[]>) => {
  const customers = await Customer.find().sort('name');
  res.send(customers as Customer[]);
});

router.post(
  '/',
  [SecurityHandler, BodyHandler(validateCustomer)],
  async (req: Request<RequestCustomer>, res: Response<Customer>) => {
    const { name, phone, isGold } = req.body;
    const customer = new Customer({
      name,
      phone,
      isGold,
    });
    await customer.save();

    return res.send(customer as Customer);
  }
);

router.put(
  '/:id',
  [ParamHandler, SecurityHandler, BodyHandler(validateCustomer)],
  async (req: Request<RequestCustomer>, res: Response<Customer | string>) => {
    const { name, phone, isGold } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        isGold,
      },
      { new: true }
    );
    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found!');

    return res.send(customer as Customer);
  }
);

router.delete(
  '/:id',
  [ParamHandler, SecurityHandler],
  async (req: Request<RequestCustomer>, res: Response<Customer | string>) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found!');

    return res.send(customer as Customer);
  }
);

router.get(
  '/:id',
  ParamHandler,
  async (req: Request<RequestCustomer>, res: Response<Customer | string>) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found!');

    return res.send(customer as Customer);
  }
);
