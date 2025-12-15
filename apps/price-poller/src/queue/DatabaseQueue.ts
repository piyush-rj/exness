import { Job, Queue, Worker } from "bullmq";
import queue_config from "../configs/queue.config";
import { QueueData, TradeData } from "../types/trade.types";
import prisma from "@repo/database";

export default class DatabaseQueue {
    private queue: Queue;
    private worker: Worker;
    private batch: QueueData[] = [];
    private readonly batch_limit: number = 100;

    constructor(queue_name: string) {
        this.queue = new Queue(queue_name, queue_config);

        this.worker = new Worker<QueueData>(
            queue_name,
            async (job: Job<QueueData>) => {
                this.batch.push(job.data);

                if (this.batch.length >= this.batch_limit) {
                    await this.process_batch();
                }
            },
            queue_config
        );
    }

    private async process_batch() {
        if (this.batch.length === 0) return;

        const data: TradeData[] = this.batch.map((d) => ({
            symbol: d.symbol,
            price: d.price,
            quantity: d.quantity,
            tradeTime: d.timestamp,
        }));

        await prisma.trade.createMany({
            data,
        });

        this.batch = [];
    }

    public async enqueue_job(job_data: QueueData) {
        await this.queue.add("trade", job_data);
    }
}
