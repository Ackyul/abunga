import { Request, Response } from 'express';
import * as CategoryService from '../services/category.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required to create a category' });
      return;
    }
    const category = await CategoryService.createCategory({ name, description });
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Category with this name already exists' });
    } else {
      res.status(500).json({ error: 'Error creating category' });
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
    await CategoryService.deleteCategory(id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(500).json({ error: 'Error deleting category' });
    }
  }
};
