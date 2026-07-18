import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, user } = req;

    // Only log mutations (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(() => {
          // Fire and forget audit log creation
          if (user && user.userId) {
            let entity = 'UNKNOWN';
            // Simple heuristics to determine entity from URL
            if (url.includes('purchase-orders')) entity = 'PURCHASE_ORDER';
            else if (url.includes('sales') || url.includes('invoices')) entity = 'INVOICE';
            else if (url.includes('products')) entity = 'PRODUCT';
            else if (url.includes('customers')) entity = 'CUSTOMER';
            else if (url.includes('stock-movements') || url.includes('stock-levels')) entity = 'STOCK';
            else if (url.includes('auth')) entity = 'AUTH';
            else if (url.includes('credit-notes')) entity = 'CREDIT_NOTE';
            else if (url.includes('payments')) entity = 'PAYMENT';

            const action = method === 'POST' ? 'CREATE' : method === 'DELETE' ? 'DELETE' : 'UPDATE';

            this.prisma.auditLog.create({
              data: {
                action,
                entity,
                entityId: url, // using URL as identifier for simplicity if ID is hard to extract
                details: JSON.stringify(body),
                userId: user.userId,
              },
            }).catch(err => console.error('Failed to save audit log:', err));
          }
        }),
      );
    }

    return next.handle();
  }
}
