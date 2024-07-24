import express from 'express';
import shipmentParserRouter from './routes/shipment-parser.routes';
import knownParserRoutes from './routes/known-parser.routes';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from /src/.env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/shipment-parser', shipmentParserRouter);
app.use('/shipment-parser', knownParserRoutes);

app.listen(PORT, () => {
  console.log(`Shipment Parser Service is running on port ${PORT}`);
});
