import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
    try {
        if (!req.file) {
             res.status(400).json({ error: 'No image provided' });
             return;
        }
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        
        res.status(200).json({ url: imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading image' });
    }
};
