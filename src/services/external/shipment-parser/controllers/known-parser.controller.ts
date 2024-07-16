import { Request, Response } from 'express';
import { parseShipment } from '../parsers/known-parser';
import { ShipmentInput } from '../types';

export async function knownParserController(req: Request, res: Response) {
  try {
    const inputJson: ShipmentInput = req.body;

    if (!inputJson || Object.keys(inputJson).length === 0) {
      return res
        .status(400)
        .json({ error: 'Invalid input: Empty or missing request body' });
    }

    const result = await parseShipment(inputJson);

    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({ error: result.error });
    }
  } catch (error: any) {
    console.error('Error in knownParserController:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
