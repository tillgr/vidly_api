import express, { Response } from 'express';
import { Customer, Request, RequestCustomer, validateCustomer } from 'model';
import { SecurityHandler } from 'handler';

export const router = express.Router();

router.get('/', async (_req: Request, res: Response<Customer[]>) => {
  const customers = await Customer.find().sort('name');
  res.send(customers as Customer[]);
});

router.post(
  '/',
  SecurityHandler,
  async (req: Request<RequestCustomer>, res: Response<Customer | string>) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
  SecurityHandler,
  async (req: Request<RequestCustomer>, res: Response<Customer | string>) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
  SecurityHandler,
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
  async (req: Request<RequestCustomer>, res: Response<Customer | string>) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found!');

    return res.send(customer as Customer);
  }
);
