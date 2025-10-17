import Bull from 'bull';
import dotenv from 'dotenv';
import prisma from '@repo/database';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL;

interface TradeQueueJob {
    symbol: string;
    price: string;
    quantity: string;
    timestamp: number;
}

interface TradeRecord {
    symbol: string;
    price: string;
    quantity: string;
    tradeTime: Date;
}

// stream -> insert_enqueue_trades -> redis queue -> worker will pull job in groups of 100 -> update db simultaneously
export default class DatabaseQueue {
    private queue: Bull.Queue;
    private batch: TradeQueueJob[] = [];
    private batch_size: number = 100;

    constructor() {
        this.queue = new Bull<TradeQueueJob>('trade_processor', {
            redis: REDIS_URL,
        });
        this.start_worker();
    }

    private start_worker(): void {
        this.queue.process(10, async (job: Bull.Job<TradeQueueJob>) => {
            this.batch.push(job.data);

            if (this.batch.length === this.batch_size) {
                await this.process_batch();
            }
        });
    }

    private async process_batch(): Promise<void> {
        console.log('processing ------------------------------------------>');
        const records: TradeRecord[] = this.batch.map((item) => ({
            symbol: item.symbol,
            price: item.price,
            quantity: item.quantity,
            tradeTime: new Date(item.timestamp),
        }));

        await prisma.trade.createMany({
            data: records,
        });

        this.batch = [];
    }

    public async add_trade(item: MarketTrade): Promise<void> {
        const queue_job: TradeQueueJob = {
            symbol: item.symbol,
            price: item.price,
            quantity: item.quantity,
            timestamp: item.trade_timestamp,
        };

        await this.queue.add(queue_job, {
            removeOnComplete: true,
        });
    }
}

interface MarketTrade {
    symbol: string;
    price: string;
    quantity: string;
    trade_timestamp: number;
}