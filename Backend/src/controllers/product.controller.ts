import { Request, Response } from 'express';
import * as ProductService from '../services/product.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      res.status(400).json({ error: 'Name and price are required to create a product' });
      return;
    }
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    if (error.code === 'P2025' || error.code === 'P2003') {
      res.status(404).json({ error: 'Referenced category not found' });
    } else {
      res.status(500).json({ error: 'Error creating product' });
    }
  }
};

export const sync = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.syncProducts(req.body);
    res.status(201).json({ message: 'Products synced successfully', count: products.length, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error syncing products' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid or missing ID' });
      return;
    }
    const product = await ProductService.updateProduct(id, req.body);
    res.status(200).json(product);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(500).json({ error: 'Error updating product' });
    }
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid or missing ID' });
      return;
    }
    await ProductService.deleteProduct(id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }
};
