import { DepotsService } from './depots.service';
export declare class DepotsController {
    private readonly depotsService;
    constructor(depotsService: DepotsService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        type: string;
    }[]>;
    create(body: {
        name: string;
        location?: string;
        type: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        type: string;
    }>;
}
